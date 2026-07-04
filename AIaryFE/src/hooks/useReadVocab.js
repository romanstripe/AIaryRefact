import { useQuery } from "@tanstack/react-query";
import { getVocabList } from "../apis/vocabApi";

const useReadVocab = () => {
  const { data: vocabList = [], refetch } = useQuery({
    queryKey: ["myVocab"],
    queryFn: getVocabList,
    staleTime: 5 * 60 * 1000, // 5분 캐시
  });

  return { vocabList, refetch };
};

export default useReadVocab;
