const express = require("express");
const cors = require("cors");
const db = require("./configs/db_connection");
const dotenv = require("dotenv")
const messageRoute = require("./routes/messageRoute")

dotenv.config()
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
db.connect();
app.use(cors());

const PORT = process.env.PORT
app.use("/api/messages", messageRoute)

app.listen(PORT, ()=>{
  console.log("Server is running on port " + PORT);
}) 