const express = require('express');
const bodyParser = require('body-parser')
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000"
};

const port = 5000;

app.use(cors(corsOptions));

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


const usersRouter = require('./routes/users.js')
app.use('/users', usersRouter)

const db = require("./models");
db.sequelize.sync()
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });


app.listen(port, () => console.log(`Listening on port ${port}`));