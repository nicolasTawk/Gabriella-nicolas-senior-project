const { DataTypes } = require("sequelize");
const { sequelize } = require("../db_connection");

const Comment = sequelize.define("Comment", {
  id:        { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id:   { 
    type: DataTypes.INTEGER, allowNull: false,
    references: { model: "User", key: "id" }
  },
  review_id: {
    type: DataTypes.INTEGER, allowNull: false,
    references: { model: "Review", key: "id" }
  },
  parent_id: {
    type: DataTypes.INTEGER, allowNull: true,
    references: { model: "Comment", key: "id" }
  },
  content:   { type: DataTypes.TEXT, allowNull: false },
  created_at:{ type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: "Comment",
  timestamps: false
});

module.exports = Comment;