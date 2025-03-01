const express = require("express");
const cors = require("cors");
const db = require("./configs/db_connection");
const dotenv = require("dotenv")
const route = require("./routes/index")
const bodyParser = require("body-parser");

dotenv.config()
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
db.connect();
app.use(cors());

const PORT = process.env.PORT
route(app)

app.listen(PORT, ()=>{
  console.log("Server is running on port " + PORT);
}) 