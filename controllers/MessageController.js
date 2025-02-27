const axios = require("axios");
const History = require("../models/historyChatSchema");

const BASE_URL = process.env.RAGFLOW_URL;
const CHAT_ID = process.env.CHAT_ID;
const ENDPOINT = `/${CHAT_ID}/completions`;

class MessageController {
  async createChatSession(req, res) {
    try {
      const response = await axios.post(
        `http://localhost:9380/api/v1/chats/83a2ca98f51211efbd8a0242ac120006//completions`,
        { stream: false },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        }
      );

      let responseString = response.data;
      const jsonParts = responseString
        .split("data:")
        .filter((part) => part.trim().startsWith("{"));
      let session_id = "";
      for (const part of jsonParts) {
        try {
          const jsonData = JSON.parse(part.trim()); // Loại bỏ khoảng trắng trước khi parse
          if (jsonData.data && jsonData.data.session_id) {
            session_id = jsonData.data.session_id;
            console.log("✅ Session ID:", jsonData.data.session_id);
            break;
          }
        } catch (error) {
          console.error("❌ Lỗi parse JSON:", error.message);
        }
      }
      const conversation = new History({ session_id });
      await conversation.save();

      return res.status(200).send({
        status: true,
        message: "Tạo session chat",
        data: session_id,
      });
    } catch (error) {
      console.log(
        "Error creating session: ",
        error.response ? error.response.data : error.message
      );
    }
  }

  async sendAnswer(req, res) {
    try {
      const { question, session_id } = req.body;
      const response = await axios.post(
        `http://localhost:9380/api/v1/chats/83a2ca98f51211efbd8a0242ac120006//completions`,
        {
          question: question,
          stream: false,
          session_id: session_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        }
      );

      let answer = response.data.data.answer;
      console.log(response.data.data.answer);

      await History.findOneAndUpdate(
        { session_id },
        { $push: { conversation: { question, answer } } }
      );

      return res.status(200).send({
        status: true,
        message: "Answer",
        data: answer,
      });
    } catch (error) {
      console.log(
        "Error creating session: ",
        error.response ? error.response.data : error.message
      );
    }
  }

  async getConversationList(req, res) {
    try {
      const session_id = req.body.session_id;
      const conv = await History.findOne({session_id: session_id});

      return res.status(200).send({
        status: true,
        message: "Lịch sử chat",
        data: conv,
      });
    } 

    catch (error) {
      console.log(error);
      return res.status(500).send({
        status: false,
        message: "Error",
        error,
      });
    }
  }
}

module.exports = new MessageController();
