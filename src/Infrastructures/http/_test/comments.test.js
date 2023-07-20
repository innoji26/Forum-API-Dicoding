const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/comments endpoint', () => {
	afterEach(async () => {
		await CommentsTableTestHelper.cleanTable();
		await ThreadTableTestHelper.cleanTable();
		await UsersTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await pool.end();
	});

	describe('when POST /threads/{threadId}/comments', () => {
		it('should response 201 and persisted comment', async () => {
			// Arrange
			const requestPayload = {
				content: 'a comment',
			};
			const server = await createServer(container);
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			});
			const responseLogin = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret',
				},
			});
			const { accessToken } = JSON.parse(responseLogin.payload).data;
			const responseThread = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: {
					title: 'New Thread',
					body: 'This is a new thread',
				},
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			const { id: threadId } = JSON.parse(responseThread.payload).data
				.addedThread;

			// Action
			const response = await server.inject({
				method: 'POST',
				url: `/threads/${threadId}/comments`,
				payload: { content: requestPayload.content },
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(201);
			expect(responseJson.status).toEqual('success');
			expect(responseJson.data.addedComment.id).toBeDefined();
			expect(responseJson.data.addedComment.content).toBeDefined();
			expect(responseJson.data.addedComment.owner).toBeDefined();
		});

		it('should response 404 if thread not found or not valid', async () => {
			// Arrange
			const requestPayload = {
				content: 'a comment',
			};
			const server = await createServer(container);
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			});
			const responseLogin = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret',
				},
			});
			const { accessToken } = JSON.parse(responseLogin.payload).data;

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/threads/thread-123/comments',
				payload: { content: requestPayload.content },
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('thread tidak ditemukan');
		});

		it('should response 400 if not contain needed property', async () => {
			// Arrange
			const server = await createServer(container);
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			});
			const responseLogin = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret',
				},
			});
			const { accessToken } = JSON.parse(responseLogin.payload).data;
			const responseThread = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: {
					title: 'New Thread',
					body: 'This is a new thread',
				},
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			const { id: threadId } = JSON.parse(responseThread.payload).data
				.addedThread;

			// Action
			const response = await server.inject({
				method: 'POST',
				url: `/threads/${threadId}/comments`,
				payload: {},
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('content tidak ada');
		});

		it('should response 400 if not meet data type spesification', async () => {
			// Arrange
			const requestPayload = {
				content: 1234,
			};
			const server = await createServer(container);
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			});
			const responseLogin = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret',
				},
			});
			const { accessToken } = JSON.parse(responseLogin.payload).data;
			const responseThread = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: {
					title: 'New Thread',
					body: 'This is a new thread',
				},
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			const { id: threadId } = JSON.parse(responseThread.payload).data
				.addedThread;

			// Action
			const response = await server.inject({
				method: 'POST',
				url: `/threads/${threadId}/comments`,
				payload: { content: requestPayload.content },
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(400);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('content harus string');
		});

		it('should response 401 when request without a header authorization', async () => {
			// Arrange
			const server = await createServer(container);
			await UsersTableTestHelper.addUser({});
			await ThreadTableTestHelper.addThread({});

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/threads/thread-123/comments',
				payload: { content: 'a comment' },
				headers: {},
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(responseJson.statusCode).toEqual(401);
			expect(responseJson.error).toEqual('Unauthorized');
			expect(responseJson.message).toEqual('Missing authentication');
		});
	});

	describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
		it('should response 200 and deleted a comment', async () => {
			// Arrange
			const server = await createServer(container);
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			});
			const responseLogin = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret',
				},
			});
			const { accessToken } = JSON.parse(responseLogin.payload).data;
			const responseThread = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: {
					title: 'New Thread',
					body: 'This is a new thread',
				},
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			const { id: threadId } = JSON.parse(responseThread.payload).data
				.addedThread;
			const responseComment = await server.inject({
				method: 'POST',
				url: `/threads/${threadId}/comments`,
				payload: { content: 'a comment' },
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			const { id: commentId } = JSON.parse(responseComment.payload).data
				.addedComment;

			// Action
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/${threadId}/comments/${commentId}`,
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(200);
			expect(responseJson.status).toEqual('success');
		});

		it('should response 404 if thread not found or not valid', async () => {
			// Arrange
			const server = await createServer(container);
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			});
			const responseLogin = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret',
				},
			});
			const { accessToken } = JSON.parse(responseLogin.payload).data;

			// Action
			const response = await server.inject({
				method: 'DELETE',
				url: '/threads/thread-not-found/comments/comment-123',
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('thread tidak ditemukan');
		});

		it('should response 404 if comment not found or not valid', async () => {
			// Arrange
			const server = await createServer(container);
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			});
			const responseLogin = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret',
				},
			});
			const { accessToken } = JSON.parse(responseLogin.payload).data;
			const responseThread = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: {
					title: 'New Thread',
					body: 'This is a new thread',
				},
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			const { id: threadId } = JSON.parse(responseThread.payload).data
				.addedThread;

			// Action
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/${threadId}/comments/comment-not-found`,
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(404);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('comment tidak ditemukan');
		});

		it('should response 403 if userId not the owner of the comment', async () => {
			// Arrange
			const server = await createServer(container);
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			});
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding_2',
					password: 'secret_2',
					fullname: 'Dicoding Indonesia 2',
				},
			});
			const responseLogin = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret',
				},
			});
			const { accessToken } = JSON.parse(responseLogin.payload).data;
			const responseLogin2 = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding_2',
					password: 'secret_2',
				},
			});
			const { accessToken: accessToken2 } = JSON.parse(
				responseLogin2.payload,
			).data;
			const responseThread = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: {
					title: 'New Thread',
					body: 'This is a new thread',
				},
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			const { id: threadId } = JSON.parse(responseThread.payload).data
				.addedThread;
			const responseComment = await server.inject({
				method: 'POST',
				url: `/threads/${threadId}/comments`,
				payload: { content: 'a comment' },
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			const { id: commentId } = JSON.parse(responseComment.payload).data
				.addedComment;

			// Action
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/${threadId}/comments/${commentId}`,
				headers: { Authorization: `Bearer ${accessToken2}` },
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(403);
			expect(responseJson.status).toEqual('fail');
			expect(responseJson.message).toEqual('anda bukan pemilik comment ini');
		});

		it('should response 401 if when request without or not valid header authorization', async () => {
			// Arrange
			const server = await createServer(container);
			await UsersTableTestHelper.addUser({});
			await ThreadTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});

			// Action
			const response = await server.inject({
				method: 'DELETE',
				url: '/threads/thread-123/comments/comment-123',
				headers: {},
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(responseJson.statusCode).toEqual(401);
			expect(responseJson.error).toEqual('Unauthorized');
			expect(responseJson.message).toEqual('Missing authentication');
		});
	});
});
