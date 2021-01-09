function pickUsingWeights(items, weights) {
	var total = 0
	var ranges = weights.slice(0)
	for (var i = 0, len = weights.length; i < len; i++) {
		ranges[i] = [total, (total += ranges[i])]
	}
	var randomNumber = parseInt(Math.random() * total)
	for (; randomNumber < ranges[--i][0]; ) return items[i]
}

export default pickUsingWeights
