const express = require('express');
const bodyParser = require('body-parser')
const cors = require("cors");
const cookieParser = require('cookie-parser');

const app = express();

const corsOptions = {
  origin: "http://127.0.0.1:5173",
  credentials: true
};

const port = 5000;

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const usersRouter = require('./routes/users.js')
const foldersRouter = require('./routes/folders.js')
app.use('/users', usersRouter)
app.use('/folders', foldersRouter)

const db = require("./models");
db.sequelize.sync()
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });


app.listen(port, () => console.log(`Listening on port ${port}`));