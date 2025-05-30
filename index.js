import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // 🟢 Importación agregada correctamente

// Rutas
import AuthRouter from './auth/auth.js';
import UserRouter from './user/user.js';
import TaskRouter from './task/task.js';

// Conexión a la base de datos
import sequelize from './connect.js';

dotenv.config(); // 🟢 Carga de variables de entorno

const app = express();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use(AuthRouter);
app.use(UserRouter);
app.use(TaskRouter);

// Prueba de conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos establecida correctamente.');
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err);
  });

// Puerto del servidor
app.listen(5000, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:5000`);
});
