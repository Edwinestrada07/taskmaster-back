import Express from 'express';
import Task from './task.model.js';
import TaskHistory from './taskHistory.model.js'; // Asegúrate de importar tu modelo de historial
import Sequelize from 'sequelize';
import validateToken from '../authMiddleware/authMiddleware.js';

const app = Express.Router();

// Obtener todas las tareas o tareas por estado
app.get('/task', validateToken, async (req, res) => {
    const { status } = req.query;
    try {
        const tasks = status
            ? await Task.findAll({ where: { status: { [Sequelize.Op.eq]: status } } })
            : await Task.findAll();
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Crear una nueva tarea
app.post('/task', validateToken, async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.send({ status: "success", task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la tarea.' });
    }
});

// Actualizar una tarea existente
app.put('/task/:id', validateToken, async (req, res) => {
    try {
        const task = await Task.update(req.body, {
            where: { id: req.params.id }
        });
        res.send({ status: "success", task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la tarea.' });
    }
});

// Actualizar una tarea existente Drag and Drop
app.put('/task/:id/status', validateToken, async (req, res) => {
    try {
        // Verifica que req.body contenga el campo esperado, por ejemplo 'status'
        if (!req.body.status) {
            return res.status(400).json({ error: 'Falta el campo de estado.' });
        }

        // Actualiza la tarea con el ID proporcionado
        const [updated] = await Task.update(req.body, {
            where: { id: req.params.id }
        });

        if (updated) {
            const updatedTask = await Task.findByPk(req.params.id); // Obtiene la tarea actualizada
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
    try {
        const task = await Task.destroy({
            where: { id: req.params.id }
        });
        res.send({ status: "success", task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la tarea.' });
    }
});

// Obtener tareas favoritas
app.get('/task/favorites', validateToken, async (req, res) => {
    try {
        const tasks = await Task.findAll({ where: { isFavorite: true } });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tareas favoritas.' });
    }
});

// Marcar/desmarcar tarea como favorita
app.post('/task/:id/favorite', validateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findByPk(id);
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

// Obtener tareas completadas
/*app.get('/task/completed', validateToken, async (req, res) => {
    try {
        const completedTasks = await Task.findAll({ where: { status: true } });
        res.json(completedTasks);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tareas completadas.' });
    }
});*/

// Obtener historial de tareas completadas
app.get('/task/history', validateToken, async (req, res) => {
    try {
        const taskHistory = await TaskHistory.findAll();
        res.status(200).json(taskHistory);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el historial de tareas.' });
    }
});

// Mover tareas completadas al historial
app.post('/task/:id/move', validateToken, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);

        if (!task) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        // Verifica si la tarea está completada
        if (task.status !== 'COMPLETED') {
            return res.status(400).json({ error: 'Solo se pueden mover tareas completadas al historial.' });
        }

        // Mover la tarea al historial
        await TaskHistory.create({
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status: task.status,
            isFavorite: task.isFavorite,
            userId: task.userId,  // Asegúrate de transferir el userId
            completedAt: task.updatedAt  // Puedes utilizar la fecha de actualización o crear un campo `completedAt` específico
        });

        // Eliminar la tarea de la tabla principal
        await task.destroy();

        res.status(200).json({ message: 'Tarea movida al historial con éxito' });
    } catch (error) {
        console.error('Error al mover la tarea al historial:', error);
        res.status(500).json({ error: 'Error al mover la tarea al historial' });
    }
});

export default app;