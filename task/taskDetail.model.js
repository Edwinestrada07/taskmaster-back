import { DataTypes, Model } from 'sequelize';
import sequelize from '../connect.js';
import Task from './task.js';

class TaskDetail extends Model {}

TaskDetail.init({
  taskId: {
    type: DataTypes.INTEGER,
    references: {
      model: Task,
      key: 'id',
    },
    allowNull: false,
  },
  detail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'TaskDetail',
});

TaskDetail.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

export default TaskDetail;
