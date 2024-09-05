import { DataTypes, Model } from 'sequelize';
import sequelize from '../connect.js';
import Task from '../task/task.js';

class TaskDetail extends Model {}

TaskDetail.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    detail: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    taskId: {
        type: DataTypes.INTEGER,
        references: {
        model: Task,
        key: 'id',
        },
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'TaskDetail',
});

TaskDetail.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

// Sincronización del modelo con la base de datos
TaskDetail.sync({ alter: true });

export default TaskDetail;
