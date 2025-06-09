const { DataTypes } = require("sequelize");
const { sequelize }   = require("../db_connection");

const Reaction = sequelize.define("Reaction", {
  id:         { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id:    {
    type: DataTypes.INTEGER, allowNull: false,
    references: { model: "User", key: "id" }
  },
  comment_id: {
    type: DataTypes.INTEGER, allowNull: false,
    references: { model: "Comment", key: "id" }
  },
  type:       { type: DataTypes.ENUM("like","dislike"), allowNull: false }
}, {
  tableName: "Reaction",
  timestamps: false,
  indexes: [{ unique: true, fields: ["user_id","comment_id"] }]
});

module.exports = Reaction;