const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post('/login ', (req, res) => {
})

app.get('/signup', (req, res) => {
  res.render('signup.ejs')
})

app.post('/signup', (req, res) => {
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})