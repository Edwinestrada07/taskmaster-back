import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import syncModels from './syncModels.js'; 

import AuthRouter from './auth/auth.js';
import UserRouter from './user/user.js';
import TaskRouter from './task/task.js';

dotenv.config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(AuthRouter);
app.use(UserRouter);
app.use(TaskRouter);

app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.send('El servidor está funcionando');
});

syncModels().then(() => {
  console.log('Modelos sincronizados. Iniciando la aplicación...');

  app.listen(5000, () => {
      console.log('Servidor corriendo en el puerto 5000');
  });
}).catch(error => {
  console.error('Error al sincronizar modelos:', error);
});
