const mongoose = require("mongoose");
const path = require("path");
const autoIncrement = require("mongoose-auto-increment");
const moment = require("moment");
const autoIdSetter = require("./auto-id-setter");
// const AutoIncrementFactory = require("mongoose-sequence");
require("moment-timezone");

moment.tz.setDefault("Asia/Seoul");
const seoulDate = moment().format("YYYY-MM-DD HH:mm:ss");
console.log(`DATE : ${seoulDate}`);

const eegSchema = new mongoose.Schema(
  {
    // eegId: { type: Number, required: true, unique: true },
    eegFileName: { type: String, required: true },
    eegFileLocation: { type: String, required: true },
    eegFileUrl: { type: String, required: true },
    eegAuthor: { type: String, required: true },
    createdAtSeoul: { type: String, required: true },
    updatedAtSeoul: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "EEG",
  }
);
// autoIncrement.initialize(mongoose.connection);
// eegSchema.plugin(autoIncrement.plugin, {
//   model: "EEG",
//   field: "eegId",
//   startAt: 0, //시작
//   increment: 1, // 증가
// });

// module.exports = mongoose.model("EEG", eegSchema);

autoIdSetter(eegSchema, mongoose, "EEG", "eegId");
const EEG = mongoose.model("EEG", eegSchema);
module.exports = EEG;
