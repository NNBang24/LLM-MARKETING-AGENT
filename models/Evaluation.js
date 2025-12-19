'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Evaluation extends Model {
    static associate(models) {
      // Liên kết với GeneratedContent
      Evaluation.belongsTo(models.GeneratedContent, {
        foreignKey: 'content_id',
        as: 'GeneratedContent'
      });
    }
  }

  Evaluation.init(
    {
      content_id: {          
        type: DataTypes.INTEGER,
        allowNull: false
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      feedback: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'Evaluation',
      tableName: 'Evaluations',
      timestamps: true
    }
  );

  return Evaluation;
};
