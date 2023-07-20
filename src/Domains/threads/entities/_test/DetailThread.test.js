const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
	it('should throw error when payload did not contain needed property', async () => {
		// Arrange
		const payload = {
			id: 'thread-123',
			title: 'Title Thread',
			body: 'Body thread',
			date: '2021-08-08T07:19:09.775Z',
		};

		// Action and Assert
		expect(() => new DetailThread(payload)).toThrowError(
			'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
		);
	});

	it('should throw error when payload did not meet data type spesification', async () => {
		// Arrange
		const payload = {
			id: 'thread-123',
			title: 'Title Thread',
			body: 'Body thread',
			date: '2021-08-08T07:19:09.775Z',
			username: 'innoji',
			comments: {},
		};

		// Action and Assert
		expect(() => new DetailThread(payload)).toThrowError(
			'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION',
		);
	});

	it('should create detailThread object correctly', () => {
		// Arrange
		const payload = {
			id: 'thread-123',
			title: 'Title Thread',
			body: 'Body thread',
			date: '2021-08-08T07:19:09.775Z',
			username: 'innoji',
			comments: [
				{
					id: 'comment-_pby2_tmXV6bcvcdev8xk',
					username: 'johndoe',
					date: '2021-08-08T07:22:33.555Z',
					content: 'sebuah comment',
				},
				{
					id: 'comment-yksuCoxM2s4MMrZJO-qVD',
					username: 'innoji',
					date: '2021-08-08T07:26:21.338Z',
					content: '**komentar telah dihapus**',
				},
			],
		};

		// Action
		// eslint-disable-next-line object-curly-newline
		const { id, title, body, date, username, comments } = new DetailThread(
			payload,
		);

		// Assert
		expect(id).toEqual(payload.id);
		expect(title).toEqual(payload.title);
		expect(body).toEqual(payload.body);
		expect(date).toEqual(payload.date);
		expect(username).toEqual(payload.username);
		expect(comments).toEqual(payload.comments);
		expect(Array.isArray(comments)).toEqual(true);
	});
});
