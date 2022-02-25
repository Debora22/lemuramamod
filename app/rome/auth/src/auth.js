'use strict';

/**
 * @ngdoc object
 * @name op.auth
 * @description
 *
 * This is the main script for the module.
 */
angular
    .module('op.auth', ['ngStorage'])
    /**
     * Define a list of posible response codes
     */
    .constant('RESPONSE_CODES', {
        0: 'Invalid or corrupted response from the server. Try again!',
        1: 'Hmm, wrong email or password. Try again!'
    })
    /**
     * The normalized name of the supported scopes
     */
    .constant('AUTH_SCOPES', {
        public: 'public',
        curation: 'curation',
        moderation: 'lemurama.moderation',
        tagging: 'lemurama.tagging',
        premod: 'lemurama.premod',
        qa: 'lemurama.qa',
        rights: 'lemurama.rm',
        medialibrary: 'admin.medialibrary'
    })
    .constant('CUSTOMER_MOCK', {
        name: 'Customer Mock',
        email: 'customermock@olapic.com',
        id: 0
    });
