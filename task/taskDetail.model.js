import { DataTypes, Model } from "sequelize";
import sequelize from "../connect.js";
import Task from "./task.js"; // Asegúrate de que la ruta es correcta

class TaskDetail extends Model {}

TaskDetail.init(
  {
    taskId: {
      type: DataTypes.INTEGER,
      references: {
        model: Task, // Referencia al modelo Task
        key: "id",
      },
      allowNull: false,
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TaskDetail",
  }
);

// Establecer la relación con el modelo Task
TaskDetail.belongsTo(Task, { foreignKey: "taskId", as: "task" });

// Sincronización de los modelos con la base de datos
export default TaskDetail;
