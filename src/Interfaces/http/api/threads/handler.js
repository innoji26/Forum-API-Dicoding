const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');


class ThreadsHandler {
	constructor(container) {
		this._container = container;

		this.postThreadsHandler = this.postThreadsHandler.bind(this);
		this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);

	}

	async postThreadsHandler(request, h) {
		request.payload.userId = request.auth.credentials.id;

		const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

		const addedThread = await addThreadUseCase.execute(
			request.payload,
		);

		const response = h.response({
			status: 'success',
			data: {addedThread},
		});
		response.code(201);
		return response;
	}

	async getThreadByIdHandler(request) {
		const getDetailThreadUseCase = this._container.getInstance(
			GetDetailThreadUseCase.name,
		);
		const detailThread = await getDetailThreadUseCase.execute(request.params);

		return {
			status: 'success',
			data: { thread: detailThread },
		};
	}
}

module.exports = ThreadsHandler;
