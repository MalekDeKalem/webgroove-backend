// Define associations
const projectEntity = require('./projectEntity');
const userEntity = require('./userEntity');
const Like = require('./likes')

userEntity.hasMany(projectEntity, { foreignKey: 'userId' });
projectEntity.belongsTo(userEntity, { foreignKey: 'userId' });

userEntity.belongsToMany(projectEntity, { through: Like, foreignKey: 'userId' });
projectEntity.belongsToMany(userEntity, { through: Like, foreignKey: 'projectId'})


projectEntity.hasMany(Like, { foreignKey: 'projectId' });
Like.belongsTo(projectEntity, { foreignKey: 'projectId' });
Like.belongsTo(userEntity, {foreignKey: 'userId' })

module.exports = { userEntity, projectEntity, Like };
