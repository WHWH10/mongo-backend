const express = require("express");
const directoryController = require("../../controller/directory/dircetory-controller");

const router = express.Router();

// upload 메인
router.get("", (req, res) => {
  return directoryController.getMainCategory(req, res);
});

// 랩별 카테고리 구분(PA/CA)
router.get("/lab", (req, res) => {
  return directoryController.getLabCategory(req, res);
});

// 랩별 카테고리 -- Sub Category(fMRI, EEG, 자가진단, 설문, 등)
router.get("/lab/:category", (req, res) => {
  return directoryController.getLabSubCategory(req, res);
});

// 랩별 Sub category에 있는 파일 조회
router.get("/lab/:category/:subcategory", (req, res) => {
  return directoryController.getSubCategoryDepth(req, res);
});

// 카테고림별 랩실 파일을 확인
router.get("/lab/:category/:subcategory/:labName", (req, res) => {
  return directoryController.getLabFile(req, res);
});

// 클리닉 업로드
router.get("/clinic", (req, res) => {
  return directoryController.getClinicCategory(req, res);
});

router.post("", (req, res) => {});

module.exports = router;
