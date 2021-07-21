const mongoose = require("mongoose");
const autoIdSetter = require("../auto-id-setter");

const StorageSchema = new mongoose.Schema({
  // _id: Schema.Types.ObjectId,
  objectStorageUrl: { type: String },
  objectStorageKey: { type: String },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true },
});

autoIdSetter(StorageSchema, mongoose, "Storage", "storageId");
const Storage = mongoose.model("Storage", StorageSchema);
module.exports = Storage;
