import { DataTypes, Model } from "sequelize";
import sequelize from '../connect.js';
import User from "../user/user.model.js";
import TaskDetail from "./taskDetail.model.js";

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

// Establecer la relación con el modelo TaskDetail
Task.hasMany(TaskDetail, { foreignKey: 'taskId', as: 'details' });
TaskDetail.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

// Sincronización de los modelos con la base de datos
const syncModels = async () => {
    await sequelize.sync({ alter: true });
};

syncModels();

export default Task;
