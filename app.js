const express = require("express");
const { v4 } = require("uuid");
const { morganChalkMiddleware } = require("./Middlewares");
const app = express();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const { bgGreen, black } = require("chalk");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const MainRouter = require("./Router/index");
const InitDBConnection = require("./Connection");
const ejs = require("ejs");
const html_to_pdf = require("html-pdf-node");

require("dotenv").config({
  path: path.join(__dirname, "Config", ".env"),
});

app.use(cors());
app.use(helmet());
app.use(compression());

const s3Config = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET,
  region: process.env.REGION,
  Bucket: process.env.BUCKET,
});

const uploadFiles = async (req, res, next) => {
  const imageUpload = multer({
    storage: multerS3({
      s3: s3Config,
      bucket: process.env.BUCKET,
      key: (req, file, cb) => {
        cb(null, v4() + "." + file.mimetype.split("/")[1]);
      },
    }),
  });

  const fileUpload = imageUpload.array("files", 5);

  fileUpload(req, res, (err) => {
    /* Validate FormData */
    if (!err) {
      next();
    } else {
      console.log(err);
      return res.status(500).json({ error: "Error in uploading files" });
    }
  });
};

app.post("/api/v1/upload", uploadFiles, async (req, res) => {
  try {
    const data = req.files.map((id) => {
      return id.location;
    });
    res.send({
      code: 200,
      data: data,
    });
  } catch (error) {
    if (error.message) {
      return res.send({
        code: 400,
        error: error.message,
      });
    }
    res.send({
      code: 400,
      error: "error",
    });
  }
});

app.get("/version", (req, res) => {
  return res.send("v.0.1");
});

app.use(morganChalkMiddleware());
app.use(express.json());

app.get("/api/v1/pdf", async (req, res) => {
  const compiled = ejs.compile(
    fs.readFileSync(path.join(__dirname, "Templates", "abc.ejs"), {
      encoding: "utf-8",
    }),
    {
      compileDebug: true,
    }
  );

  // const html = compiled({
  // name: "Just Kidding"
  // TODO: add all the values to compile this template
  // });
  const html = compiled({ name: "Just Kidding" });
  const PDF_PATH = path.join(__dirname, "Templates", "abc.pdf");
  let options = {
    format: "A4",
    path: path.join(__dirname, "Templates", "abc.pdf"),
    printBackground: true,
  };
  let file = { content: html };
  html_to_pdf.generatePdf(file, options, (err, pdfBuffer) => {
    if (err) {
      console.log(err);
      return res.status(400);
    }
    res.download(PDF_PATH);
  });
});

app.use("/api/v1", MainRouter);

const { PORT } = process.env;

InitDBConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on ${bgGreen(black(`port: ${PORT}`))}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

process.on("exit", function () {
  console.log("server is closed! Goodbye :)");
});
