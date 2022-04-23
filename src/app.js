const express = require('express')
require('./db/mongoose')
const path = require('path')
const cors = require('cors')
const courseRouter = require('./routers/course')
const studentRouter = require('./routers/student')
const professorRouter = require('./routers/professor')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/courses', courseRouter)
app.use('/students',studentRouter)
app.use('/professors',professorRouter)
app.use(errorHandler)



module.exports = app