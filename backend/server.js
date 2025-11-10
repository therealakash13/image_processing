import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";

const server = express();
const port = 3000;

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // destination folder
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // extract extension name from file
    const baseName = path.basename(file.originalname, ext); // extract basename
    cb(null, `${baseName}-${Date.now()}${ext}`); // returning fullname appending current time in between
  },
});

const upload = multer({ storage: storage });

server.use(express.json());
server.use(cors({ origin: "http://localhost:5173" }));
server.use(bodyParser.urlencoded({ extended: true }));

server.get("/", (req, res) => {
  res.send("Hello... from image processor...");
});
server.post("/upload", upload.single("image"), (req, res) => {
  // req.body.file contains:
  // {
  //   fieldname: 'image',
  //   originalname: 'new1.jpg',
  //   encoding: '7bit',
  //   mimetype: 'image/jpeg',
  //   destination: 'uploads/',
  //   filename: 'new1-1762760694645.jpg',
  //   path: 'uploads\\new1-1762760694645.jpg',
  //   size: 80252
  // }
  res.send("Received...");
});

server.listen(port, () => console.log(`Server is running on port ${port}`));
