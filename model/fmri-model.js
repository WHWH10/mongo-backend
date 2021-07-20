const mongoose = require("mongoose");
const autoIdSetter = require("./auto-id-setter");
const fMriSchema = new mongoose.Schema(
  {
    // fMriId: { type: Number, required: true, unique: true },
    fMriFileName: { type: String, required: true },
    fMriFileLocation: { type: String, required: true },
    fMriFileUrl: { type: String, required: true },
    fMriAuthor: { type: String, required: true },
    createdAtSeoul: { type: String, required: true },
    updatedAtSeoul: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "fMRI",
  }
);

autoIdSetter(fMriSchema, mongoose, "fMRI", "fMriId");
const fMRI = mongoose.model("fMRI", fMriSchema);
module.exports = fMRI;

// module.exports = mongoose.model("fMRI", fMriSchema);
