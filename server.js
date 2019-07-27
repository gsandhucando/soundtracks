const express = require("express");
const env = require("dotenv");
const PORT = process.env.PORT || 3001;
const routes = require("./routes");
let app = express();

env.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.listen(PORT, () => {
  console.log(`Server on PORT ${PORT}`);
});
