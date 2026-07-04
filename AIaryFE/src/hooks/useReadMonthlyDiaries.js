import { useQuery } from "@tanstack/react-query";
import { getUserDiariesByMonth } from "../apis/diaryApi";
import useDiaryStore from "../stores/useDiaryStore";
import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

const useReadMonthlyDiaries = ({ year, month }) => {
  const { setMonthDays } = useDiaryStore();
  const userId = useAuthStore((state) => state.user?._id);

  useEffect(() => {
    if (Number.isInteger(year) && Number.isInteger(month)) setMonthDays([]);
  }, [userId, year, month, setMonthDays]);

  const query = useQuery({
    queryKey: ["myMonthlyDiaries", userId, year, month],
    queryFn: () => getUserDiariesByMonth({ year, month }),
    enabled: !!userId && Number.isInteger(year) && Number.isInteger(month),
    staleTime: 0,
    gcTime: 10 * 60_000, // 10분 (사용하지 않는 캐시를 10분 뒤에 정리)
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (query.data?.days) {
      setMonthDays(query.data.days);
    } else if (query.isError) {
      console.error("month query error:", query.error);
      setMonthDays([]);
    }
  }, [query.data, query.isError, query.error, setMonthDays]);

  return query;
};

export default useReadMonthlyDiaries;
