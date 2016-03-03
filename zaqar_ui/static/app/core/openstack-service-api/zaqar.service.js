/**
 * Copyright 2015 Catalyst IT Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {
  'use strict';

  angular
    .module('horizon.app.core.openstack-service-api')
    .factory('horizon.app.core.openstack-service-api.zaqar', ZaqarAPI);

  ZaqarAPI.$inject = [
    'horizon.framework.util.http.service',
    'horizon.framework.widgets.toast.service'
  ];

  function ZaqarAPI(apiService, toastService) {
    var service = {
      getQueues: getQueues,
      createQueue: createQueue,
      deleteQueue: deleteQueue,
      getSubscriptions: getSubscriptions
    };

    return service;

    //////////

    function getQueues() {
      return apiService.get('/api/zaqar/queues/')
        .error(function() {
          toastService.add('error', gettext('Unable to retrieve the Queues.'));
        });
    }

    function createQueue(newQueue) {
        return apiService.put('/api/zaqar/queues/', newQueue)
            .error(function () {
                toastService.add('error', gettext('Unable to create the queue.'));
            });
    }

    function deleteQueue(queueName) {
      return apiService.delete('/api/zaqar/queues/', [queueName]);
    }

    function getSubscriptions(queueName) {
      return apiService.get('/api/zaqar/subscriptions/' + queueName);
    }
  }

}());
