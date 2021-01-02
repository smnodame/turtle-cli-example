import { store } from '../redux'

var getMessageDuration = function () {
	const { typingEmulation, messages } = store.getState().chat
	if (typingEmulation.enable) {
		if (typingEmulation.type === 'custom') {
			const messageKeys = Object.keys(messages).sort()
			if (messageKeys.length === 1) {
				// for first message, no need to wait
				return 100
			}
			const lastMessageId = messageKeys[messageKeys.length - 2]
			const words = messages[lastMessageId].text.split(/[\s.?]+/).length || 1
			const wordPerSeconds = 60 / typingEmulation.avg_words_per_min
			if (wordPerSeconds * words > typingEmulation.maximum_delay) {
				return typingEmulation.maximum_delay * 1000
			}

			// minimum duration to make good ui
			if (wordPerSeconds * words < 0.8) {
				return 1 * 1000
			}

			return wordPerSeconds * words * 1000
		} else if (typingEmulation.type === 'constant') {
			return typingEmulation.constant_delay * 1000
		}
	}
	return 2000 + 500
}

export default getMessageDuration
