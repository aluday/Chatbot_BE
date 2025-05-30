const axios = require("axios");
const History = require("../models/historyChatSchema");

const BASE_URL = process.env.RAGFLOW_URL;
const CHAT_ID = process.env.CHAT_ID;
const ENDPOINT = `/${CHAT_ID}/completions`;
const url = `${BASE_URL}${ENDPOINT}`;
class MessageController {
  async createChatSession(req, res) {
    try {
      const response = await axios.post(
        url,
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
        session_id: session_id,
      });
    } catch (error) {
      return res.status(500).send({
        status: false,
        message: "Lỗi khi tạo session chat",
        error
      });
    }
  }

  async sendAnswer(req, res) {
    try {
      const { question, session_id } = req.body;
      const response = await axios.post(
        url,
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
      // console.log(response.data.data.answer);

      await History.findOneAndUpdate(
        { session_id },
        { $push: { conversation: { question, answer } } }
      );

      return res.status(200).send({
        status: true,
        message: "Answer",
        answer: answer,
      });
    } catch (error) {
      return res.status(500).send({
        status: false,
        message: "Lỗi khi gửi câu hỏi",
        error
      });
    }
  }

  async getConversationList(req, res) {
    try {
      console.log("session_id: ", req.params);
      
      const session_id = req.params.id;
      
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
