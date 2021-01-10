import ABTest from '../../../messages/abTest'
import Condition from '../../../messages/condition'
import Javascript from '../../../messages/javascript'
import JumpTo from '../../../messages/jumpTo'
import SMTP from '../../../messages/smtp'
import Webhook from '../../../messages/webhook'

const backends = {
	'AB-TEST': ABTest,
	CODE: Javascript,
	CONDITION: Condition,
	'JUMP-TO': JumpTo,
	SMTP: SMTP,
	WEBHOOK: Webhook,
}

export default backends
