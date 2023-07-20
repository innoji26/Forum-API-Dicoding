const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
	afterEach(async () => {
		await ThreadsTableTestHelper.cleanTable();
		await UsersTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await pool.end();
	});

	describe('addThread function', () => {
		it('should persist new thread and return added thread correctly', async () => {
			// Arrange
			// const ownerId = 'user-123';
			const newThread = new NewThread({
				title: 'New Thread',
				body: 'This is a new thread',
				userId: 'user-123',
			});
			const fakeIdGenerator = () => '123';
			const threadRepositoryPostgres = new ThreadRepositoryPostgres(
				pool,
				fakeIdGenerator,
			);
			await UsersTableTestHelper.addUser({});

			// Action
			await threadRepositoryPostgres.addThread(newThread);

			// Assert
			const threads = await ThreadsTableTestHelper.findThreadsById(
				'thread-123',
			);
			expect(threads).toHaveLength(1);
		});

		it('should return added thread correctly', async () => {
			// Arrange
			// const ownerId = 'user-123';
			const newThread = new NewThread({
				title: 'New Thread',
				body: 'This is a new thread',
				userId: 'user-123'
			});
			const fakeIdGenerator = () => '123';
			const threadRepositoryPostgres = new ThreadRepositoryPostgres(
				pool,
				fakeIdGenerator,
			);
			await UsersTableTestHelper.addUser({});

			// Action
			const addedThread = await threadRepositoryPostgres.addThread(
				newThread,
			);

			// Assert
			expect(addedThread).toStrictEqual(
				new AddedThread({
					id: 'thread-123',
					title: 'New Thread',
					body: 'This is a new thread',
					owner: 'user-123',
				}),
			);
		});
	});

	describe('verifyThreadById function', () => {
		it('should throw NotFoundError if thread not available', async () => {
			// Arrange
			const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
			const threadId = 'not_found_id';

			// Action and Assert
			await expect(
				threadRepositoryPostgres.verifyThreadById(threadId),
			).rejects.toThrow(NotFoundError);
		});

		it('should not throw NotFoundError if thread available', async () => {
			// Arrange
			await UsersTableTestHelper.addUser({id: 'user-123'});
			await ThreadsTableTestHelper.addThread({
				id: 'thread-123',
				userId: 'user-123',
			  });
			const threadId = 'thread-123';
			const fakeIdGenerator = () => '123';
			const threadRepositoryPostgres = new ThreadRepositoryPostgres(
				pool,
				fakeIdGenerator,
			);

			// Action and Assert
			await expect(
				threadRepositoryPostgres.verifyThreadById(threadId),
			).resolves.not.toThrow(NotFoundError);
		});
	});

	describe('getDetailThreadById function', () => {
		it('should throw NotFoundError if thread', async () => {
			// Arrange
			const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
			const threadId = 'not_found_id';

			// Action and Assert
			await expect(
				threadRepositoryPostgres.getThreadById(threadId),
			).rejects.toThrow(NotFoundError);
		});

		it('should return thread if thread available', async () => {
			// Arrange
			const threadId = 'thread-123';
			const fakeIdGenerator = () => '123';
			const threadRepositoryPostgres = new ThreadRepositoryPostgres(
				pool,
				fakeIdGenerator,
			);
			const dateThread = new Date();
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({ date: dateThread });

			// Action
			const getThreadById = await threadRepositoryPostgres.getThreadById(
				threadId,
			);

			// Assert
			expect(getThreadById).toEqual({
				id: 'thread-123',
				title: 'New Thread',
				body: 'This is a new thread',
				date: dateThread.toISOString(),
				username: 'dicoding',
			});
		});
	});
});
