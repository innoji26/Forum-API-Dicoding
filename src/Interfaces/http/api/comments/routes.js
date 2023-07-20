const routes = (handler) => [
	
	{
		method: 'POST',
		path: '/threads/{threadId}/comments',
		handler: handler.postCommentsHandler,
		options: {
			auth: 'forumapi_jwt',
		},
	},
	{
		method: 'DELETE',
		path: '/threads/{threadId}/comments/{commentId}',
		handler: handler.deleteCommentsByIdHandler,
		options: {
			auth: 'forumapi_jwt',
		},
	},
];

module.exports = routes;
