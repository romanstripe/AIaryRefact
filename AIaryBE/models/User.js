const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // DB 내에서 중복된 값이 저장되지 않도록 보장 (중복 이메일 방지)
      lowercase: true, // 저장 시 자동으로 소문자로 변환 (대소문자 혼동 방지)
      trim: true, // 문자열 앞뒤 공백 제거 후 저장
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "올바른 이메일 형식이 아닙니다."], // 정규식을 통해 이메일 형식 유효성 검사
    },
    password: {
      type: String,
      required: true,
      select: false, // 기본 조회 시 해당 필드를 반환하지 않음 (민감 정보 보호, 필요 시 .select('+password')로 명시적으로 가져와야 함)
    },
    name: {
      type: String,
      required: true,
      trim: true, // 문자열 앞뒤 공백 제거 후 저장
      minlength: 1,
      maxlength: 20,
    },
    profile: {
      type: String,
      required: false, // 가입 시 프로필 업로드가 없으므로 필수 해제
      default: null, // 값이 없으면 null로 저장
      trim: true, // 문자열 앞뒤 공백 제거 후 저장
      set: (v) => (typeof v === "string" && v.trim() ? v.trim() : null), // 빈 문자열이 들어오는 실수를 방지: 빈 값이면 null로 정규화
    },
  },
  {
    timestamps: true,
    versionKey: false, // __v(문서 버전키)를 아예 만들지 않음
    // res.json(doc) / JSON.stringify(doc) 등 "JSON 직렬화" 시에 적용되는 옵션
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.password; // 비밀번호는 응답에서 절대 노출하지 않음 (select:false 예외 케이스 대비 2중 방어)
        return ret;
      },
    },
    // doc.toObject() 호출 시 적용되는 옵션 (서비스/로직에서 plain object가 필요할 때 사용)
    toObject: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.password; // 내부 로직에서 객체로 변환할 때도 비밀번호 제거
        return ret;
      },
    },
  }
);

// User에는 배열 저장 X, Diary.userId로 역참조
userSchema.virtual("diaries", {
  ref: "Diary",
  localField: "_id",
  foreignField: "userId",
  options: { sort: { createdAt: -1 } },
});

userSchema.methods.generateToken = async function () {
  const token = jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
