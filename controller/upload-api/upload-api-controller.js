const mongoose = require("mongoose");
const { HeartRate } = require("../../model/structured-data/heartrate-model");
const mongoController = require("../savedb/mongo-controller");
const path = require("path");
const AWS = require("aws-sdk");
const multer = require("multer");
const moment = require("moment");
require("moment-timezone");

moment.tz.setDefault("Asia/Seoul");
const seoulDate = moment().format("YYYY-MM-DD HH:mm:ss");

if (process.env.NODE_ENV === "production") {
  require("dotenv").config({ path: path.join(__dirname, "../../.env") });
  console.log("production mode");
  console.log(process.env.PORT);
} else {
  // dotenv.config({ path: path.join('/env', './local.env')});
  require("dotenv").config({ path: path.join(__dirname, "../../.env.dev") });
}

const s3 = new AWS.S3({
  endpoint: process.env.NAVER_CLOUD_END_POINT,
  region: "kr-standard",
  credentials: {
    accessKeyId: process.env.NAVER_CLOUD_ACCESS_KEY_ID,
    secretAccessKey: process.env.NAVER_CLOUD_SECRET_KEY,
  },
});

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

const upload = multer({ storage: storage }).array("files", 10);

const getHeartRate = async (req, res) => {
  const labName = req.params.labName;
  //   const heartRate = await HeartRate.findOne({ labName: labName });
};

const postHeartRate = async (req, res) => {
  const files = req.files;
  const author = req.query.author;
  const labName = req.params.labName;

  try {
    let uploadFiles = files.map((item) => {
      let params = {
        Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
        Key:
          "HeartRate/" +
          labName +
          "/" +
          seoulDate +
          "/" +
          decodeURI(item.originalname),
        // Key: location + seoulDate + "_" + item.originalname,
        Body: item.buffer,
        ACL: "public-read",
      };

      //   console.log(`Params : ${params}`);
      return uploadObjectStorage(params).then((result) => {
        mongoController.saveHeartRate(params, result, author, labName);
        return result;
      });
    });
    Promise.all(uploadFiles).then((result) => {
      return res.json({
        ResultCode: 200,
        ResultMessage: result,
      });
    });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
};

function uploadObjectStorage(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = {
  getHeartRate,
  postHeartRate,
  upload,
};
