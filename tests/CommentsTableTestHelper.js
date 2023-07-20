/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
	async addComment({
		id = 'comment-123',
		newComment = 'a comment',
		threadId = 'thread-123',
		userId = 'user-123',
		date = '2021-08-08T07:22:33.555Z',
	}) {
		const query = {
			text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
			values: [id, newComment, threadId, userId, date, '0'],
		};

		await pool.query(query);
	},
	async findCommentsById(id) {
		const query = {
			text: 'SELECT * FROM comments WHERE id = $1',
			values: [id],
		};

		const result = await pool.query(query);
		return result.rows;
	},
	async deleteCommentById(id) {
		const query = {
			text: "UPDATE comments SET is_delete = '1' WHERE id = $1",
			values: [id],
		};

		await pool.query(query);
	},
	async cleanTable() {
		await pool.query('DELETE FROM comments WHERE 1=1');
	},
};

module.exports = CommentsTableTestHelper;
