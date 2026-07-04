// function isValidDiaryDate(date) {
//   const diaryDate = new Date(date);
//   const today = new Date();
//   today.setHours(0, 0, 0, 0); // 오늘 0시 기준

//   const twoDaysAgo = new Date(today);
//   twoDaysAgo.setDate(today.getDate() - 2);

//   return diaryDate >= twoDaysAgo && diaryDate <= today;
// }

// module.exports = isValidDiaryDate;

const { toKstYmd, addDaysFromKstYmd } = require("./kst-utils");

function isValidDiaryDate(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return false;

  const ymd = toKstYmd(d);
  const todayYmd = toKstYmd(new Date());
  const twoDaysAgoYmd = addDaysFromKstYmd(todayYmd, -2);

  return ymd >= twoDaysAgoYmd && ymd <= todayYmd;
}

module.exports = isValidDiaryDate;
