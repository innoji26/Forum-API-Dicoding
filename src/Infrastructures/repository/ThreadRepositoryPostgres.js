const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
	constructor(pool, idGenerator) {
		super();
		this._pool = pool;
		this._idGenerator = idGenerator;
	}

	async addThread(/*userId,*/ newThread) {
		// const { title, body } = newThread;
		const { userId, title, body } = newThread;

		const id = `thread-${this._idGenerator()}`;

		const query = {
			text: 'INSERT INTO threads(id, title, body, owner) VALUES($1, $2, $3, $4) RETURNING id, title, owner',
			values: [id, title, body, userId],
		};

		const result = await this._pool.query(query);

		return new AddedThread({ ...result.rows[0] });
	}

	async verifyThreadById(id) {
		const query = {
			text: 'SELECT * FROM threads WHERE id = $1',
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new NotFoundError('thread tidak ditemukan');
		}
	}

	async getThreadById(id) {
		const query = {
			text: 'SELECT threads.id, threads.title, threads.body, threads.date, users.username FROM threads INNER JOIN users ON users.id = threads.owner WHERE threads.id = $1',
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new NotFoundError('thread tidak ditemukan');
		}

		return { ...result.rows[0], date: result.rows[0].date.toISOString() };
	}
}

module.exports = ThreadRepositoryPostgres;
