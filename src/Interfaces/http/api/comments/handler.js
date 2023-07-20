const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class ThreadsHandler {
	constructor(container) {
		this._container = container;

		this.postCommentsHandler = this.postCommentsHandler.bind(this);
		this.deleteCommentsByIdHandler = this.deleteCommentsByIdHandler.bind(this);
		
	}

	async postCommentsHandler(request, h) {

		request.payload.threadId = request.params.threadId;
    	request.payload.userId = request.auth.credentials.id;

		const addCommentUseCase = this._container.getInstance(
			AddCommentUseCase.name,
		);
		const addedComment = await addCommentUseCase.execute(
			
			request.payload,
		);

		const response = h.response({
			status: 'success',
			data: {addedComment},
		});
		response.code(201);
		return response;
	}

	async deleteCommentsByIdHandler(request) {
		const { id: userId } = request.auth.credentials;
		const { threadId, commentId } = request.params;

		const deleteCommentUseCase = this._container.getInstance(
			DeleteCommentUseCase.name,
		);

		await deleteCommentUseCase.execute(userId, threadId, commentId);

		return {
			status: 'success',
		};
	}

}

module.exports = ThreadsHandler;
