class NewThread {
	constructor(payload) {
		this._verifyPayload(payload);

		const { userId, title, body } = payload;

		this.userId = userId;
		this.title = title;
		this.body = body;
	}

	_verifyPayload(payload) {
		const {userId, title, body } = payload
		if (!userId || !title || !body) {
			throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
		}

		if (typeof userId !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
			throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION');
		}
	}
}

module.exports = NewThread;
