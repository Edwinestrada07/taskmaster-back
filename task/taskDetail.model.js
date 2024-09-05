import { DataTypes, Model } from 'sequelize';
import sequelize from '../connect.js';

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

// Sincronización
TaskDetail.sync({ alter: true });

export default TaskDetail;
