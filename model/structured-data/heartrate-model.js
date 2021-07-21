const mongoose = require("mongoose");
const autoIdSetter = require("../auto-id-setter");
const Schema = mongoose.Schema;
// const { StorageSchema } = require("../common/storage-model").schema;
// const Storage = require("../common/storage-model");

const moment = require("moment");
require("moment-timezone");

moment.tz.setDefault("Asia/Seoul");
const seoulDate = moment().format("YYYY-MM-DD HH:mm:ss");

// 심장 박동수 관련 테이블
const HeartRateDataSchema = new mongoose.Schema({
  //년원일
  measure_time_YY: { type: String },
  //시분초
  measure_time_HH: { type: String },
  //맥박 측정 부위
  measure_part: { type: String },
  //상태 ID
  status_ID: { type: String, required: true },
  // 심박수 (회/분)
  heart_rate: { type: String, required: true },
  // 정확도
  accuracy: { type: String, required: true },
  // 입력시간
  // created_at: { type: String },
  // // 수정시간
  // updated_at: { type: String },
});

autoIdSetter(HeartRateDataSchema, mongoose, "HeartRateData", "heartRateDataId");
const HeartRateData = mongoose.model("HeartRateData", HeartRateDataSchema);

// Object Storage 관련 내용 (정형데이터도 원본파일은 저장해둔다)
// const ObjectStorageSchema = new mongoose.Schema({
//   objectStorageUrl: { type: String },
//   objectStorageKey: { type: String },
//   created_at: { type: String, required: true, default: seoulDate },
//   updated_at: { type: String, required: true, default: seoulDate },
// });

// // autoIdSetter(ObjectStorageSchema, mongoose, "ObjectStorage", "objectStorageId");
// const ObjectStorage = mongoose.model("ObjectStorage", ObjectStorageSchema);

const HeartRateSchema = new mongoose.Schema({
  fileName: { type: String, required: true, unique: true },
  labName: { type: String, required: true },
  author: { type: String, required: true },
  objectStorageUrl: [{ type: String }],
  objectStorageKey: [{ type: String }],
  heartRateData: [HeartRateDataSchema],
  //   objectStorage: [Storage],
  //   objectStorage: [StorageSchema],
  //   objectStorage: [{ type: Schema.Types.ObjectId, ref: "Storage" }],
  created_at: { type: String, required: true, default: seoulDate },
  updated_at: { type: String, required: true, default: seoulDate },
});

autoIdSetter(HeartRateSchema, mongoose, "HeartRate", "heartRateId");
const HeartRate = mongoose.model("HeartRate", HeartRateSchema);

module.exports = {
  HeartRate,
  HeartRateData,
};
