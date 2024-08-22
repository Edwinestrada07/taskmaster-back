import express  from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import AuthRouter from './auth/auth.js'
import UserRouter from './user/user.js'
import TaskRouter from './task/task.js'

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

// Puerto del servidor
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Aplicación conectada en el puerto ${PORT}`)
})