const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const ReplyTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('ReplyRepositoryPostgres', () => {
	afterEach(async () => {
		await ReplyTableTestHelper.cleanTable();
		await CommentsTableTestHelper.cleanTable();
		await ThreadsTableTestHelper.cleanTable();
		await UsersTableTestHelper.cleanTable();
		await RepliesTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await pool.end();
	});

	describe('addReply function', () => {
		it('should persist new reply correctly', async () => {
			// Arrange
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});
			const content = 'a new reply';
			const fakeIdGenerator = () => '123';
			const replyRepositoryPostgres = new ReplyRepositoryPostgres(
				pool,
				fakeIdGenerator,
			);

			// action
			await replyRepositoryPostgres.addReply({
				userId: 'user-123',
				commentId: 'comment-123',
				content,
			});

			// Assert
			const replies = await ReplyTableTestHelper.findRepliesById('reply-123');
			expect(replies).toHaveLength(1);
		});

		it('should return added reply correctly', async () => {
			// Arrange
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});
			const content = 'a new reply';
			const fakeIdGenerator = () => '123';
			const replyRepositoryPostgres = new ReplyRepositoryPostgres(
				pool,
				fakeIdGenerator,
			);

			// action
			const addedReply = await replyRepositoryPostgres.addReply({
				userId: 'user-123',
				commentId: 'comment-123',
				content,
			});

			// Assert
			expect(addedReply).toStrictEqual(
				new AddedReply({
					id: 'reply-123',
					content: 'a new reply',
					owner: 'user-123',
				}),
			);
		});
	});

	describe('verifyReplyById function', () => {
		it('should throw NotFoundError if reply not available', async () => {
			// Arrange
			const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);
			const replyId = 'not_found_id';

			// Action and Assert
			await expect(
				replyRepositoryPostgres.verifyReplyById(replyId),
			).rejects.toThrow(NotFoundError);
		});

		it('should not throw NotFoundError if reply available', async () => {
			// Arrange
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});
			await ReplyTableTestHelper.addReply({});
			const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);

			// Action and Assert
			await expect(
				replyRepositoryPostgres.verifyReplyById('reply-123'),
			).resolves.not.toThrow(NotFoundError);
		});
	});

	describe('verifyReplyOwner function', () => {
		it('should throw AuthorizationError if userId is not the owner of reply', async () => {
			// Arrange
			const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);
			const replyId = 'reply-123';
			const userId = 'not_the_owner';
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});
			await ReplyTableTestHelper.addReply({});

			// Action and assert
			await expect(
				replyRepositoryPostgres.verifyReplyOwner(replyId, userId),
			).rejects.toThrow(AuthorizationError);
		});

		it('should not throw AuthorizationError if userId is the owner of reply', async () => {
			// Arrange
			const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);
			const replyId = 'reply-123';
			const userId = 'user-123';
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});
			await ReplyTableTestHelper.addReply({});

			// Action and assert
			await expect(
				replyRepositoryPostgres.verifyReplyOwner(replyId, userId),
			).resolves.not.toThrow(AuthorizationError);
		});
	});

	describe('getRepliesByCommentId function', () => {
		it('should return replies by comment id correctly', async () => {
			// Arrange
			const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);
			const commentId = 'comment-123';
			const dateReply1 = new Date();
			const dateReply2 = new Date(dateReply1.getTime() + 1000);
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});
			await RepliesTableTestHelper.addReply({ date: dateReply1 });
			await RepliesTableTestHelper.addReply({
				id: 'reply-234',
				content: 'new reply',
				commentId: 'comment-123',
				owner: 'user-123',
				date: dateReply2,
			});
			await RepliesTableTestHelper.deleteReply('reply-234');

			// Action
			const getRepliesByCommentId =
				await replyRepositoryPostgres.getRepliesByCommentId(commentId);

			// Assert
			expect(getRepliesByCommentId).toEqual([
				{
					id: 'reply-123',
					content: 'a reply',
					date: dateReply1.toISOString(),
					username: 'dicoding',
					is_delete: '0',
				},
				{
					id: 'reply-234',
					content: 'new reply',
					date: dateReply2.toISOString(),
					username: 'dicoding',
					is_delete: '1',
				},
			]);
		});

		it('should return [] if comments by thread is not exist', async () => {
			// Arrange
			const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool);
			const commentId = 'comment-123';
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});

			// Action
			const getRepliesByCommentId =
				await replyRepositoryPostgres.getRepliesByCommentId(commentId);

			// Assert
			expect(getRepliesByCommentId).toEqual([]);
		});
	});

	describe('deleteReply function', () => {
		it('should change column is_delete to value 1', async () => {
			await UsersTableTestHelper.addUser({ id: 'user-123' });
			await ThreadsTableTestHelper.addThread({
			  id: 'thread-123',
			  owner: 'user-123',
			});
			await CommentsTableTestHelper.addComment({
			  id: 'comment-123',
			  content: 'Javascript',
			  owner: 'user-123',
			  threadId: 'thread-123',
			});

			await RepliesTableTestHelper.addReply({
				id: 'reply-123',
				content: 'java bagus',
				commentId: 'comment-123',
				owner: 'user-123',
			})
	  
			const replyId = 'reply-123';
			const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
	  
			// Action
			await replyRepositoryPostgres.deleteReply(replyId);
	  
			// Assert
			const replies = await RepliesTableTestHelper.findRepliesById(replyId);

			expect(replies).toHaveLength(1);
			expect(replies[0].is_delete).toEqual('1');
		});
	});
});
