const mongoose = require('mongoose');


async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database sucessfully connected");
  } catch (err) {
    console.log(err);
    console.log("Database failure connected");
  }
}

module.exports = {connect};