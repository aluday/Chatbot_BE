const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const HistoryChatSchema = new Schema (
  {
    session_id: {
      type: String
    },
    conversation: [
      {
        question: String, answer: String
      }
    ]
    
  }
)

module.exports = mongoose.model("History", HistoryChatSchema)