const express = require('express')
const app = express()
const connectDB = require('./db');
var cors = require('cors')
const port = 4000;
connectDB()

app.use(cors())
 
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api',require('./route/Createuser'));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})