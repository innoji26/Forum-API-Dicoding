const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
	constructor({ replyRepository, commentRepository, threadRepository }) {
		this._replyRepository = replyRepository;
		this._commentRepository = commentRepository;
		this._threadRepository = threadRepository;
	}

	async execute(useCasePayload) {
		// eslint-disable-next-line object-curly-newline
		const { userId, threadId, commentId, content } = useCasePayload;
		const newReply = new NewReply({userId, commentId, content})

		await this._threadRepository.verifyThreadById(threadId);
		await this._commentRepository.verifyCommentById(newReply.commentId);

		return this._replyRepository.addReply(newReply);
	}
}

module.exports = AddReplyUseCase;
