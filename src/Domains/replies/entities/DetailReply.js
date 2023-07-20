/* eslint-disable camelcase */
class DetailReply {
	constructor(payload) {
		this._verifyPayload(payload);

		const {
			id, content, date, username, is_delete,
		} = payload;

		this.id = id;
		this.content = Number(is_delete) ? '**balasan telah dihapus**' : content;
		this.date = date;
		this.username = username;
	}

	_verifyPayload({
		id, content, date, username,
	}) {
		if (!id || !content || !date || !username) {
			throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
		}

		if (
			typeof id !== 'string' ||
			typeof content !== 'string' ||
			typeof date !== 'string' ||
			typeof username !== 'string'
		) {
			throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPESIFICATION');
		}
	}
}

module.exports = DetailReply;
