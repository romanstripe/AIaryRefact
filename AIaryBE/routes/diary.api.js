const express = require("express");
const diaryController = require("../controllers/diary.controller");
const authController = require("../controllers/auth.controller");
const router = express.Router();

router.post("/", authController.authenticate, diaryController.createDiary);
router.get("/", diaryController.getAllDiaries);
router.get(
  "/my/month",
  authController.authenticate,
  diaryController.getUserDiariesByMonth
);
router.get(
  "/my/date",
  authController.authenticate,
  diaryController.getUserDiaryByDate
);
router.put("/:id", authController.authenticate, diaryController.updateDiary);
router.put(
  "/published/:id",
  authController.authenticate,
  diaryController.updatePublishedDiary
);
router.delete("/:id", authController.authenticate, diaryController.deleteDiary);

module.exports = router;
