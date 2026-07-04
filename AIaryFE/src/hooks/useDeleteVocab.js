import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVocab } from "../apis/vocabApi";
import useSnackbarStore from "../stores/useSnackbarStore";

const useDeleteVocab = () => {
  const queryClient = useQueryClient();
  const { showError } = useSnackbarStore();

  const mutation = useMutation({
    mutationFn: deleteVocab,
    onSuccess: () => {
      queryClient.invalidateQueries(["myVocab"]); // 삭제 후 자동 새로고침
    },
    onError: (err) => showError(`삭제 실패! ${err.message}`, 3000),
  });

  return {
    mutate: mutation.mutate, // 호출할 때 사용
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};

export default useDeleteVocab;
