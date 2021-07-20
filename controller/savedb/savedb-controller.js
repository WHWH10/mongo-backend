const mongoose = require("mongoose");
const {
  LabCA,
  FileCategory,
  ObjectStorage,
} = require("../../model/labCA/lab-ca-model");
const moment = require("moment");
require("moment-timezone");

moment.tz.setDefault("Asia/Seoul");
const seoulDate = moment().format("YYYY-MM-DD HH:mm:ss");

const checkFileType = (params, result) => {
  console.log(`??? ${params.Key}`);
};

//https://dalkomit.tistory.com/120
//https://stackoverflow.com/questions/43534461/array-of-subdocuments-in-mongoose
//비정형데이터
const savefMriFile = (
  params,
  result,
  originalname,
  author,
  main,
  sub,
  labName
) => {
  console.log(`fMRI DATA)`);

  const labCA = new LabCA({
    fileName: originalname,
    author: author,
    created_at: seoulDate,
    updated_at: seoulDate,
    fileCategory: [
      new FileCategory({
        mainCategory: main,
        subCategory: sub,
        dataCategory: "fMri",
        labName: labName.toString().toUpperCase(),
        created_at: seoulDate,
        updated_at: seoulDate,
      }),
    ],
    objectStorage: [
      new ObjectStorage({
        objectStorageUrl: result.Location,
        objectStorageKey: result.Key,
        created_at: seoulDate,
        updated_at: seoulDate,
      }),
    ],
  });

  labCA.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("success");
    }
  });
};

const saveEEGFile = () => {
  console.log(`EEG DATA`);
};

const saveMultiModalFile = () => {
  console.log(`MultiModal`);
};

const saveMobileFile = () => {
  console.log(`MOBILE`);
};

const saveSurveyFile = () => {
  console.log(`Survey`);
};

const saveSelfServeyFile = () => {
  console.log("selfServey");
};

const saveEtcFile = (params, result) => {
  console.log("EtcFile");
};

module.exports = {
  checkFileType,
  savefMriFile,
  saveEEGFile,
  saveMultiModalFile,
  saveMobileFile,
  saveSurveyFile,
  saveSelfServeyFile,
  saveEtcFile,
};
