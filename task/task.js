import Express from 'express';
import Task from './task.model.js';
import TaskHistory from './taskHistory.model.js';
import Sequelize from 'sequelize';
import validateToken from '../authMiddleware/authMiddleware.js';

const app = Express.Router();

// Obtener todas las tareas o tareas por estado
app.get('/task', validateToken, async (req, res) => {
    const { status } = req.query;
    const userId = req.user.id; // Obtener el ID del usuario desde el token
    try {
        const tasks = status
            ? await Task.findAll({ where: { status: { [Sequelize.Op.eq]: status }, userId } }) // Filtrar por userId
            : await Task.findAll({ where: { userId } }); // Filtrar por userId
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Obtener tareas favoritas
app.get('/task/favorites', validateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const tasks = await Task.findAll({ where: { isFavorite: true, userId } }); // Filtrar por userId
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tareas favoritas.' });
    }
});

// Obtener historial de tareas completadas
app.get('/task/history', validateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const taskHistory = await TaskHistory.findAll({ where: { userId } }); // Filtrar por userId
        res.status(200).json(taskHistory);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el historial de tareas.' });
    }
});

// Crear una nueva tarea
app.post('/task', validateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const task = await Task.create({ ...req.body, userId });
        res.send({ status: "Éxito al crear tarea", task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al crear la tarea.' });
    }
});

// Marcar/desmarcar tarea como favorita
app.post('/task/:id/favorite', validateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const task = await Task.findOne({ where: { id, userId } }); // Filtrar por userId
        if (!task) {
            return res.status(404).json({ error: 'Tarea no encontrada.' });
        }
        task.isFavorite = !task.isFavorite;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado de la tarea.' });
    }
});

// Mover tareas completadas al historial
app.post('/task/:id/move', validateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const task = await Task.findOne({ where: { id: req.params.id, userId } }); // Filtrar por userId

        if (!task) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        if (task.status !== 'COMPLETED') {
            return res.status(400).json({ error: 'Solo se pueden mover tareas completadas al historial.' });
        }

        await TaskHistory.create({
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status: task.status,
            isFavorite: task.isFavorite,
            userId: task.userId,
            completedAt: task.updatedAt
        });

        await task.destroy();

        res.status(200).json({ message: 'Tarea movida al historial con éxito' });
    } catch (error) {
        console.error('Error al mover la tarea al historial:', error);
        res.status(500).json({ error: 'Error al mover la tarea al historial' });
    }
});

// Actualizar una tarea existente
app.put('/task/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).send('Tarea no encontrada');

        task.details = req.body.details; // Guardar detalles
        await task.save();

        res.status(200).send(task);
    } catch (error) {
        res.status(500).send('Error al actualizar la tarea');
    }
});

// Actualizar una tarea existente Drag and Drop
app.put('/task/:id/status', validateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        if (!req.body.status) {
            return res.status(400).json({ error: 'Falta el campo de estado.' });
        }

        const [updated] = await Task.update(req.body, {
            where: { id: req.params.id, userId } // Filtrar por userId
        });

        if (updated) {
            const updatedTask = await Task.findOne({ where: { id: req.params.id, userId } }); // Filtrar por userId
            res.send({ status: "success", task: updatedTask });
        } else {
            res.status(404).json({ error: 'Tarea no encontrada.' });
        }
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        res.status(500).json({ error: 'Error al actualizar la tarea.' });
    }
});

// Eliminar una tarea
app.delete('/task/:id', validateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const task = await Task.destroy({
            where: { id: req.params.id, userId } // Filtrar por userId
        });
        res.send({ status: "success", task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la tarea.' });
    }
});

// Eliminar todas las tareas del historial
app.delete('/task/:id/history', validateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const deletedCount = await TaskHistory.destroy({
            where: { userId } // Filtrar por userId
        });

        if (deletedCount === 0) {
            return res.status(404).json({ message: 'No se encontraron tareas en el historial para eliminar.' });
        }

        res.status(200).json({ message: 'Todas las tareas del historial han sido eliminadas.' });
    } catch (error) {
        console.error('Error al eliminar las tareas del historial:', error);
        res.status(500).json({ error: 'Error al eliminar las tareas del historial.' });
    }
});

//Eliminar Detalle de tareas
app.delete('/task/:id/detail/:detailId', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).send('Tarea no encontrada');

        task.details.splice(req.params.detailId, 1); // Eliminar detalle
        await task.save();

        res.status(200).send(task);
    } catch (error) {
        res.status(500).send('Error al eliminar el detalle');
    }
});


export default app;
