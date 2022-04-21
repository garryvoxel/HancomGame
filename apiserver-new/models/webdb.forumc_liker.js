module.exports = (sequelize, DataTypes) => {
	const ForumC_Like = sequelize.define('ForumC_Like',
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
			tableName: 'ForumC_Like',
			timestamps: true,
			updatedAt: false,
			createdAt: 'created_at'
		}
    )

	return ForumC_Like
}