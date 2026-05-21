import express from 'express'
import mongoose from 'mongoose'
import studentRouter from './routes/studentRouter.js'
import userRouter from './routes/userRouter.js'
import authenticateUser from './middlewares/authenticate.js'
import productRouter from "./routes/productRouter.js"

const mongoUri = "mongodb://admin:1234@ac-z6he8nm-shard-00-00.j4unfzb.mongodb.net:27017,ac-z6he8nm-shard-00-01.j4unfzb.mongodb.net:27017,ac-z6he8nm-shard-00-02.j4unfzb.mongodb.net:27017/?ssl=true&replicaSet=atlas-3s2798-shard-0&authSource=admin&appName=Cluster0"

mongoose.connect(mongoUri).then(
    () => {
        console.log("Connected to MongoDB")
    }
).catch((error) => {
    console.log("Error connecting to MongoDB:", error)
})


const app = express()

app.use(express.json())

app.use(authenticateUser)

app.use("/students", studentRouter)
app.use("/users", userRouter)
app.use("/products", productRouter)

app.listen(3000,
    () => {
        console.log("Server is running!")
    }
)