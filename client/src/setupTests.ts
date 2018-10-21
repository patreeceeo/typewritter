global.fetch = require('jest-fetch-mock') /* tslint:disable-line */

import xhr from './mock-xhr'

global.XMLHttpRequest = xhr.createMock()

require('event-source-polyfill/src/eventsource')

