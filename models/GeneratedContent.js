module.exports = (sequelize, DataTypes) => {
  const GeneratedContent = sequelize.define('GeneratedContent', {
    product_info: {
      type: DataTypes.JSON,   
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Generated'
    }
  }, {
    tableName: 'generated_contents'
  });

  GeneratedContent.associate = (models) => {
    GeneratedContent.hasMany(models.Evaluation, {
      foreignKey: 'content_id',
      as: 'Evaluations'   // alias cần dùng khi include
    });
  };

  return GeneratedContent;
};
