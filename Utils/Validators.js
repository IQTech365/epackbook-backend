const { body, param } = require("express-validator");

// Auth
const LoginValidator = [body("phone").exists(), body("role").exists()];

const VerifyOtpValidator = [
  body("phone").exists(),
  body("otp").exists(),
  body("role").exists(),
];

const SellerRegisterValidator = [
  body("profileImg").optional(),
  body("email").exists(),
  body("password").exists(),
  body("ownerName").exists(),
  body("organizationName").exists(),
  body("contact.phone.cc").exists().isNumeric(),
  body("contact.phone.number")
    .exists()
    .isNumeric()
    .isLength({ min: 10, max: 10 }),
  body("addresses")
    .exists()
    .isArray({ min: 1 })
    .withMessage("atleast one address is required"),

  body("addresses.*.street").exists(),
  body("addresses.*.country").exists(),
  body("addresses.*.state").exists(),
  body("addresses.*.district").exists(),
  body("addresses.*.postalCode").exists().isLength({ min: 6 }),
  body("addresses.*.location.coordinates.lat").exists(),
  body("addresses.*.location.coordinates.long").exists(),
  body("products_selling_categories")
    .exists()
    .isArray({ min: 1 })
    .withMessage("atleast one product category is required"),

  body("documents")
    .exists()
    .isArray({ min: 1 })
    .withMessage("Pan Card and Adhaar Number is required"),
  body("documents.*.doc_type").exists(),
  body("documents.*.doc_number").exists(),

  body("bankDetails").exists(),
  body("bankDetails.ifsc").exists(),
  body("bankDetails.bankName").exists(),
  body("bankDetails.accountNumber").exists(),
  body("bankDetails.accountHolderName").exists(),
  body("isTncAccepted").exists().isBoolean(),
];

const SellerLoginValidator = [
  body("username").exists(),
  body("password").exists(),
];

// Sellers
const CreateProductValidator = [
  body("subCategories").exists(),
  body("categories").exists(),
  body("details").exists(),
  body("price").exists(),
  body("title").exists(),
];

const UpdateSellerProfileValidator = [body("name").optional()];

// admin
const CreateCountryValidator = [
  body("country").exists(),
  body("countryCode").exists(),
];

const CreateStateValidator = [
  param("countryName").exists(),
  body("state").exists(),
];

const CreateDistrictValidator = [
  param("countryName").exists(),
  param("stateName").exists(),
  body("district").exists(),
];

const CreatePostalCodeValidator = [
  param("countryName").exists(),
  param("stateName").exists(),
  param("districtName").exists(),
];

module.exports = {
  LoginValidator,
  VerifyOtpValidator,
  SellerRegisterValidator,
  SellerLoginValidator,
  CreateProductValidator,
  UpdateSellerProfileValidator,

  //   admins
  CreateCountryValidator,
  CreateStateValidator,
  CreateDistrictValidator,
  CreatePostalCodeValidator,
};
