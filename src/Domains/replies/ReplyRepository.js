/* eslint-disable no-unused-vars */
class ReplyRepository {
	async addReply(newReply) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async verifyReplyById(id) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async verifyReplyOwner(id, userId) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async getRepliesByCommentId(commentId) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async deleteReply(id) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}
}

module.exports = ReplyRepository;
