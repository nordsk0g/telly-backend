const app = require("./app");
const http = require("http");
const pool = require("./db/db");

const server = http.createServer(app);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
