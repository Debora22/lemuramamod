'use strict';

angular
.module('op.masterMind')
.factory('BackendService', [
    '$q',
    'appConstant',
    'apiService',
    'authService',
    'AUTH_SCOPES',
    'adminAPIService',
    function(
        $q,
        appConstant,
        apiService,
        authService,
        AUTH_SCOPES,
        adminAPIService
    ) {
        return function(settings) {

            var _this = this;
            settings = settings || {};

            var refillMediaStreams = function(entity, streams) {
                entity.streams.length = 0;
                if (angular.isArray(streams) && streams.length) {
                    streams.forEach(function(stream) {
                        _this.fillBaseImage(stream);
                        entity.streams.push(stream);
                    });
                }
                return entity.streams;
            };

            var getBase = function(n, base) {
                base = base || 33;
                n = parseInt(n);
                var codeset = '23456789abcdefghijkmnopqrstuvwxyz',
                    key = '';
                while (n > 0) {
                    key += codeset[n % base];
                    n = Math.floor(n / base);
                }
                return key;
            };

            var getBaseUrl = function(key) {
                return appConstant.base_image.url + key[0] + '/' + key[1] + '/' + key[2] + '/' + key + '/normal.jpg';
            };

            this.extractStreamsFromMediaBatch = function(batch) {
                // call to reduce to return only the streams shared by all the media in the batch
                return batch.reduce(function(mediaA, mediaB) {
                    return {
                        streams: mediaA.streams.filter(function(streamA) {
                            return mediaB.streams.filter(function(streamB) {
                                return streamA.id === streamB.id;
                            }).length;
                        })
                    };
                }).streams;
            };

            this.prepareAggs = function(res) {
                var words = {
                    media_type: 'Media Type',
                    deleted_by: 'Deleted',
                    rights: 'Rights Status',
                    stream: 'Streams',
                    source: 'Media Source',
                    source_group: 'Collection Method',
                    user: 'Username',
                    keywords_raw: 'Metadata',
                    rights_programmatic: 'Request Rights',
                    mentioned_username: 'Mentions',
                    with_labels: 'With labels',
                    without_labels: 'Without labels',
                    detected_languages: 'Languages'
                };
                res.data.aggs.forEach(function(agg) {
                    if (agg.key === 'rights_programmatic') {
                        var labels = {
                            is_programmatic: 'In Platform',
                            is_not_programmatic: 'via Rights Requester',
                        };
                        var descriptions = {
                            is_programmatic: '@mentions and Twitter',
                            is_not_programmatic: 'hashtag, places, tags.',
                        };
                        agg.values.forEach(function(value) {
                            value.description = descriptions[value.label];
                            value.label = labels[value.label];
                        });
                    }
                    if (agg.key === 'rights') {
                        var values = {
                            'NOT-REQUESTED': 'No Rights',
                            REQUESTED: 'Request Pending',
                            GIVEN: 'Rights Approved',
                            'RIGHTS-REQUEST-EXPIRED': 'Request Expired'
                        };
                        agg.values.forEach(function(value) {
                            value.label = values[value.name];
                        });
                    }
                    if (agg.key === 'source') {
                        agg.values.forEach(function(value) {
                            if (value.name === 'upload') {
                                value.label = 'Hard Drive';
                            }
                        });
                    }
                    if (agg.key === 'source_group') {
                        agg.values.forEach(function(value) {
                            switch (value.name) {
                                case 'olapic_collector':
                                    value.label = 'Olapic Collector';
                                    break;
                                case 'email_uploader':
                                    value.label = 'Email Uploader';
                                    break;
                            }
                        });
                    }
                    agg.label = words[agg.key] ? words[agg.key] : null;
                });

                return $q.when(res);
            };

            this.fillMediaData = function(res) {
                if (res.data.media.length) {
                    if (res.data.streams) {
                        // if response.data have streams, we don't need to make an extra request
                        res.data.media.forEach(function(m) {
                            m.streams = [];
                            refillMediaStreams(m, adminAPIService.extractStreamPositions(res, m.id, true));
                        });
                    } else {
                        // make an extra request to load streams
                        res.data.media.forEach(function(m) {
                            m.streams = [];
                        });
                        // RETURNS the promise here when we ask for media streams on separated query
                        return adminAPIService.getStreamsPositions(
                            res.data.media.map(function(i) { return i.id; })
                        )
                        .then(function(all) {
                            res.data.media.map(function(m) {
                                refillMediaStreams(m, all[m.id]);
                            });
                            return res;
                        });
                    }
                }
                // RETURNS from here when there is no media or the media already have streams
                return res;
            };

            this.addProperties = function(res) {
                res.data.media.forEach(function(m) {
                    if (m.source.name === 'instagram' && !m.source.data.url) {
                        m.source.data.url = '//www.instagram.com/' + m.user.username;
                    }
                });

                return res;
            };

            this.fillBaseImage = function(stream) {
                var key;
                stream.image = undefined;
                if (stream._embedded && stream._embedded.base_image) {
                    stream.base_image = stream._embedded.base_image.images.normal;
                } else if (stream.base_media_id || stream.base_media && stream.base_media.id) {
                    key = getBase(stream.base_media_id || stream.base_media.id);
                    if (key.length) {
                        stream.image = getBaseUrl(key);
                        stream.base_image = stream.image;
                    }
                }
            };

            /**
             * @name extractAllStreamsFromMedia
             * @desc replaces the current basic streams on the media with the corresponding full streams entity,
             *       i.e, with base image, status, etc... )
             * @param {Object} the media to be hydrated
             * @returns {Promise} the promise of the request.
             */
            this.extractAllStreamsFromMedia = function(entity) {
                return $q.when(entity.streams);
            };

            this.findStreamInMedia = function(media, streamId) {
                return media.streams.map(function(m) {
                    return m.id;
                }).indexOf(streamId);
            };

            this.findMediaById = function(media, mediaId) {
                return media.map(function(m) {
                    return Number(m.id);
                }).indexOf(Number(mediaId));
            };

            this.checkRights = function(entity) {
                return (
                    ['instagram', 'twitter'].indexOf(entity.source.name) > -1 &&
                    entity.rights === 'NOT-REQUESTED' &&
                    authService.getScopes().indexOf(AUTH_SCOPES.rights) > -1);
            };

            this.checkIfEntitySupportRights = function(data) {
                if (!angular.isArray(data)) {
                    return _this.checkRights(data);
                } else {
                    if (data.length === 1) {
                        return _this.checkRights(data[0]);
                    } else {
                        /* For bulk mode we only check if the customer has the SCOPE,
                        but we don't check the status of rights on the media or the
                        source. */
                        return authService.getScopes().indexOf(AUTH_SCOPES.rights) > -1;
                    }
                }
            };

            this.checkIfEntitySupportsComments = function(data) {
                if (!angular.isArray(data)) {
                    data = [data];
                }
                var supports = false,
                    supportedSources = ['twitter', 'instagram'],
                    i;
                for (i = 0; i < data.length; i++) {
                    if (supportedSources.indexOf(data[i].source.name.toLowerCase()) > -1) {
                        supports = true;
                        break;
                    }
                }
                return supports;
            };

            this.extractAdminAPIBulkResults = function(response) {
                var result = {
                    ok: (response.data.successful > 0) ? true : '',
                    failed: (response.data.failed > 0) ? true : '',
                    errors: []
                };

                angular.forEach(response.data.processed, function(mediaResult) {
                    if (!mediaResult.result) {
                        if (result.errors.indexOf(mediaResult.msg) === -1) {
                            result.errors.push(mediaResult.msg);
                        }
                    }
                });

                return result;
            };

            this.linkStreamsToMedia = function(media, streamToLink, streamToUnlink) {
                return (angular.isArray(media) ?
                    adminAPIService.postStreamsPositions(media.map(function(mediaItem) {return mediaItem.id;}), {
                        link: streamToLink.map(function(stream) {return stream.id;}),
                        unlink: streamToUnlink.map(function(stream) {return stream.id;}),
                        positions: []
                    }).then(function(result) {
                        media.forEach(function(mediaItem) {
                            refillMediaStreams(mediaItem, result[mediaItem.id]);
                        });
                        return result;
                    }) :
                    adminAPIService.postStreamsPositions(media.id, {
                        link: streamToLink,
                        unlink: streamToUnlink.map(function(stream) {
                            return {
                                id: stream.id,
                                annotationId: stream.annotation ? stream.annotation.persitedEntityID : null
                            };
                        }),
                        positions: media.streams.map(function(stream) {return stream.id;})
                    }).then(function(result) {
                        refillMediaStreams(media, result[media.id]);
                        return result;
                    })
                );
            };
        };
    }
]);
