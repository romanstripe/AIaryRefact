const mongoose = require("mongoose");
require("../models/Diary");
const { generateVocabMeaning } = require("../services/chatGPT");
const VocaBook = require("../models/Vocabook");
const Vocabook = require("../models/Vocabook");

const vocabController = {};

vocabController.createWord = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      throw new Error("권한이 없습니다.");
    }

    const { vocab } = req.body;
    if (!vocab) throw new Error("선택된 단어가 존재하지 않습니다.");

    const vocabObj = await generateVocabMeaning(vocab);
    const vocabOriginal = vocabObj.word;
    const vocabMeaning = vocabObj.meaning;
    const vocabExample = vocabObj.example;

    const newVoca = new Vocabook({
      userId,
      word: vocabOriginal,
      meaning: vocabMeaning,
      example: vocabExample,
      status: "learning",
    });

    const savedVocab = await newVoca.save();
    return res.status(200).json({ status: "success", vocab: savedVocab });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: "fail",
        message: "이미 단어장에 추가된 단어입니다.",
      });
    }
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

vocabController.getAllWords = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      throw new Error("권한이 없습니다.");
    }

    const vocabList = await VocaBook.find({
      userId: userId,
    }).sort({ createdAt: -1 });
    return res.status(200).json({ status: "success", vocabList: vocabList });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

vocabController.toggleStatus = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      throw new Error("권한이 없습니다.");
    }

    const vocab = await VocaBook.findOne({
      _id: req.params.id,
      userId: userId,
    });
    if (!vocab) throw new Error("선택된 단어가 존재하지 않습니다.");

    vocab.status = vocab.status === "learning" ? "mastered" : "learning";
    await vocab.save();

    return res.status(200).json({ status: "success", vocab: vocab });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

vocabController.deleteWord = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      throw new Error("권한이 없습니다.");
    }

    const vocab = await VocaBook.findOneAndDelete(
      { _id: req.params.id, userId: userId },
      { new: true }
    );
    if (!vocab) throw new Error("선택된 단어가 존재하지 않습니다.");

    return res.status(200).json({ status: "success", id: vocab._id });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports = vocabController;
