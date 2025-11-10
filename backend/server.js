import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import sharp from "sharp";

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

server.get("/", (req, res) => {
  res.send("Hello... from image processor...");
});

server.post("/upload", upload.single("image"), async (req, res) => {
  const inputPath = path.join(__dirname, req.file.path); // absolute path of uploaded file
  const outputPath = path.join(convertDir, req.file.filename); // absolute path of converted file

  try {
    const response = await sharp(inputPath).grayscale().toFile(outputPath); // image processing
    if (!response) throw new Error("Error while processing image."); // error while processing
    await fs.unlink(inputPath); // delete original if success

    setTimeout(async () => {
      try {
        await fs.unlink(outputPath);
        console.log(`Deleted file: ${outputPath}`);
      } catch (err) {
        console.error("Failed to delete file:", err.message);
      }
    },5 * 60 * 1000); // delete converted file after 5 mins

    return res.status(200).json({
      message: "Image processed successfully",
      downloadUrl: `http://localhost:3000/converts/${req.file.filename}`, // send static path of processed image
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Error processing file.",
        error: error.message || null,
      });
  }
});

server.listen(port, () => console.log(`Server is running on port ${port}`));
