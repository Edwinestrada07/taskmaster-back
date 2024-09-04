import { DataTypes, Model } from 'sequelize';
import sequelize from '../connect.js';
import User from '../user/user.model.js';

class Task extends Model {}

Task.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM(['LOW', 'MEDIUM', 'HIGH']),
    defaultValue: 'MEDIUM'
  },
  status: {
    type: DataTypes.ENUM(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
    defaultValue: 'PENDING'
  },
  isFavorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Task'
});

// Establecer la relación con el modelo User
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });

export default Task;
