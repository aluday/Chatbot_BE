const messageRoute = require("./messageRoute");

function route (app) {
  app.use("/api/message", messageRoute)
}

module.exports = route;