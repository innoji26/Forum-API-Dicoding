/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
	async addReply({
		id = 'reply-123',
		content = 'a reply',
		commentId = 'comment-123',
		owner = 'user-123',
		date = '2021-08-08T07:59:48.766Z',
	}) {
		const query = {
			text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
			values: [id, content, commentId, owner, date, '0'],
		};

		await pool.query(query);
	},
	async findRepliesById(id) {
		const query = {
			text: 'SELECT id FROM replies WHERE id = $1',
			values: [id],
		};

		const result = await pool.query(query);
		return result.rows;
	},
	async deleteReply(id) {
		const query = {
			text: "UPDATE replies SET is_delete = '1' WHERE id = $1",
			values: [id],
		};

		await pool.query(query);
	},
	async cleanTable() {
		await pool.query('DELETE FROM replies WHERE 1=1');
	},
};

module.exports = RepliesTableTestHelper;
