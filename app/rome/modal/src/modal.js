'use strict';

/**
 * @ngdoc object
 * @name op.modal
 * @description
 *
 * This is the main script of the op.modal module,
 * will only contain the initialize.
 *
 */
angular
    .module('op.modal', ['ui.bootstrap', 'op.annotable'])
    .constant('ROME_MODAL_EVENTS', {
        opened: 'rome:modal:opened',
        move: 'rome:modal:move',
        closed: 'rome:modal:closed'
    });
