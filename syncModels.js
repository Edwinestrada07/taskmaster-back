import sequelize from './connect.js';
import Task from './task/task.js';
import TaskDetail from './task/taskDetail.js';
import User from './user/user.js';

const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados correctamente.');
  } catch (error) {
    console.error('Error al sincronizar modelos:', error);
    throw error;
  }
};

export default syncModels;
