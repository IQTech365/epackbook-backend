const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config({ path: "../.env" });

function OTPgenerator() {
  let digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

const sendResponse = (res, docs) => {
  res.send({
    code: 200,
    data: docs,
  });
};

const sendSellerResponse = (res, docs, mutation) => {
  const userData = {
    id: docs._id,
    name: docs.name,
    email: docs.email,
    username: docs.username,
    profileImg: docs.profileImg,
    contact: docs.contact,
    addresses: docs.addresses,
    documents: docs.documents,
    ownerName: docs.ownerName,
    bankDetails: docs.bankDetails,
    organizationName: docs.organizationName,
    sellingSubCats: docs.sellingSubCats,
    rating: docs.rating,
    isVerified: docs.isVerified,
    isBlocked: docs.isBlocked,
    isTncAccepted: docs.isTncAccepted,
    userType: "seller",
  };
  const response = Object.assign(userData, mutation);
  res.send({
    code: 200,
    data: response,
  });
};

const sendUserResponse = (res, docs, mutation) => {
  const userData = {
    id: docs._id,
    name: docs.name,
    email: docs.email,
    profileImg: docs.profileImg,
    phone: docs.phone,
    isVerified: docs.isVerified,
    address: docs.address,
    device: docs.device,
    userType: "user",
  };
  const response = Object.assign(userData, mutation);
  res.send({
    code: 200,
    data: response,
  });
};

const sendAdminResponse = (res, docs, mutation) => {
  const userData = {
    id: docs._id,
    name: docs.name,
    email: docs.email,
  };
  const response = Object.assign(userData, mutation);
  res.send({
    code: 200,
    data: response,
  });
};

const sendErrorResponse = (res, error, message, code) => {
  if (error?.code == 11000) {
    return res.send({
      code: 409,
      error: message,
    });
  }
  res.send({
    code: code || 400,
    error: error?.message || "Error occured",
  });
};

function usernameGenerator(name) {
  const user = name.split(" ")[0];
  var id = user + Math.random().toString(16).slice(10);
  return id;
}

function sendSMS(number, message) {
  axios
    .get(
      `https://sms.textifydigitals.com/vb/apikey.php?apikey=Gw5kMgzPofFbuiNa&senderid=MARTCS&number=${number},&templateid=1207161772222982180&message= ${message}`
    )
    .then((response) => {
      if (response.data.code == "011") {
        console.log("message sent successfully.");
      } else {
        console.log(response.data.code, response.data.status);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = {
  OTPgenerator,
  sendResponse,
  sendSellerResponse,
  sendUserResponse,
  usernameGenerator,
  sendAdminResponse,
  sendErrorResponse,
};
