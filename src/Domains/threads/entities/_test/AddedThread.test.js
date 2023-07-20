const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
	it('should throw error when payload did not contain needed property', () => {
		// Arrange
		const payload = {
			title: 'New Thread',
			owner: 'user-123',
		};

		// Action and Assert
		expect(() => new AddedThread(payload)).toThrowError(
			'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
		);
	});

	it('should throw error when payload did not meet data type spesification', () => {
		// Arrange
		const payload = {
			id: 123,
			title: 'New Thread',
			owner: 'user-123',
		};

		// Action and Assert
		expect(() => new AddedThread(payload)).toThrowError(
			'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION',
		);
	});

	it('should create addedThread object correctly', () => {
		// Arrange
		const payload = {
			id: 'thread-123',
			title: 'New Thread',
			owner: 'user-123',
		};

		// Action
		const { id, title, owner } = new AddedThread(payload);

		// Assert
		expect(id).toEqual(payload.id);
		expect(title).toEqual(payload.title);
		expect(owner).toEqual(payload.owner);
	});
});
