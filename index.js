import express  from 'express'
import cors from 'cors'

import AuthRouter from './auth/auth.js'
import UserRouter from './user/user.js'
import TaskRouter from './task/task.js'

const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())

app.use(AuthRouter)
app.use(UserRouter)
app.use(TaskRouter)

app.listen(5000)