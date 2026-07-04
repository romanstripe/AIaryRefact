const mongoose = require("mongoose");
require("../models/User");
const Diary = require("../models/Diary");
const { kstDateKey, kstDateKeyMinusDays } = require("../utils/kst-utils");
const { correctDiary, generateDiaryComment } = require("../services/chatGPT");
const isValidDiaryDate = require("../utils/isValidDiaryDate");

const PAGE_SIZE = 9; // 상의 후 변경

const diaryController = {};

diaryController.createDiary = async (req, res) => {
  const { userId } = req;
  const { title, content, image, isPublic, date } = req.body || {};

  try {
    if (!isValidDiaryDate(date))
      throw new Error("작성 가능한 날짜는 오늘 기준 -2일부터 오늘까지 입니다.");

    const sentences = content.split(/[\n.?!]+/).filter((s) => s.trim() !== "");

    const corrections = await Promise.all(
      sentences.map(async (sentence) => {
        const result = await correctDiary(sentence);
        return {
          originalSentence: sentence,
          correctedSentence: result?.correctedSentence || sentence,
          reason: result?.reason || "No corrections needed",
          similarExpressions: result?.similarExpressions || [],
          extraExamples: result?.extraExamples || [],
        };
      })
    );

    const commentObj = await generateDiaryComment(content);
    const commentText = commentObj.commentText;

    const diary = new Diary({
      userId,
      title,
      content,
      image,
      isPublic,
      date,
      corrections,
      comment: commentText,
    });

    const savedDiary = await diary.save();
    return res.status(200).json({ status: "success", data: savedDiary });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

// 전체 일기들 가져오기 (Read)
diaryController.getAllDiaries = async (req, res) => {
  try {
    const { lastId } = req.query;
    const filter = { isPublic: true };

    const raw = typeof lastId === "string" ? lastId.trim() : lastId;
    if (raw) {
      if (!mongoose.isValidObjectId(raw)) {
        throw new Error("유효한 lastId가 아닙니다.");
      }
      filter._id = { $lt: mongoose.Types.ObjectId.createFromHexString(raw) };
    }

    const items = await Diary.find(filter)
      .select("_id title content image date dateKey createdAt userId") // 필요한 필드만 가져오기
      .sort({ _id: -1 })
      .limit(PAGE_SIZE + 1)
      .populate({ path: "userId", select: "name profile -_id" })
      .lean({ virtuals: true });

    const hasNextPage = items.length > PAGE_SIZE;
    const sliced = hasNextPage ? items.slice(0, PAGE_SIZE) : items;
    const nextLastId = hasNextPage
      ? String(sliced[sliced.length - 1]._id)
      : null;

    const diaries = sliced.map((d) => ({
      _id: d._id,
      title: d.title,
      content: d.content,
      image: d.image,
      createdAt: d.createdAt,
      dateKey: d.dateKey,
      date: d.date,
      author: {
        name: d.userId?.name ?? null,
        profile: d.userId?.profile ?? null,
      },
    }));

    res.status(200).json({
      status: "success",
      pageSize: PAGE_SIZE,
      isFirstPage: !raw,
      hasNextPage,
      nextLastId,
      count: diaries.length,
      diaries,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// 특정 사용자의 일기들을 월 단위로 가져오기 (Read)
diaryController.getUserDiariesByMonth = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      throw new Error("권한이 없습니다.");
    }

    // 프론트에서 쿼리에 year, month를 넣어줘야 함
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    const validYear = Number.isInteger(year) && year >= 1970 && year <= 2100;
    const validMonth = Number.isInteger(month) && month >= 1 && month <= 12;

    if (!validYear || !validMonth)
      throw new Error("유효한 연도 또는 날짜가 아닙니다.");

    const yearAndMonth = `${year}-${String(month).padStart(2, "0")}`;
    const nextYearAndMonth =
      month === 12
        ? `${year + 1}-01`
        : `${year}-${String(month + 1).padStart(2, "0")}`;
    const startKey = `${yearAndMonth}-01`;
    const endKey = `${nextYearAndMonth}-01`;

    // DB에서 특정 달의 특정 사용자의 일기만 추출
    const rows = await Diary.find({
      userId,
      dateKey: { $gte: startKey, $lt: endKey }, // startKey 이상 endKey 미만
    })
      .select("_id dateKey")
      .lean();

    // 빠른 조회를 위한 맵 구성
    // Map의 키: dateKey(YYYY-MM-DD), 값: _id
    const map = new Map(rows.map((r) => [r.dateKey, String(r._id)]));

    // 달의 모든 날짜 만들기
    const daysInMonth = new Date(year, month, 0).getDate(); // 해당 달의 총 일수
    const today = kstDateKey(); // 오늘
    const yesterday = kstDateKeyMinusDays(1); // 어제
    const beforeYesterday = kstDateKeyMinusDays(2); // 그제

    // 달력에 뿌릴 days 배열 만들기
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const day = String(i + 1).padStart(2, "0");
      const dk = `${yearAndMonth}-${day}`;
      return {
        date: dk,
        id: map.get(dk) ?? null,
        canWrite: dk === today || dk === yesterday || dk === beforeYesterday,
      };
    });

    return res.status(200).json({ status: "success", year, month, days });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// 특정 사용자의 특정 날짜 일기 가져오기 (Read)
diaryController.getUserDiaryByDate = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      throw new Error("권한이 없습니다.");
    }

    const { date } = req.query; // 프론트에서 쿼리에 "YYYY-MM-DD" 형식으로 날짜를 줘야 함
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(
        "유효한 날짜 형식이 아닙니다. 'YYYY-MM-DD' 형식으로 입력해 주세요."
      );
    }

    const doc = await Diary.findOne({ userId, dateKey: date })
      .select(
        "_id title content image isPublic date dateKey createdAt updatedAt comment corrections"
      )
      .lean();

    // doc가 있으면 상세 모달/페이지로 보여주고, 없으면 "새 일기 작성" UI로 전환함
    return res.status(200).json({
      status: "success",
      found: !!doc,
      data: doc ?? null,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

diaryController.updateDiary = async (req, res) => {
  try {
    const { userId } = req;
    const diaryId = req.params.id;
    const { title, content, image, isPublic } = req.body;

    const diary = await Diary.findById(diaryId);
    if (!diary) throw new Error("Diary not found");

    if (!diary.userId.equals(userId))
      throw new Error("You aren't authorized to update");

    const ONE_DAY = 24 * 60 * 60 * 1000; // 24시간(ms)

    if (Date.now() - diary.createdAt.getTime() > ONE_DAY)
      throw new Error("You can only update within 1 day of creation");

    let corrections = diary.corrections;

    if (content && content !== diary.content) {
      const sentences = content
        .split(/[\n.?!]+/)
        .filter((s) => s.trim() !== "");

      const newCorrections = await Promise.all(
        sentences.map(async (sentence) => {
          const result = await correctDiary(sentence);
          return {
            originalSentence: sentence,
            correctedSentence: result?.correctedSentence || sentence,
            reason: result?.reason || "No corrections needed",
            similarExpressions: result?.similarExpressions || [],
            extraExamples: result?.extraExamples || [],
          };
        })
      );

      const commentObj = await generateDiaryComment(content);
      const commentText = commentObj.commentText;

      diary.corrections = newCorrections;
      diary.comment = commentText;
    }

    diary.title = title ?? diary.title;
    diary.content = content ?? diary.content;
    diary.image = image ?? diary.image;
    diary.isPublic = isPublic ?? diary.isPublic;

    await diary.save();

    return res.status(200).json({ status: "success", data: diary });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

diaryController.updatePublishedDiary = async (req, res) => {
  try {
    const { userId } = req;
    const diaryId = req.params.id;
    const { isPublic } = req.body;

    const diary = await Diary.findById(diaryId);
    if (!diary) throw new Error("Diary not found");

    if (diary.userId.toString() !== userId)
      throw new Error("You aren't authorized to update");

    const updatedDiary = await Diary.findByIdAndUpdate(
      { _id: diaryId },
      { isPublic },
      { new: true }
    );

    return res.status(200).json({ status: "success", data: updatedDiary });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

diaryController.deleteDiary = async (req, res) => {
  try {
    const { userId } = req;
    const diaryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(diaryId))
      throw new Error("Invalid diary ID");

    const diary = await Diary.findById(diaryId);
    if (!diary) throw new Error("Diary not found");

    if (diary.userId.toString() !== userId)
      throw new Error("You aren't authorized to delete");

    const deletedDiary = await Diary.findByIdAndDelete(diaryId);

    return res.status(200).json({ status: "success", data: deletedDiary });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports = diaryController;
