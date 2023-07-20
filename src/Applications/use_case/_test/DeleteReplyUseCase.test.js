const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
	it('should orchestrating the delete reply action correctly', async () => {
		// Arrange
		const mockReplyRepository = new ReplyRepository();
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		// Mocking
		mockThreadRepository.verifyThreadById = jest.fn(() => Promise.resolve());
		mockCommentRepository.verifyCommentById = jest.fn(() => Promise.resolve());
		mockReplyRepository.verifyReplyById = jest.fn(() => Promise.resolve());
		mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
		mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve('1'));

		// create use case instance
		const deleteReplyUseCase = new DeleteReplyUseCase({
			replyRepository: mockReplyRepository,
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository,
		});

		// Action
		await deleteReplyUseCase.execute({
			userId: 'user-123',
			threadId: 'thread-123',
			commentId: 'comment-123',
			replyId: 'reply-123',
		});

		// Assert
		expect(mockThreadRepository.verifyThreadById).toBeCalledWith('thread-123');
		expect(mockCommentRepository.verifyCommentById).toBeCalledWith(
			'comment-123',
		);
		expect(mockReplyRepository.verifyReplyById).toBeCalledWith('reply-123');
		expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(
			'reply-123',
			'user-123',
		);
		expect(mockReplyRepository.deleteReply).toBeCalledWith('reply-123');
	});
});
