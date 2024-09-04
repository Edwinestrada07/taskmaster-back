
import sequelize from './connect.js';
import Task from './task/task.js';
import TaskDetail from './task/taskDetail.model.js';
import User from './user/user.model.js';

const syncModels = async () => {
    try {
        // Aquí podemos sincronizar todos los modelos
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados con éxito');
    } catch (error) {
        console.error('Error al sincronizar modelos:', error);
    }
};

syncModels();
