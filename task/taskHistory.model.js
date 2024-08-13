import { DataTypes, Model } from "sequelize";
import sequelize from '../connect.js';
import User from "../user/user.model.js";

class TaskHistory extends Model {}

TaskHistory.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    priority: {
        type: DataTypes.STRING,
        allowNull: false
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
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'TaskHistory'
});

// Establecer la relación con el modelo User
TaskHistory.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(TaskHistory, { foreignKey: 'userId' });

// Sincronización del modelo con la base de datos
TaskHistory.sync({ alter: true });

export default TaskHistory;