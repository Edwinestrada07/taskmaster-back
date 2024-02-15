import express  from 'express'
import cors from 'cors'
import AuthRouter from './auth/auth.js'
import UserRouter from './user/user.js'

const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())

app.use(AuthRouter)
app.use(UserRouter)

app.listen(5000)