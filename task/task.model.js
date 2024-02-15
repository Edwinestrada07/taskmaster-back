import { DataTypes, Model } from "sequelize";
import sequelize from '../connect.js'

class Task extends Model {
}

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
}, {
    sequelize,
    modelName: 'Task'
})

Task.sync({ alter:true })

export default Task