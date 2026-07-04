import { useMutation } from "@tanstack/react-query";
import { loginWithGoogleApi } from "../apis/authApi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import useSnackbarStore from "../stores/useSnackbarStore";

const useLoginWithGoogle = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showSuccess, showError } = useSnackbarStore();
  const mutation = useMutation({
    mutationFn: loginWithGoogleApi,
    onSuccess: (response) => {
      if (response.status === "success") {
        login({ token: response.token, user: response.user });
        showSuccess("로그인 성공!");
        navigate("/daily");
      }
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
      if (error.message) {
        showError(error.message);
      } else {
        showError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
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

export default useLoginWithGoogle;
