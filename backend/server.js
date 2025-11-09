import express from "express";

const server = express();
const port = 3000;

server.get("/", (req, res) => {
  res.send("Hello... from image processor...");
});

server.listen(port, () => console.log(`Server is running on port ${port}`));
