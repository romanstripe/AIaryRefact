const dateFnsTz = require("date-fns-tz");
const utcToZonedTime = dateFnsTz.utcToZonedTime;
const format = dateFnsTz.format;

const ZONE = "Asia/Seoul";

// 주어진 Date(지금)를 KST(Asia/Seoul) 기준 "YYYY-MM-DD" 문자열로 변환
function kstDateKey(date = new Date()) {
  const zoned = utcToZonedTime(date, ZONE);
  return format(zoned, "yyyy-MM-dd", { timeZone: ZONE });
}

// 오늘로부터 n일 전의 날짜를 KST 기준 "YYYY-MM-DD" 문자열로 변환
function kstDateKeyMinusDays(n) {
  const ms = n * 24 * 60 * 60 * 1000;
  return kstDateKey(new Date(Date.now() - ms));
}

module.exports = { kstDateKey, kstDateKeyMinusDays, ZONE };
