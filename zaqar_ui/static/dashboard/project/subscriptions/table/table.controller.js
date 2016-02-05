/**
 * Copyright 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

(function() {
  'use strict';

  /**
   * @ngdoc overview
   * @name subscriptionsTableController
   * @ngController
   *
   * @description
   * Controller for the subscriptions table
   */
  angular
    .module('horizon.dashboard.project.subscriptions')
    .controller('horizon.dashboard.project.subscriptions.tableController', subscriptionsTableController);

  subscriptionsTableController.$inject = [
    '$scope',
    'horizon.app.core.openstack-service-api.zaqar'
  ];

  function subscriptionsTableController($scope, zaqar) {

    var ctrl = this;

    ctrl.subscriptions = [];

    init();

    //////////

    function init() {
        zaqar.getSubscriptions().then(getSubscriptionSuccess, getSubscriptionFailure);

        function getSubscriptionFailure(response){
            ctrl.subscriptions = response
        }

        function getSubscriptionSuccess(response) {
            console.log(response);
            ctrl.subscriptions = response;
        }

    }



  }

})();

