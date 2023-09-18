const bindWithChunking = (channel, event, callback) => {
    let events = {};

    function handleChunkedEvent(data) {
        let { id, index, chunk, final } = data;

        if (!events[id]) {
            events[id] = { chunks: [], receivedFinal: false };
        }

        let ev = events[id];
        ev.chunks[index] = chunk;

        if (final) {
            ev.receivedFinal = true;
        }

        if (ev.receivedFinal && ev.chunks.length === Object.keys(ev.chunks).length) {
            callback(ev.chunks.join(""));
            delete events[id];
        }
    }

    channel.bind(event, callback);
    channel.bind("chunked-" + event, handleChunkedEvent);
}

export default bindWithChunking