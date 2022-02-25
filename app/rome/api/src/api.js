'use strict';

/**
 * @ngdoc object
 * @name op.api
 * @description
 *
 * This is the main script for the module and will contain the
 * enabled endpoints to be consumed.
 */
angular
    .module('op.api', [])

    .constant('API_MEDIA_STATUSES', {
        pending: 'pending',
        onPremod: 'on-premod',
        deletedOnPremod: 'deleted-on-premod',
        deletedOnTagging: 'deleted-on-tagging',
        qrPremod: 'in-qa-after-premod',
        qrTagging: 'in-qa-after-tagging',
        qrRejected: 'in-qa-after-rejected',
        approved: 'approved',
        dontApproved: 'dont-approved',
        savedForLater: 'saved-for-later',
        tagging: 'waiting-for-tag',
        customerPremod: 'on-custom-premod',
        spam: 'marked-as-spam-in-moderation',
        deleted: 'deleted'
    })
    /**
     * Normalize the media statuses ID using their names
     */
    .constant('API_MEDIA_STATUSES_ID', {
        PENDING: 20,
        PREMOD: 21,
        PREDELETED: 9,
        DELETED_TAGGING: 12,
        QA_REJECTED: 51,
        QA_PREMOD: 13,
        QA_TAGGING: 14,
        OK: 40,
        SFL: 23,
        TAGGING: 25,
        CUSTOMER_PREMOD: 24,
        SPAM: 11,
        MOD_SPAM: 15,
        DELETED: 1,
        REPORTED: 22
    })

    /**
     * Defined the available endpoints, each key should
     * be the category and inside the list of endpoints.
     * Note that each "category" will be represented on a file
     * inside the services/ folder. Eg: authServer - AuthServerAPIService
     */
    .constant('apiConfig', {
        photorank: {
            endpoints: {
                customers: {
                    getOne: '/customers/{customerId}'
                },
                media: {
                    getOne: '/media/{mediaId}',
                    getStreams: '/media/{mediaId}/streams'
                },
                stream: {
                    getOne: '/streams/{streamId}'
                }
            }
        },
        curation: {
            endpoints: {
                getCustomer: '/customer',
                stats: '/curation/stats/',
                sortedMediaByStatus: '/curation/media/statuses/{name}/media/{sorting}',
                getMedia: '/curation/media/{mediaId}',
                getStream: '/curation/streams/{streamId}',
                linkStatusToMedia: '/curation/media/statuses/{statusName}/'
            }
        },
        authServer: {
            endpoints: {
                login: '/api/login/',
                logout: '/api/logout/',
                session: '/api/session',
                loginCallback: '/sso/callback'
            }
        },
        adminAPI: {
            endpoints: {
                customer: {
                    getCustomer: '/customer'
                },
                media: {
                    single: '/media/{mediaId}',
                    bulk: '/media',
                    status: '/media/status',
                    metadataApprove: 'media/metadata/approve',
                    getStreamPositions: '/media/streams/positions',
                    getSuggestedStream: '/media/{mediaId}/streams/suggestions',
                    postCropSuggestions: '/media/{mediaId}/streams/suggestions',
                    postStreamPositions: '/media/{mediaId}/streams/positions',
                    postStreamPositionsBulk: '/media/streams/positions?media_ids={mediaId}',
                    getAnnotations: '/media/{mediaId}/annotations'
                },
                stream: {
                    mediaPositions: '/streams/{streamId}/media/positions',
                },
                curation: {
                    mediaPositions: '/curation/stream/{streamId}/media_positions'
                },
                rights: {
                    given: '/rm/rights/given',
                    requested: '/rm/rights/requested'
                },
                comments: '/comments/',
                facebook: {
                    settings: '/facebook/settings',
                    accounts: '/facebook/ad-accounts',
                    instagramAccounts: '/facebook/ad-accounts/instagram',
                    pages: '/facebook/pages',
                    post: '/facebook/posts',
                    postToInstagram: '/facebook/instagram-ads',
                    images: '/facebook/images'
                },
                updateStreamsPosition: '/curation/media/{mediaId}/stream_positions',
                blacklist: '/users/blacklist'
            }
        },
        trackingAPI: {
            endpoints: {
                timeTracking: {
                    pause: '/tracking/time/pause',
                    resume: '/tracking/time/resume',
                    stop: '/tracking/time/stop',
                    keepalive: '/tracking/time/keepalive',
                    time: '/tracking/time'
                },
                actionTracking: {
                    counters: '/tracking/actions',
                    reset: '/tracking/reset_counters'
                },
                submission: '/tracking/submission'
            }
        }
    });
