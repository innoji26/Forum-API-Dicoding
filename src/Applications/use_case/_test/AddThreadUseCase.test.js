const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
	it('should orchestrating the add user action correctly', async () => {
		// Arrange
		const useCasePayload = {
			userId: 'user-123',
			title: 'New Thread',
			body: 'This is a new thread',
		};
		const mockAddedThread = new AddedThread({
			id: 'thread-123',
			title: useCasePayload.title,
			owner: 'user-123',
		});
		const mockThreadRepository = new ThreadRepository();

		// Mocking
		mockThreadRepository.addThread = jest.fn(() => Promise.resolve(mockAddedThread));

		/** creating use case instance */
		const addThreadUseCase = new AddThreadUseCase({
			threadRepository: mockThreadRepository,
		});

		// Action
		const addedThread = await addThreadUseCase.execute(
			useCasePayload,
		);

		// Assert
		expect(addedThread).toStrictEqual(
			new AddedThread({
				id: 'thread-123',
				title: useCasePayload.title,
				owner: 'user-123',
			}),
		);
		expect(mockThreadRepository.addThread).toBeCalledWith(
			new NewThread({
				userId: useCasePayload.userId,
				title: useCasePayload.title,
				body: useCasePayload.body,
			}),
		);
	});
});
