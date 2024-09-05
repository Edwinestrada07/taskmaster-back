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
            model: 'Tasks',
            key: 'id',
        },
        allowNull: false,
    }
}, {
    sequelize, 
    modelName: 'TaskDetail'
});

// Definir las relaciones después de la inicialización del modelo.
TaskDetail.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

export default TaskDetail;
