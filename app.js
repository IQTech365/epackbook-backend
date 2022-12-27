require("dotenv").config({ path: "./Config/.env" });
const express = require("express");
const { v4 } = require("uuid");
const { morganChalkMiddleware } = require("./Middlewares");
const app = express();
const cors = require("cors");
const { bgGreen, black } = require("chalk");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const InitDBConnection = require("./Connection");
const { AuthRouter } = require("./Router");

app.use(cors());

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

app.disable("etag");
app.disable("x-powered-by");

app.post("/upload", uploadFiles, async (req, res) => {
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
  res.send("v.2.1");
});

app.use(morganChalkMiddleware());
app.use(express.json());

app.use("/auth", AuthRouter);
// app.use("/v1", CommonRouter);

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
