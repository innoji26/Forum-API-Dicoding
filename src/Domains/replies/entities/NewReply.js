class NewReply {
	constructor(payload) {
		this._verifyPayload(payload);

		const { userId, commentId, content } = payload;

		this.userId = userId;
		this.commentId = commentId;
		this.content = content;
	}

	_verifyPayload(payload) {
		const {userId, commentId, content } = payload
		if (!userId || !commentId || !content) {
			throw new Error('ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
		}

		if (typeof userId !== 'string' || typeof commentId !== 'string' || typeof content !== 'string') {
			throw new Error('ADD_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPESIFICATION');
		}
	}
}

module.exports = NewReply;
