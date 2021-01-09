import config from '../conf'
import datadogLogs from 'react-native-datadog'

class EventLog {
    constructor() {
        if (config.env === 'local') return
        
        datadogLogs.init({
            clientToken: config.clientToken,
            forwardErrorsToLogs: true,
            sampleRate: 100,
            env: config.ENV,
            version: config.VERSION,
            service: 'web-management'
        })
    }

    addContext(key, value) {
        datadogLogs.logger.addContext(key, value)
    }

    removeContext(key) {
        datadogLogs.logger.removeContext(key)
    }

    info(message, context) {
        datadogLogs.logger.info(message, context)
    }

    debug(message, context) {
        datadogLogs.logger.debug(message, context)
    }

    warn(message, context) {
        datadogLogs.logger.warn(message, context)
    }

    error(message, context) {
        datadogLogs.logger.error(message, context)
    }
}

export default new EventLog()