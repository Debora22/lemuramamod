'use strict';

angular
.module('common')
.service('trackingService', [
    'trackv2',
    'sectionService',
    'trackingAPIService',
    function(
        trackv2,
        sectionService,
        trackingAPIService
    ) {

        /**
         *
         * It sets the filter metadata array according to the current filters value.
         * The structure of the default metadata is a key, boolean value.
         *
         * @param {Object} filtersValue Current filters value in the application
         * @param {String} action media status action i.e. 'reject', 'approve'
         */
        this.getFilterMetadata = function(filtersValue, action) {
            var filterKeys = [
                'repost',
                'mirror_selfie',
                'collage'
            ];
            var metadataValue = [];

            // If some photo filter is defined set the metadata data
            Object.keys(filtersValue.query.filters).forEach(function(key) {
                if (filterKeys.indexOf(key) > -1) {
                    metadataValue.push({
                        key: 'filter_' + key + 'Value',
                        value: 'true'
                    });
                }
            });

            // If nsfw filter is defined and it's in the correct action set a new metadata with its value
            // Probably, in the future we are going to add this filter metadata for all the actions
            if (filtersValue.query.filters.nsfw && action === 'reject') {
                metadataValue.push({
                    key: 'nsfwSliderFilterValue',
                    value: filtersValue.query.filters.nsfw.values.range.min.toString()
                });
            }

            return metadataValue.length ? metadataValue : undefined;
        };

        /**
        * @name event
        * @desc Adds an event to be tracked when flushed
        * @param {string} eventType the name of the event
        * @param {Object} entity a related entity
        * @param {Object} options Optional. on options object, example: {single: true}
        * @param {Object} relatedEntity Optional. a entity related to the main entity. example, a Stream when tagged
        * on a media
        * @param {Object} metadata Optional. metadata related to the main entity. example, a filter value
        */
        this.event = function(eventType, entity, options, relatedEntity, metadata) {
            options = options || {};

            // TODO: This will be deleted in the future. This is a hack for the BI team to avoid changing the current reports.
            var section = sectionService.getName() === 'qa' ? 'moderation' : sectionService.getName();

            trackv2.addEvent(section, eventType, entity, relatedEntity, metadata);
        };

        /**
        * @name flush
        * @desc flush the added events
        */
        this.flush = function() {
            //We send a keepalive event every time the user perform an action with some media (i.e. Reject, Approve, etc)
            //This way we are able to calculate the time counter after a browser crash, session loss, connectivity loss, etc)
            //We do it at the same moment we send events to BI due to we want to be consistent with BI team that
            //is also calculating moderators working time by using the same events
            trackingAPIService.keepAliveTime();

            trackv2.flush();
       };
    }
]);
