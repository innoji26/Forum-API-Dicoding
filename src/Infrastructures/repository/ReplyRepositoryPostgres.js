/* eslint-disable indent */
/* eslint-disable no-mixed-spaces-and-tabs */
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
	constructor(pool, idGenerator) {
		super();
		this._pool = pool;
		this._idGenerator = idGenerator;
	}

	async addReply(newReply) {
		const id = `reply-${this._idGenerator()}`;
		const { userId, commentId, content } = newReply

		const query = {
			text: 'INSERT INTO replies(id, content, comment_id, owner, is_delete) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
			values: [id, content, commentId, userId, '0'],
		};

		const result = await this._pool.query(query);

		return new AddedReply(result.rows[0]);
	}

	async verifyReplyById(id) {
		const query = {
			text: 'SELECT id FROM replies WHERE id = $1',
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new NotFoundError('reply tidak ditemukan');
		}
	}

	async verifyReplyOwner(id, userId) {
		const query = {
			text: 'SELECT id, owner FROM replies WHERE id = $1 AND owner = $2',
			values: [id, userId],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new AuthorizationError('anda bukan pemilik reply ini');
		}
	}

	async getRepliesByCommentId(commentId) {
		const query = {
			text: 'SELECT replies.id, replies.content, replies.date, users.username, replies.is_delete FROM replies INNER JOIN users ON users.id = replies.owner WHERE replies.comment_id = $1 ORDER BY replies.date ASC',
			values: [commentId],
		};

		const result = await this._pool.query(query);

		// store reply with date ISO string if any comment, if not store empty array
		const replies = result.rowCount
			? result.rows.map((reply) => ({
					...reply,
					date: reply.date.toISOString(),
			  }))
			: [];

		return replies;
	}

	async deleteReply(id) {
		const query = {
			text: "UPDATE replies SET is_delete = '1' WHERE id = $1 RETURNING is_delete",
			values: [id],
		};

		const result = await this._pool.query(query);

		return result.rows[0].is_delete;
	}
}

module.exports = ReplyRepositoryPostgres;
