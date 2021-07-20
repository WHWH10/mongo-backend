const mongoose = require("mongoose");
// const autoIdSetter = require("./auto-id-setter");
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

// autoIdSetter(FileCategorySchema, mongoose, "FileCategory", "fileCategoryId");
// const FileCategorySchema = mongoose.model("FileCategory", FileCategorySchema);
// module.exports = FileCategory;
