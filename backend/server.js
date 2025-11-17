import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {
  grayScale,
  rotateImage,
  blurImage,
  sharpenImage,
} from "./operations/operations.js";

const server = express();
const port = 3000;

server.use(express.json()); // parsing json
server.use(cors({ origin: "http://localhost:5173" })); // cors config
server.use(bodyParser.urlencoded({ extended: true })); // body parsing

server.get("/", (req, res) => {
  res.send("Hello... from image processor...");
});

server.post(
  "/upload",
  express.raw({ type: "application/octet-stream", limit: "10mb" }),
  async (req, res) => {
    const operation = req.query.op; // extracting operation from query parameter
    const inputBuffer = req.body; // extracting image buffer from request
    const level = Number(req.query.level); // extracting intensity of blur, rotate and sharpness

    console.log(level);

    try {
      let bufferStream = "";
      switch (operation) {
        case "grayscale":
          bufferStream = await grayScale(inputBuffer);
          break;
        case "rotate":
          bufferStream = await rotateImage(inputBuffer, level);
          break;

        case "blur":
          bufferStream = await blurImage(inputBuffer, level);
          break;

        case "sharpen":
          bufferStream = await sharpenImage(inputBuffer, level);
          break;

        default:
          throw new Error("Unsupported operation.");
      }

      return res
        .set("Content-Type", "image/png")
        .status(200)
        .send(bufferStream);
    } catch (error) {
      console.log(error);

      const errorJson = JSON.stringify({
        message: "Error processing file.",
        error: error.message || null,
      }); // stringifying json error response
      const buffer = Buffer.from(errorJson, "utf-8"); // converting it to array buffer

      return res
        .set("Content-Type", "application/json")
        .status(500)
        .send(buffer);
    }
  }
);

server.listen(port, () => console.log(`Server is running on port ${port}`));
