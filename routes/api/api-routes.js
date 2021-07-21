const express = require("express");
const mongoose = require("mongoose");
const { LabCA } = require("../../model/labCA/lab-ca-model");
const moment = require("moment");
require("moment-timezone");

moment.tz.setDefault("Asia/Seoul");
const seoulDate = moment().format("YYYY-MM-DD HH:mm:ss");

const router = express.Router();

router.get("/fMri", async (req, res) => {
  try {
    const labCA = await LabCA.find({});
    return res.json({
      ResultCode: 200,
      ResultMessage: labCA,
    });
  } catch (err) {
    return res.json({
      ResultCode: 500,
      ResultMessage: err.toString(),
    });
  }
});

//https://stackoverflow.com/questions/34576659/nodejs-express-encodes-the-url-how-to-decode
router.get("/fMri/:fileName", async (req, res) => {
  console.log(encodeURIComponent(req.params.fileName));
  const encodeParam = encodeURIComponent(req.params.fileName);
  const fileName = decodeURIComponent(encodeParam);
  console.log(encodeParam);
  console.log(`decode ? ${decodeURIComponent(encodeParam)}`);
  //   const fileName = decodeURIComponent(encodeParam);
  //   res.send(fileName);
  //   res.send(fileName);

  try {
    const labCA = await LabCA.findOne({ fileName: fileName });
    // if (!mongoose.isValidObjectId(fileName))
    //   return res.status(400).send({ err: "Invalid fileName" });
    return res.send({ labCA });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
  res.json({
    ResultCode: 200,
    ResultMessage: fileName,
  });
});

router.put("/fMri/:fileName", async (req, res) => {
  try {
    const encodeParam = encodeURIComponent(req.params.fileName);
    const fileName = decodeURIComponent(encodeParam);
    console.log(`fileName : ${fileName}`);
    const { author } = req.body;
    if (!author) return res.status(400).send({ err: " author is required" });
    console.log(typeof author);
    const labCA = await LabCA.findOneAndUpdate(
      { fileName: fileName },
      //   { author },
      { $set: { author: author, updated_at: seoulDate } },
      //   { $set: { author } },
      { new: true }
    );
    return res.send({ labCA });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});
module.exports = router;
