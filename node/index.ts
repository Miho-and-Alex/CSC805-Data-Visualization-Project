
import * as path from 'path'
import express from 'express'

const app = express()
const port = 3000

app.use(express.static("public"));

console.log("hello sup")

app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "../views"));
app.get('/', (req, res) => res.render('index.html'))

//app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../views/index.html')))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))