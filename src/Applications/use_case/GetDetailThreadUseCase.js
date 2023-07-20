/* eslint-disable camelcase */
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../Domains/replies/entities/DetailReply');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetDetailThreadUseCase {
	constructor({ threadRepository, commentRepository, replyRepository }) {
		this._threadRepository = threadRepository;
		this._commentRepository = commentRepository;
		this._replyRepository = replyRepository;
	}

	async execute(useCasePayload) {
		const { threadId } = useCasePayload;

		await this._threadRepository.verifyThreadById(threadId);
		const getThread = await this._threadRepository.getThreadById(threadId);
		const comments = await this._commentRepository.getCommentsByThreadId(
			threadId,
		);

		getThread.comments = comments.map((comment) => new DetailComment(comment));

		const commentAndReplies = await Promise.all(
			getThread.comments.map(async (comment) => {
				let replies = await this._replyRepository.getRepliesByCommentId(
					comment.id,
				);

				if (replies.length > 0) {
					replies = replies.map((reply) => new DetailReply(reply));
				}

				return { ...comment, replies };
			}),
		);

		return new DetailThread({
			...getThread,
			comments: commentAndReplies,
		});
	}
}

module.exports = GetDetailThreadUseCase;
