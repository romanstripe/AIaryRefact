import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleVocabStatus } from "../apis/vocabApi";

const useUpdateVocab = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: toggleVocabStatus,
    onSuccess: (updated) => {
      // React Query 캐시를 바로 갱신
      queryClient.setQueryData(["myVocab"], (old = []) =>
        old.map((v) => (v._id === updated._id ? updated : v))
      );
    },
    onError: (err) => {
      console.error("업데이트 실패:", err);
    },
  });

  return {
    mutate: mutation.mutate, // 호출할 때 사용
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};

export default useUpdateVocab;
