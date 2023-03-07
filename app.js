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
// app.use(helmet());
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
  const TEMPLATES = require("./Models/Templates");
  const ENQUIRIES = require("./Models/Enquiries");
  const QUOTATIONS = require("./Models/Quotations");
  const mongoose = require("mongoose");

  const { enquiryId, quotationId } = req.query;
  // const clientId = "640088f310f31ff6eb40039a";
  // const companyId = req.user;

  const enquiry = await ENQUIRIES.findById(enquiryId).populate("client").lean();

  if (!enquiry) {
    return res.send({
      code: 404,
      error: "Client Not Found",
    });
  }

  const client = enquiry.client;
  const quotation = await QUOTATIONS.findById(quotationId).lean();

  if (!quotation) {
    return res.send({
      code: 404,
      error: "Quotation Not Found",
    });
  }

  const template = await TEMPLATES.findOne({
    _id: mongoose.Types.ObjectId(quotation.template),
  });

  if (!template) {
    return res.send({
      code: 404,
      error: "Quotation Not Found",
    });
  }

  const compiled = ejs.compile(template.templateHTML, {
    compileDebug: true,
  });

  const data = {
    company_name: client.company.name,
    company_phone: `${client.phone.primary.cc}${client.phone.primary.number}`,
    company_mobile:
      client.phone.alternates.length > 0
        ? `${client.phone.alternates[0].cc}${client.phone.alternates[0].number}`
        : "",
    company_Logo: client.company.logo,
    company_email: client.email,
    company_GSTIN: client.documents.gst,
    quotation_number: quotation.quotation.number,
    clientcompany_name: enquiry.companyName,
    contact_person: enquiry.contactPerson,
    contact_number: enquiry.mobile,
    client_address: JSON.stringify(enquiry.pickupAddress),
    client_mail: enquiry.email,
    shifting_date: new Date(enquiry.shiftingDate).toLocaleDateString(),
    shifting_type: enquiry.shiftingType,
    shifting_luggage: enquiry.shiftingLuggage
      ? enquiry.shiftingLuggage.join(",")
      : "",
    shifting_from: enquiry.pickupAddress?.shiftingFrom,
    shifting_to: enquiry.dropAddress?.shiftingTo,
    company_terms: client.company?.tnc,
  };

  const html = compiled({
    data,
  });

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
