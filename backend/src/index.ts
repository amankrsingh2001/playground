import './dotenv'

import express from "express"

const app = express()


app.use(express.json())



app.listen(process.env.PORT,()=>{
    console.log(`Server is listining on ${process.env.PORT}`)
})