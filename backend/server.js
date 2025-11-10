import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const server = express();
const port = 3000;
server.use(express.json());
server.use(cors({ origin: "http://localhost:5173" }));
server.use(bodyParser.urlencoded({ extended: true }));

server.get("/", (req, res) => {
  res.send("Hello... from image processor...");
});
server.post("/", (req, res) => {
  console.log(req.body);
  res.send("Received...");
});

server.listen(port, () => console.log(`Server is running on port ${port}`));
