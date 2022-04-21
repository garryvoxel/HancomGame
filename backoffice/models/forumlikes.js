module.exports = (sequelize, DataTypes) => {
	const ForumLikes = sequelize.define('ForumLikes',
		{
			post_id: {
				type: DataTypes.BIGINT,
				allowNull: false,
				primaryKey: true
			},
			liker_id: {
				type: DataTypes.BIGINT,
				allowNull: false,
				primaryKey: true
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false
			}
		},
		{
			tableName: 'ForumLikes',
			timestamps: true,
			updatedAt: false,
			createdAt: 'created_at'
		}
    )

	return ForumLikes
}