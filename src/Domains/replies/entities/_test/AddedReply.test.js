const AddedReply = require('../AddedReply');

describe('an AddedReplies entities', () => {
	it('should throw error when payload did not contain needed property', () => {
		// Arrange
		const payload = {
			id: 'reply-123',
			content: 'a reply',
		};

		// Action and Assert
		expect(() => new AddedReply(payload)).toThrowError(
			'ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
		);
	});

	it('should throw error when payload did not meet data type spesification', () => {
		// Arrange
		const payload = {
			id: 'reply-123',
			content: 123,
			owner: 'user-123',
		};

		// Action and Assert
		expect(() => new AddedReply(payload)).toThrowError(
			'ADDED_REPLY.NOT_MEET_DATA_TYPE_SPESIFICATION',
		);
	});

	it('should create addedReply object correctly', () => {
		// Arrange
		const payload = {
			id: 'reply-123',
			content: 'a reply',
			owner: 'user-123',
		};

		// Action
		const { id, content, owner } = new AddedReply(payload);

		// Assert
		expect(id).toEqual(payload.id);
		expect(content).toEqual(payload.content);
		expect(owner).toEqual(payload.owner);
	});
});
