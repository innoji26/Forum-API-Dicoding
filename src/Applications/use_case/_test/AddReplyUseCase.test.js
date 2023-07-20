const AddReplyUseCase = require('../AddReplyUseCase');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddReplyUseCase', () => {
	it('should throw error if use case payload not contain needed property', async () => {
		// Arrange
		const useCasePayload = {
			userId: 'user-123',
			commentId: 'comment-123',
		};
		const addReplyUseCase = new AddReplyUseCase({});

		// Action and Assert
		await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError(
			'ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY',
		);
	});

	it('should throw error if use case payload not meet data type spesification', async () => {
		// Arrange
		const useCasePayload = {
			userId: 'user-123',
			commentId: 'comment-123',
			content: 123,
		};
		const addReplyUseCase = new AddReplyUseCase({});

		// Action and Assert
		await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError(
			'ADD_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPESIFICATION',
		);
	});

	it('should orchestrating the add reply correctly', async () => {
		// Arrange
		const useCasePayload = {
			userId: 'user-123',
			threadId: 'thread-123',
			commentId: 'comment-123',
			content: 'a reply',
		};
		const mockAddedReply = new AddedReply({
			id: 'reply-123',
			content: 'a reply',
			owner: 'user-123',
		});
		const mockReplyRepository = new ReplyRepository();
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		// Mocking
		mockThreadRepository.verifyThreadById = jest.fn(() => Promise.resolve());
		mockCommentRepository.verifyCommentById = jest.fn(() => Promise.resolve());
		mockReplyRepository.addReply = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockAddedReply));

		// create use case instance
		const addReplyUseCase = new AddReplyUseCase({
			replyRepository: mockReplyRepository,
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository,
		});

		// action
		const addedReply = await addReplyUseCase.execute(useCasePayload);

		// Assert
		expect(addedReply).toEqual(
			new AddedReply({
				id: 'reply-123',
				content: 'a reply',
				owner: 'user-123',
			}),
		);
		expect(mockThreadRepository.verifyThreadById).toBeCalledWith('thread-123');
		expect(mockCommentRepository.verifyCommentById).toBeCalledWith(
			'comment-123',
		);
		expect(mockReplyRepository.addReply).toBeCalledWith({
			userId: 'user-123',
			commentId: 'comment-123',
			content: 'a reply',
		});
	});
});
