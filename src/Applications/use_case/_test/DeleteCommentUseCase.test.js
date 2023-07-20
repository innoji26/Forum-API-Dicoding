const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
	it('should orchestrating the delete comment action correctly', async () => {
		// Arrange
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		// Mocking
		mockThreadRepository.verifyThreadById = jest.fn(() => Promise.resolve());
		mockCommentRepository.verifyCommentById = jest.fn(() => Promise.resolve());
		mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
		mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve('1'));

		// create use case instance
		const deleteCommentUseCase = new DeleteCommentUseCase({
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository,
		});

		// Action
		await deleteCommentUseCase.execute('user-123', 'thread-123', 'comment-123');

		// Assert
		expect(mockThreadRepository.verifyThreadById).toBeCalledWith('thread-123');
		expect(mockCommentRepository.verifyCommentById).toBeCalledWith(
			'comment-123',
		);
		expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
			'comment-123',
			'user-123',
		);
		expect(mockCommentRepository.deleteComment).toBeCalledWith('comment-123');
	});
});
