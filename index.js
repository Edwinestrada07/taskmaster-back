import express  from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import AuthRouter from './auth/auth.js'
import UserRouter from './user/user.js'
import TaskRouter from './task/task.js'
import syncModels from './syncModels.js';


dotenv.config()

const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(AuthRouter)
app.use(UserRouter)
app.use(TaskRouter)

// Servir archivos estáticos desde la carpeta 'dist'
app.use(express.static('dist'))

// Ruta para verificar el funcionamiento del servidor
app.get('/', (req, res) => {
  res.send('El servidor está funcionando')
})

// Sincronización de modelos
syncModels().then(() => {
  console.log('Modelos sincronizados. Iniciando la aplicación...');

  // Iniciar el servidor solo después de la sincronización
  app.listen(5000, () => {
    console.log('Servidor corriendo en el puerto 5000');
  });

}).catch(error => {
  console.error('Error al sincronizar modelos:', error);
});
