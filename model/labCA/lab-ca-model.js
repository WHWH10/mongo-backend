const mongoose = require("mongoose");
const autoIdSetter = require("../auto-id-setter");
// const FileCategory = require("./file-category-model");
// const ObjectStorage = require("./objectstorage-model");
const moment = require("moment");
require("moment-timezone");

moment.tz.setDefault("Asia/Seoul");
const seoulDate = moment().format("YYYY-MM-DD HH:mm:ss");

const FileCategorySchema = new mongoose.Schema({
  mainCategory: { type: String, required: true },
  subCategory: { type: String, required: true },
  dataCategory: { type: String, required: true },
  labName: { type: String, required: true },
  dataContent: { type: Object, required: false },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true },
});

autoIdSetter(FileCategorySchema, mongoose, "FileCategory", "fileCategoryId");
const FileCategory = mongoose.model("FileCategory", FileCategorySchema);

const ObjectStorageSchema = new mongoose.Schema({
  objectStorageUrl: { type: String },
  objectStorageKey: { type: String },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true },
});

autoIdSetter(ObjectStorageSchema, mongoose, "ObjectStorage", "objectStorageId");
const ObjectStorage = mongoose.model("ObjectStorage", ObjectStorageSchema);
// const ObjectStorage = mongoose.model("ObjectStorage", ObjectStorageSchema);

const LabCaSchema = new mongoose.Schema({
  fileName: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true },
  fileCategory: [FileCategorySchema],
  objectStorage: [ObjectStorageSchema],
});

autoIdSetter(LabCaSchema, mongoose, "LabCA", "labCaId");
// autoIdSetter(ObejctStorageSchema, mongoose, "ObjectStorage", "objectSotrageId");
const LabCA = mongoose.model("LabCA", LabCaSchema);
// module.exports = LabCA;
module.exports = {
  LabCA,
  FileCategory,
  ObjectStorage,
};
