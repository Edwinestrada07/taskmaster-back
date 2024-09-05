import { DataTypes, Model } from 'sequelize';
import sequelize from '../connect.js';
import Task from '../task/task.js';

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
        type: DataTypes.TEXT,
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
