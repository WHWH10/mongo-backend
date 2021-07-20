const mongoose = require("mongoose");
// const autoIdSetter = require("./auto-id-setter");
const moment = require("moment");
require("moment-timezone");

moment.tz.setDefault("Asia/Seoul");
const seoulDate = moment().format("YYYY-MM-DD HH:mm:ss");

// Sub Document 만들기
//https://velog.io/@_uchanlee/mongoose-2%EB%8B%A8-SubDocument-%EC%82%AC%EC%9A%A9%EB%B2%95with-koa
const ObjectStorageSchema = new mongoose.Schema({
  objectStorageUrl: { type: String },
  objectStorageKey: { type: String },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true },
});

// autoIdSetter(ObejctStorageSchema, mongoose, "ObjectStorage", "objectSotrageId");
// const ObjectStorageSchema = mongoose.model(
//   "ObjectStorage",
//   ObjectStorageSchema
// );
// module.exports = ObjectStorage;
