import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importa los routers de autenticación, usuarios y tareas
import AuthRouter from './auth/auth.js';
import UserRouter from './user/user.js';
import TaskRouter from './task/task.js';

// Importa los modelos para definir las relaciones
import Task from './task/task.model.js';
import TaskDetail from './task/taskDetail.model.js';


dotenv.config();

const app = express();

// Configurar CORS y middlewares de express
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Definir las relaciones entre modelos
Task.hasMany(TaskDetail, { foreignKey: 'taskId', as: 'details' });
TaskDetail.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

// Sincronizar los modelos con la base de datos
(async () => {
  await Task.sync({ alter: true });
  await TaskDetail.sync({ alter: true });
})();

// Configurar rutas
app.use(AuthRouter);
app.use(UserRouter);
app.use(TaskRouter);

// Servir archivos estáticos desde la carpeta 'dist'
app.use(express.static('dist'));

// Ruta para verificar el funcionamiento del servidor
app.get('/', (req, res) => {
  res.send('El servidor está funcionando');
});

// Puerto del servidor
app.listen(5000, () => {
  console.log(`Example app listening on port ${5000}`);
});
