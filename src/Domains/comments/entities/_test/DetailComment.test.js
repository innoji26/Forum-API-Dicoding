const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
	it('should throw error when payload did not contain needed property', async () => {
		// Arrange
		const payload = {
			id: 'comment-123',
			username: 'innoji',
			date: '2021-08-08T07:19:09.775Z',
		};

		// Action and Assert
		expect(() => new DetailComment(payload)).toThrowError(
			'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
		);
	});

	it('should throw error when payload did not meet data type spesification', async () => {
		// Arrange
		const payload = {
			id: 'comment-123',
			username: 123,
			date: '2021-08-08T07:19:09.775Z',
			content: 'a comment',
			is_delete: '0',
		};

		// Action and Assert
		expect(() => new DetailComment(payload)).toThrowError(
			'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION',
		);
	});

	it('should create detailComment object correctly', () => {
		// Arrange
		const payload = {
			id: 'comment-123',
			username: 'innoji',
			date: '2021-08-08T07:19:09.775Z',
			content: 'a comment',
			is_delete: '0',
		};

		// Action
		// eslint-disable-next-line object-curly-newline
		const { id, username, date, content } = new DetailComment(payload);

		// Assert
		expect(id).toEqual(payload.id);
		expect(username).toEqual(payload.username);
		expect(date).toEqual(payload.date);
		expect(content).toEqual(payload.content);
	});

	it('should create detailComment object correctly', () => {
		// Arrange
		const payload = {
			id: 'comment-123',
			username: 'innoji',
			date: '2021-08-08T07:19:09.775Z',
			content: 'a comment',
			is_delete: '1',
		};

		// Action
		// eslint-disable-next-line object-curly-newline
		const { id, username, date, content } = new DetailComment(payload);

		// Assert
		expect(id).toEqual(payload.id);
		expect(username).toEqual(payload.username);
		expect(date).toEqual(payload.date);
		expect(content).toEqual('**komentar telah dihapus**');
	});
});
