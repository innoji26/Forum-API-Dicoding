const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
	it('should throw error when payload did not contain needed property', async () => {
		// Arrange
		const payload = {
			id: 'reply-123',
			content: 'a reply',
			username: 'innoji',
			is_delete: '0',
		};

		// Action and Assert
		expect(() => new DetailReply(payload)).toThrowError(
			'DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
		);
	});

	it('should throw error when payload did not meet data type spesification', async () => {
		// Arrange
		const payload = {
			id: 'reply-123',
			content: 123,
			date: '2021-08-08T07:19:09.775Z',
			username: 'innoji',
			is_delete: '0',
		};

		// Action and Assert
		expect(() => new DetailReply(payload)).toThrowError(
			'DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPESIFICATION',
		);
	});

	it('should create detailReply object correctly', () => {
		// Arrange
		const payload = {
			id: 'reply-123',
			content: 'a reply',
			date: '2021-08-08T07:19:09.775Z',
			username: 'innoji',
			is_delete: '0',
		};

		// Action
		// eslint-disable-next-line object-curly-newline
		const { id, content, date, username } = new DetailReply(payload);

		// Assert
		expect(id).toEqual(payload.id);
		expect(content).toEqual(payload.content);
		expect(date).toEqual(payload.date);
		expect(username).toEqual(payload.username);
	});

	it('should create detailReply object correctly if reply has deleted', () => {
		// Arrange
		const payload = {
			id: 'reply-123',
			content: 'a reply',
			date: '2021-08-08T07:19:09.775Z',
			username: 'innoji',
			is_delete: '1',
		};

		// Action
		// eslint-disable-next-line object-curly-newline
		const { id, content, date, username } = new DetailReply(payload);

		// Assert
		expect(id).toEqual(payload.id);
		expect(content).toEqual('**balasan telah dihapus**');
		expect(date).toEqual(payload.date);
		expect(username).toEqual(payload.username);
	});
});
