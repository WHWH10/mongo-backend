const express = require("express");
const uploadApiController = require("../../controller/upload-api/upload-api-controller");

const router = express.Router();

router.get("", (req, res) => {
  try {
    return res.json({
      ResultCode: 200,
      ResultMessage: "Success",
    });
  } catch (err) {
    return res.json({
      ResultCode: 500,
      ResultMessage: err.message,
    });
  }
});

// 랩실 별 HeartRate 테이블 조회
router.get("/heartRate/:labName", (req, res) => {
  try {
    return uploadApiController.getHeartRate(req, res);
  } catch (err) {
    return res.json({
      ResultCode: 500,
      ResultMessage: err.message,
    });
  }
});

router.post("/heartRate/:labName", uploadApiController.upload, (req, res) => {
  try {
    return uploadApiController.postHeartRate(req, res);
  } catch (err) {
    return res.json({
      ResultCode: 500,
      ResultMessage: err.message,
    });
  }
});

module.exports = router;
