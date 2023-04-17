import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { authRouter } from './src/routes/auth.js'
import { userRouter } from './src/routes/user.js'
import { movieRouter } from './src/routes/movie.js'
import { listRouter } from './src/routes/list.js'
const app = express()
dotenv.config()
app.use(express.json())
app.use(cors())


app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/movies', movieRouter)
app.use('/list', listRouter)






mongoose.connect(process.env.CONNECTION_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
       
})



const PORT = process.env.PORT || 3006

app.listen(PORT, () => {
    console.log('running server')
})