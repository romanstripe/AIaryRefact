const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vocabookSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // User 연결
    word: { type: String, required: true, trim: true }, // 저장된 단어
    meaning: { type: String }, // OpenAI에서 받아온 뜻
    example: { type: String }, // OpenAI에서 받아온 예문
    status: { type: String, default: "learning" }, //단어 상태
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 관리
    versionKey: false, // version false
  }
);

// 중복 방지: 같은 사용자가 같은 단어를 여러 번 추가 못하도록
vocabookSchema.index({ userId: 1, word: 1 }, { unique: true });

const Vocabook = mongoose.model("Vocabook", vocabookSchema);
module.exports = Vocabook;
