// 비정형 데이터 저장
// EEG, fMRI 등
const mongoose = require("mongoose");
const path = require("path");
const autoIncrement = require("mongoose-auto-increment");
// const connection = mongoose.createConnection(process.env.MONGO_URL);
// autoIncrement.initialize(connection);

// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Successfully connexted to mongodb"))
//   .catch((e) => console.log(e));
// mongoose.set("useCreateIndex", true);
// Define Schemes
const etcSchema = new mongoose.Schema(
  {
    etcId: { type: Number, required: true, unique: true },
    etcFileName: { type: String, required: true },
    etcFileLocation: { type: String, required: true },
    etcFileUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
autoIncrement.initialize(mongoose.connection);
etcSchema.plugin(autoIncrement.plugin, {
  model: "EEG",
  field: "etcId",
  startAt: 0, //시작
  increment: 1, // 증가
});

etcSchema.plugin(autoIncrement.plugin, {
  model: "fMRI",
  field: "etcId",
  startAt: 0, //시작
  increment: 1, // 증가
});

// Create Model & Export
// const EEG = (module.exports = mongoose.model("EEG", etcSchema));
const fMRI = mongoose.model("fMRI", etcSchema);
const EEG = mongoose.model("EEG", etcSchema);

module.exports = {
  fMRI: fMRI,
  EEG: EEG,
};
// module.exports = mongoose.model("fMRI", etcSchema);
// module.exports = mongoose.model("EEG", etcSchema);
