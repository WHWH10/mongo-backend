const mongoose = require("mongoose");
const autoIdSetter = require("../auto-id-setter");
const moment = require("moment");
require("moment-timezone");

moment.tz.setDefault("Asia/Seoul");
const seoulDate = moment().format("YYYY-MM-DD HH:mm:ss");

// 정형 데이터 관련 내용 (업로드 내용)
const FileCategorySchema = new mongoose.Schema({
  labName: { type: String, required: true },
  dataContent: { type: Object },
  created_at: { type: String, required: true, default: seoulDate },
  updated_at: { type: String, required: true, default: seoulDate },
});

autoIdSetter(FileCategorySchema, mongoose, "FileCategory", "fileCategoryId");
const FileCategory = mongoose.model("FileCategory", FileCategorySchema);

// Object Storage 관련 내용 (정형데이터도 원본파일은 저장해둔다)
const ObjectStorageSchema = new mongoose.Schema({
  objectStorageUrl: { type: String },
  objectStorageKey: { type: String },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true },
});

autoIdSetter(ObjectStorageSchema, mongoose, "ObjectStorage", "objectStorageId");
const ObjectStorage = mongoose.model("ObjectStorage", ObjectStorageSchema);
