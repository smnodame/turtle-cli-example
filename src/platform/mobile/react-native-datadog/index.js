import { Platform } from 'react-native'
import config from '../../../conf'
import throttle from '../../../utils/throttle'

class EventLog {
    context = {}

    init(context) {
        this.context = context
    }

    logger = {
        info: this.info.bind(this),
        debug: this.debug.bind(this),
        warn: this.warn.bind(this),
        error: this.error.bind(this),
        addContext: this.addContext.bind(this),
        removeContext: this.removeContext.bind(this),
    }

    logs = []

    pushLog(status, message, context = {}) {
        this.logs.push({
            status,
            message,
            context
        })
        throttle(this.sendLog, 3000)
    }

    sendLog() {
        const batch = this.logs.map(({ status, message, context }) => {
            return {
                ddsource: Platform.OS,
                ddtags: `env:${this.context.env},version:${this.context.version}`,
                message: message,
                service: this.context.service,
                device: {
                    ...config.DEVICE_INFO
                },
                status: status,
                ...context
            }
        })

        fetch(`https://browser-http-intake.logs.datadoghq.com/v1/input/${this.context.clientToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(batch)
        }).then(() => {
            this.logs = []
        })
    }

    addContext(key, value) {
        this.context[key] = value
    }

    removeContext(key) {
        delete this.context[key]
    }

    info(message, context) {
        this.sendLog('info', message, context)
    }

    debug(message, context) {
        this.sendLog('debug', message, context)
    }

    warn(message, context) {
        this.sendLog('warn', message, context)
    }

    error(message, context) {
        this.sendLog('error', message, context)
    }
}

export default new EventLog()