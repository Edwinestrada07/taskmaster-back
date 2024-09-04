import sequelize from './connect.js';
import './task/task.js';
import './task/taskDetail.model.js';
import './user/user.model.js';

const syncModels = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados correctamente.');
    } catch (error) {
        console.error('Error al sincronizar modelos:', error);
        throw error; // Esto permitirá capturar el error en el index.js
    }
};

export default syncModels;
