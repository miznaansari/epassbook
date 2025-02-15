const express = require('express')
const app = express()
const connectDB = require('./db');

const port = 4000
connectDB()
app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})