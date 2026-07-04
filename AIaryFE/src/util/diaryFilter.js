/**
 * 일기 데이터를 검색하고 정렬하는 유틸리티 함수들
 */

/**
 * 일기 데이터를 검색어로 필터링
 * @param {Array} diaries - 일기 데이터 배열
 * @param {string} searchQuery - 검색어
 * @returns {Array} 필터링된 일기 배열
 */
export const filterDiariesBySearch = (diaries, searchQuery) => {
  if (!diaries || diaries.length === 0) return [];
  if (!searchQuery.trim()) return diaries;

  const query = searchQuery.toLowerCase();
  return diaries.filter(
    (diary) =>
      diary.title?.toLowerCase().includes(query) ||
      diary.content?.toLowerCase().includes(query) ||
      diary.author?.name?.toLowerCase().includes(query)
  );
};

/**
 * 일기 데이터를 정렬 기준에 따라 정렬
 * @param {Array} diaries - 일기 데이터 배열
 * @param {string} sortBy - 정렬 기준 ('newest', 'oldest', 'title', 'author')
 * @returns {Array} 정렬된 일기 배열
 */
export const sortDiaries = (diaries, sortBy) => {
  if (!diaries || diaries.length === 0) return [];

  return [...diaries].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.dateKey || b.date || b.createdAt) -
          new Date(a.dateKey || a.date || a.createdAt)
        );
      case "oldest":
        return (
          new Date(a.dateKey || a.date || a.createdAt) -
          new Date(b.dateKey || b.date || b.createdAt)
        );
      case "title":
        return (a.title || "").localeCompare(b.title || "");
      case "author":
        return (a.author?.name || "").localeCompare(b.author?.name || "");
      default:
        return 0;
    }
  });
};

/**
 * 일기 데이터를 검색하고 정렬하는 메인 함수
 * @param {Array} diaries - 원본 일기 데이터 배열
 * @param {string} searchQuery - 검색어
 * @param {string} sortBy - 정렬 기준 ('newest', 'oldest', 'title', 'author')
 * @returns {Array} 필터링되고 정렬된 일기 배열
 */
export const filterAndSortDiaries = (diaries, searchQuery, sortBy) => {
  const filtered = filterDiariesBySearch(diaries, searchQuery);
  return sortDiaries(filtered, sortBy);
};
