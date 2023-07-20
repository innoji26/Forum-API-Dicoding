class DeleteReplyUseCase {
	constructor({ replyRepository, commentRepository, threadRepository }) {
		this._replyRepository = replyRepository;
		this._commentRepository = commentRepository;
		this._threadRepository = threadRepository;
	}

	async execute(useCasePayload) {
		const { userId, threadId, commentId, replyId } = useCasePayload;

		await this._threadRepository.verifyThreadById(threadId);
		await this._commentRepository.verifyCommentById(commentId);
		await this._replyRepository.verifyReplyById(replyId);

		await this._replyRepository.verifyReplyOwner(replyId, userId);

		return this._replyRepository.deleteReply(replyId);
	}
}

module.exports = DeleteReplyUseCase;
