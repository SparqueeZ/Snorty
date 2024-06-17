const cors = require("cors");

const checkFrontURL = (FrontURL) => {
  if (!FrontURL) {
    console.error(
      "################ WARNING ! Please check .env files for FRONT_FULL_ADDRESS and ensure MongoDB is running. ################"
    );
  }
  return FrontURL;
};

const allowedOrigins = [checkFrontURL(process.env.FRONT_FULL_ADDRESS)];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = cors(corsOptions);
