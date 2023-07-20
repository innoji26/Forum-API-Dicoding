/* eslint-disable camelcase */

exports.up = (pgm) => {
	pgm.createTable('comments', {
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
		},
		content: {
			type: 'TEXT',
			notNull: true,
		},
		thread_id: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
		owner: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
		date: {
			type: 'TIMESTAMP',
			notNull: true,
			default: pgm.func('current_timestamp'),
		},
		is_delete: {
			type: 'VARCHAR(1)',
			notNull: true,
			default: '0',
		},
	});

	pgm.addConstraint(
		'comments',
		'fk_comments.thread_id_threads.id',
		'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE',
	);

	pgm.addConstraint(
		'comments',
		'fk_comments.owner_users.id',
		'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
	);
};

exports.down = (pgm) => {
	pgm.dropConstraint('comments', 'fk_comments.thread_id_threads.id');
	pgm.dropConstraint('comments', 'fk_comments.owner_users.id');
	pgm.dropTable('comments');
};
