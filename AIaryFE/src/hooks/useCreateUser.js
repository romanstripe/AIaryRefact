import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createUserApi } from "../apis/userApi";
import useSnackbarStore from "../stores/useSnackbarStore";

const useCreateUser = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbarStore();
  const mutation = useMutation({
    mutationFn: createUserApi,
    onSuccess: (response) => {
      if (response.success) {
        showSuccess("회원가입을 축하드립니다!!🎉");
        navigate("/login");
      }
    },
    onError: (error) => {
      console.error("회원가입 실패:", error);
      if (error.message) {
        showError(error.message);
      } else {
        showError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};

export default useCreateUser;
