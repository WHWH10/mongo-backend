const logger = require("../../config/customLogger");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const savedbController = require("../savedb/savedb-controller");
const moment = require("moment");
require("moment-timezone");

moment.tz.setDefault("Asia/Seoul");
const seoulDate = moment().format("YYYY-MM-DD");

if (process.env.NODE_ENV === "production") {
  require("dotenv").config({ path: path.join(__dirname, "./.env") });
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

const getUploadMain = (req, res) => {
  try {
    return res.json({
      ResultCode: 200,
      ResultMessage: "Success to Upload Main GET",
    });
  } catch (err) {
    return res.json({
      ResultCode: 400,
      ResultMessage: err.toString(),
    });
  }
};

const postUploadMain = (req, res) => {
  let location = makeLocation(req);
  const main = req.params.main;
  const sub = req.query.sub;
  const data = req.query.data;
  const labName = req.query.labName;
  const author = req.query.author;
  const files = req.files;
  let resultParams = [];

  console.log(`?? ${encodeURIComponent(files[0].originalname)}`);
  console.log(`!! ${decodeURIComponent(files[0].originalname)}`);

  try {
    let uploadFiles = files.map((item) => {
      //https://calatheas.tistory.com/entry/aws-s3-%EB%A9%94%ED%83%80%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0
      let params = {
        Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
        Key: location + seoulDate + "_" + decodeURI(item.originalname),
        // Key: location + seoulDate + "_" + item.originalname,
        Body: item.buffer,
        ACL: "public-read",
      };
      //   resultParams.push(params);
      //   console.log(item.mimetype);
      return uploadObjectStorage(params)
        .then((result) => {
          console.log(params);
          //   savedbController.checkFileType(params, result);
          if (main == "lab") {
            if (data == "d01") {
              savedbController.savefMriFile(
                params,
                result,
                item.originalname,
                author,
                main,
                sub,
                labName
              );
            } else if (data == "d02") {
              savedbController.saveEEGFile(params, result);
            } else if (data == "d03") {
              savedbController.saveMultiModalFile(params, result);
            } else if (data == "d04") {
              savedbController.saveMobileFile(params, result);
            } else if (data == "d05") {
              savedbController.saveSurveyFile(params, result);
            } else if (data == "d06") {
              savedbController.saveSelfServeyFile(params, result);
            } else {
              savedbController.saveEtcFile(params, result);
            }
          } else {
            console.log("clinic");
          }
          return result;
        })
        .catch((err) => {
          return res.json({
            ResultCode: 400,
            ResultMessage: err.toString(),
          });
        });
    });

    Promise.all(uploadFiles).then((result) => {
      // 성공하면 몽고디비에 저장

      return res.json({
        ResultCode: 200,
        ResultMessage: result,
      });
    });
    //   .catch(function (err) {
    //     return res.json({
    //       ResultCode: 400,
    //       ResultMessage: err.toString(),
    //     });
    //   });
  } catch (err) {
    return res.json({
      ResultCode: 400,
      ResultMessage: err.toString(),
    });
  }
};

// Object Storage 저장할 파일 위치 셋팅
const makeLocation = (req) => {
  const main = req.params.main;
  const sub = req.query.sub;
  const data = req.query.data;
  const labName = req.query.labName;

  // fMri/EEG/MultiModal/모바일/설문/자가진단
  //  d01/d02/d03      /d04/d05/d06/
  switch (data) {
    case "d01":
      return `${main}/${sub.toString().toUpperCase()}/fMri/${labName}/`;
    case "d02":
      return `${main}/${sub.toString().toUpperCase()}/EEG/${labName}/`;
    case "d03":
      return `${main}/${sub.toString().toUpperCase()}/MultiModal/${labName}/`;
    case "d04":
      return `${main}/${sub.toString().toUpperCase()}/모바일/${labName}/`;
    case "d05":
      return `${main}/${sub.toString().toUpperCase()}/설문/${labName}/`;
    case "d06":
      return `${main}/${sub.toString().toUpperCase()}/자가진단/${labName}/`;
    default:
      return `${main}/${sub.toString().toUpperCase()}/ETC/${labName}/`;
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

module.exports = { upload, getUploadMain, postUploadMain };
