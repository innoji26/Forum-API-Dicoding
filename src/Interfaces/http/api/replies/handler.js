const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ThreadsHandler {
	constructor(container) {
		this._container = container;

		this.postRepliesHandler = this.postRepliesHandler.bind(this);
		this.deleteRepliesByIdHandler = this.deleteRepliesByIdHandler.bind(this);
	}

	async postRepliesHandler(request, h) {
		// const { id: userId } = request.auth.credentials;
		// const { threadId, commentId } = request.params;

		request.payload.threadId = request.params.threadId;
    	request.payload.commentId = request.params.commentId;
   		request.payload.userId = request.auth.credentials.id;

		const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
		const addedReply = await addReplyUseCase.execute(
			request.payload,
		);

		const response = h.response({
			status: 'success',
			data: { addedReply},
		});
		response.code(201);
		return response;
	}

	async deleteRepliesByIdHandler(request) {
		const { id: userId } = request.auth.credentials;
		const { threadId, commentId, replyId } = request.params;

		const deleteReplyUseCase = this._container.getInstance(
			DeleteReplyUseCase.name,
		);

		await deleteReplyUseCase.execute({ userId, threadId, commentId, replyId });

		return {
			status: 'success',
		};
	}
}

module.exports = ThreadsHandler;
