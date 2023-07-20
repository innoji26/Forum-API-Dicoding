class NewComment {
	constructor(payload) {
		this._verifyPayload(payload);

		const { userId, threadId, content } = payload;

		this.userId = userId;
		this.threadId = threadId;
		this.content = content;
	}

	_verifyPayload(payload) {
		const {userId, threadId, content } = payload
		if (!userId || !threadId || !content) {
			throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_CONTENT');
		}

		if (typeof userId !== 'string' || typeof threadId !== 'string' || typeof content !== 'string') {
			throw new Error('ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPESIFICATION');
		}
	}
}

module.exports = NewComment;
