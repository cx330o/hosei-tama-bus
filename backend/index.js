const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("FastSend API");
});

const PORT = process.env.PORT || 9003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
