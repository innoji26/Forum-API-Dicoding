const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewComment = require('../../../Domains/comments/entities/NewComment');

describe('CommentRepositoryPostgres', () => {
	afterEach(async () => {
		await CommentsTableTestHelper.cleanTable();
		await ThreadsTableTestHelper.cleanTable();
		await UsersTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await pool.end();
	});

	// beforeEach(async () => {
	// 	await UsersTableTestHelper.addUser({ username: 'user-123' });
	// 	await ThreadsTableTestHelper.addThread({ title: 'Title 1' });
	//   });

	describe('addComment function', () => {
		it('should persist new comment and return added comment correctly', async () => {
			// Arrange
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			// const content = 'a new comment';

			const newComment = new NewComment({
				content: 'Comment 1',
				userId: 'user-123',
				threadId: 'thread-123',
			});
			
			const fakeIdGenerator = () => '123';
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator,
			);

			// Action
			await commentRepositoryPostgres.addComment(
				newComment
			);

			// Assert
			const comments = await CommentsTableTestHelper.findCommentsById(
				'comment-123',
			);
			expect(comments).toHaveLength(1);
		});

		it('should return added comment correctly', async () => {
			// Arrange
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			// const content = 'a new comment';
			const newComment = new NewComment({
				content: 'Comment 1',
				userId: 'user-123',
				threadId: 'thread-123',
			});
			// const commentPayload = {
			// 	content: 'Comment 1',
			// 	userId: 'user-123',
			// 	threadId: 'thread-123',
			//   };
			const fakeIdGenerator = () => '123';
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator,
			);

			// Action
			const addedComment = await commentRepositoryPostgres.addComment(
				newComment
			);

			// Assert
			expect(addedComment).toStrictEqual(
				new AddedComment({
					id: 'comment-123',
					threadId: 'thread-123',
					content: 'Comment 1',
					owner: 'user-123',
				}),
			);
		});
	});

	describe('verifyCommentById function', () => {
		it('should throw NotFoundError if comment not available', async () => {
			// Arrange
			const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
			const commentId = 'not_found_id';

			// Action and Assert
			await expect(
				commentRepositoryPostgres.verifyCommentById(commentId),
			).rejects.toThrow(NotFoundError);
		});

		it('should not throw NotFoundError if comment available', async () => {
			// Arrange
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});
			const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

			// Action and Assert
			await expect(
				commentRepositoryPostgres.verifyCommentById('comment-123'),
			).resolves.not.toThrow(NotFoundError);
		});
	});

	describe('verifyCommentOwner function', () => {
		it('should throw AuthorizationError if userId is not the owner of comment', async () => {
			// Arrange
			const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
			const commentId = 'comment-123';
			const userId = 'not_the_owner';
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});

			// Action and assert
			await expect(
				commentRepositoryPostgres.verifyCommentOwner(commentId, userId),
			).rejects.toThrow(AuthorizationError);
		});

		it('should not throw AuthorizationError if userId is the owner of comment', async () => {
			// Arrange
			const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
			const commentId = 'comment-123';
			const userId = 'user-123';
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});

			// Action and assert
			await expect(
				commentRepositoryPostgres.verifyCommentOwner(commentId, userId),
			).resolves.not.toThrow(AuthorizationError);
		});
	});

	describe('getCommentsByThreadId function', () => {
		it('should return comments by thread id correctly', async () => {
			// Arrange
			const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
			const threadId = 'thread-123';
			const dateComment1 = new Date();
			const dateComment2 = new Date(dateComment1.getTime() + 1000);
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({ date: dateComment1 });
			await CommentsTableTestHelper.addComment({
				id: 'comment-234',
				newComment: 'new comment',
				threadId: 'thread-123',
				userId: 'user-123',
				date: dateComment2,
			});
			await CommentsTableTestHelper.deleteCommentById('comment-234');

			// Action
			const getCommentsByThreadId =
				await commentRepositoryPostgres.getCommentsByThreadId(threadId);

			// Assert
			expect(getCommentsByThreadId).toEqual([
				{
					id: 'comment-123',
					username: 'dicoding',
					date: dateComment1.toISOString(),
					content: 'a comment',
					is_delete: '0',
				},
				{
					id: 'comment-234',
					username: 'dicoding',
					date: dateComment2.toISOString(),
					content: 'new comment',
					is_delete: '1',
				},
			]);
		});

		it('should return [] if comments by thread is not exist', async () => {
			// Arrange
			const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
			const threadId = 'thread-123';
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});

			// Action
			const getCommentsByThreadId =
				await commentRepositoryPostgres.getCommentsByThreadId(threadId);

			// Assert
			expect(getCommentsByThreadId).toEqual([]);
		});
	});

	describe('deleteComment function', () => {
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
	  
			const commentId = 'comment-123';
			const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
	  
			// Action
			await commentRepositoryPostgres.deleteComment(commentId);
	  
			// Assert
			const comments = await CommentsTableTestHelper.findCommentsById(commentId);
			expect(comments).toHaveLength(1);
			expect(comments[0].is_delete).toEqual('1');
		});
	});
});
