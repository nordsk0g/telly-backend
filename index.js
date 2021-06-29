const app = require("./app");
const http = require("http");
const config = require("./utils/config");
const pool = require("./db"):

const server = http.createServer(app);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
