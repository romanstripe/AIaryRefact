const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { toKstYmd } = require("../utils/kst-utils");

const correctionSchema = new Schema({
  originalSentence: { type: String, required: true },
  correctedSentence: { type: String, required: true },
  reason: { type: String, required: true },
  similarExpressions: [{ type: String }],
  extraExamples: [{ type: String }],
});

const diarySchema = new Schema(
  {
    userId: { type: mongoose.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    isPublic: { type: Boolean, default: true },
    corrections: [correctionSchema],
    // 원본 시간 (UTC 타임스탬프 - 정렬/집계/범위용)
    date: { type: Date, required: true, immutable: true },
    // "YYYY-MM-DD" (현지 날짜(KST) - 달력/인덱스 정책용 현지 날짜 문자열)
    dateKey: {
      type: String,
      required: true,
      immutable: true, // 생성 후 변경 불가
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// 미들웨어: 검증(validator)들이 실행되기 직전에 호출
diarySchema.pre("validate", function (next) {
  // this: 현재 저장/검증 중인 문서(doc)
  // 새 문서거나, date 필드가 수정된 경우에 dateKey 재계산
  if (this.isNew || this.isModified("date")) {
    const d = new Date(this.date);
    if (Number.isNaN(d.getTime())) {
      return next(
        new mongoose.Error.ValidatorError({
          path: "date",
          message: "유효한 날짜를 입력하세요.",
        })
      );
    }
    this.dateKey = toKstYmd(d); // 'YYYY-MM-DD' (KST)
  }
  next();
});

// 공개 피드 최신순 무한 스크롤
diarySchema.index({ isPublic: 1, _id: -1 });

// 사용자별 특정 날짜 (하루 한 편 정책)
diarySchema.index({ userId: 1, dateKey: 1 }, { unique: true });

const Diary = mongoose.model("Diary", diarySchema);
module.exports = Diary;
