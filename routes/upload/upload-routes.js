const e = require("express");
const express = require("express");
const uploadController = require("../../controller/upload/upload-controller");

const router = express.Router();

router.get("", (req, res) => {
  return uploadController.getUploadMain(req, res);
});

// 파일 업로드 (POST)
router.post("/:main", (req, res) => {
  uploadController.upload(req, res, function (err) {
    if (err) {
      return res.json({
        ResultCode: 400,
        ResultMessage: err.toString(),
      });
    } else {
      if (req.files === undefined) {
        return res.json({
          ResultCode: 400,
          ResultMessage: "No File Selected to Upload",
        });
      } else {
        return uploadController.postUploadMain(req, res);
      }
      // return uploadController.checkLabFileLocation(req, res);
    }
  });
});

// app.post("/", myFirstMiddleware, secondMiddlewareInTheSequence);

module.exports = router;
