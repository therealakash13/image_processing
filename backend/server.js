import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import {
  grayScale,
  rotateImage,
  blurImage,
  sharpenImage,
} from "./operations/operations.js";

const server = express();
const port = 3000;

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // destination folder
  },
  filename: function (req, file, cb) {
    const extensionName = path.extname(file.originalname); // extract extension name from file
    const fileName = path.basename(file.originalname, extensionName); // extract basename
    cb(null, `${fileName}-${Date.now()}${extensionName}`); // returning fullname appending current time in between
  },
});

const upload = multer({ storage: storage });

// path resolving
const __filename = fileURLToPath(import.meta.url); // absolute filename
const __dirname = path.dirname(__filename); // absolute directory name

// Ensure uploads and converts folder exists
const uploadDir = path.join(__dirname, "uploads");
await fs.mkdir(uploadDir, { recursive: true });

server.use(express.json()); // parsing json
server.use(cors({ origin: "http://localhost:5173" })); // cors config
server.use(bodyParser.urlencoded({ extended: true })); // body parsing

server.get("/", (req, res) => {
  res.send("Hello... from image processor...");
});

server.post("/upload", upload.single("image"), async (req, res) => {
  const operation = req.body.operation;
  const inputPath = path.join(__dirname, req.file.path); // absolute path of uploaded file

  try {
    // Implement slider for rotate, blur or sharpen and preview

    let bufferStream = "";
    switch (operation) {
      case "grayscale":
        bufferStream = await grayScale(inputPath);
        break;
      case "rotate":
        bufferStream = await rotateImage(inputPath, 90);
        break;

      case "blur":
        bufferStream = await blurImage(inputPath, 5);
        break;

      case "sharpen":
        bufferStream = await sharpenImage(inputPath, 2);
        break;

      default:
        throw new Error("Unsupported operation.");
    }

    return res.set("Content-Type", "image/png").status(200).send(bufferStream);
  } catch (error) {
    // fix this frontend only expect array buffer even on error
    console.log(error);
    return res.status(500).json({
      message: "Error processing file.",
      error: error.message || null,
    });
  }
});

server.listen(port, () => console.log(`Server is running on port ${port}`));
