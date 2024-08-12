import { DataTypes, Model } from "sequelize";
import sequelize from '../connect.js'
import User from "../user/user.model.js";

class Task extends Model {}

Task.init({
    description: DataTypes.TEXT,
    dueDate: DataTypes.DATE,
    priority: {
        type: DataTypes.ENUM([ 'LOW', 'MEDIUM', 'HIGH' ]),
        defaultValue: 'MEDIUM'
    },
    status: {
        type: DataTypes.ENUM(['PENDING', 'IN_PROGRESS', 'COMPLETED']), 
        defaultValue: 'PENDING'
    },
    isFavorite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'Task'
});

Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task, { foreignKey: 'userId' });

Task.sync({ alter:true });

export default Task;
