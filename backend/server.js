import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import cron from "node-cron";
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
const convertDir = path.join(__dirname, "converts");
await fs.mkdir(uploadDir, { recursive: true });
await fs.mkdir(convertDir, { recursive: true });

server.use(express.json()); // Parsing json
server.use(cors({ origin: "http://localhost:5173" })); // cors config
server.use(bodyParser.urlencoded({ extended: true })); // body parsing
server.use("/converts", express.static(convertDir));

// task scheduler -- Keep each converted file for 5 mins, else delete them
cron.schedule("* * * * *", async () => {
  console.log("Cron job is running...");
  const currTime = Date.now(); // Current time of job
  const delTime = 1 * 60 * 1000; // Deletion time for file
  const files = await fs.readdir(convertDir); // Read all files in 'converts' folder

  // for each file perform deletion task if file is older than 5 mins
  for (const file of files) {
    const filePath = path.join(convertDir, file); // path resolver for current file
    const stats = await fs.stat(filePath); // read stats of current file
    const fileChangeTime = stats.mtimeMs; // getting modification time of current file

    // Delete files older than 1 minute
    if (currTime - fileChangeTime > delTime) {
      await fs.unlink(filePath);
      console.log("Deleted:", file);
    }
  }
});

server.get("/", (req, res) => {
  res.send("Hello... from image processor...");
});

server.post("/upload", upload.single("image"), async (req, res) => {
  const operation = req.body.operation;

  const inputPath = path.join(__dirname, req.file.path); // absolute path of uploaded file
  const outputPath = path.join(convertDir, req.file.filename); // absolute path of converted file

  try {
    // Implement different operations

    switch (operation) {
      case "grayscale":
        await grayScale(inputPath, outputPath);
        break;
      case "rotate":
        await rotateImage(inputPath, outputPath, 90);
        break;

      case "blur":
        await blurImage(inputPath, outputPath, 5);
        break;

      case "sharpen":
        await sharpenImage(inputPath, outputPath, 2);
        break;

      default:
        throw new Error("Unsupported operation.");
    }

    return res.status(200).json({
      message: "Image processed successfully",
      downloadUrl: `http://localhost:3000/converts/${req.file.filename}`, // send static path of processed image
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error processing file.",
      error: error.message || null,
    });
  }
});

server.listen(port, () => console.log(`Server is running on port ${port}`));
