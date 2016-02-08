#  Copyright 2015 Catalyst IT Ltd.
#
#    Licensed under the Apache License, Version 2.0 (the "License"); you may
#    not use this file except in compliance with the License. You may obtain
#    a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#    License for the specific language governing permissions and limitations
#    under the License.


from __future__ import absolute_import
import logging
from zaqarclient.queues import client as zaqar_client

from horizon import exceptions
from horizon.utils.memoized import memoized
from openstack_dashboard.api import base

LOG = logging.getLogger(__name__)


@memoized
def zaqarclient(request):
    zaqar_url = ""
    service_type = 'messaging'
    try:
        zaqar_url = base.url_for(request, service_type)
    except exceptions.ServiceCatalogException:
        LOG.debug('No messaging service is configured.')
        return None

    LOG.debug('zaqarclient connection created using the token "%s" and url'
              '"%s"' % (request.user.token.id, zaqar_url))

    opts = {'os_auth_token': request.user.token.id,
            'os_auth_url': base.url_for(request, 'identity'),
            'os_project_id': request.user.tenant_id,
            'os_service_type': service_type}

    auth_opts = {'backend': 'keystone',
                 'options': opts}

    conf = {'auth_opts': auth_opts}

    return zaqar_client.Client(url=zaqar_url, version=2, conf=conf)


def queue_list(request, limit=None, marker=None):
    return zaqarclient(request).queues(limit=limit, marker=marker)


def queue_create(request, queue_name, metadata):
    """Pop up a modal form, which contains several inputbox:
    1. queue_name
    2. ttl
    3. max message size
    4. Metadata
    """

    queue = zaqarclient(request).queue(queue_name, force_create=True)
    queue.metadata(new_meta=metadata)


def queue_delete(request, queue_name):
    queue = zaqarclient(request).queue(queue_name, auto_create=False)
    queue.delete()


def queue_update(request, queue_name, metadata):
    """Popup a modal form, the queue name is a realonly label or inputbox.
    user can change ttl, max message size and metadata
    """

    queue = zaqarclient(request).queue(queue_name, auto_create=False)
    queue.metadata(new_meta=metadata)


def queue_get(request, queue_name):
    return zaqarclient(request).queue(queue_name, auto_create=False)


def queue_subscribe(request, subscriber, ttl=None, options={}):
    """Popup a modal form, user can input subscriber, ttl and options to
    subscribe the queue.

    subscriber could be an URL or email address.
    """
    sub = zaqarclient(request).subscriber()
    return sub.subscribe(request['queue'], subscriber, ttl, options)

def subscription_list(request, subscriber):
    return subscriber.channels