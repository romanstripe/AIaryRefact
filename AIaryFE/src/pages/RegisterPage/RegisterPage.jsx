import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import useCreateUser from "../../hooks/useCreateUser";
import { useAuthStore } from "../../stores/authStore";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { mutate: createUser, isPending: isLoading } = useCreateUser();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate(-1);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "사용자명을 입력해주세요";
    } else if (formData.name.length < 2) {
      newErrors.name = "사용자명은 2자 이상이어야 합니다";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 최소 6자 이상이어야 합니다";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <PageContainer>
      <Container maxWidth="sm">
        <FormContainer elevation={8}>
          <FormTitle variant="h4" component="h2">
            새로운 여정을 시작하세요
          </FormTitle>
          <FormDescription variant="body1">
            AI와 함께하는 영어 학습의 첫 걸음을 내딛어보세요
          </FormDescription>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <StyledTextField
              fullWidth
              label="사용자명"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="사용자명을 입력해주세요"
            />

            <StyledTextField
              fullWidth
              label="이메일"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              placeholder="이메일을 입력해주세요"
            />

            <StyledTextField
              fullWidth
              label="비밀번호"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              placeholder="비밀번호를 입력해주세요"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              fullWidth
              label="비밀번호 확인"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              placeholder="비밀번호를 다시 입력해주세요"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <RegisterButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
            >
              {isLoading ? "가입 중..." : "계정 만들기"}
            </RegisterButton>

            <Divider sx={{ my: 3 }}>
              <DividerText variant="body2">이미 계정이 있으신가요?</DividerText>
            </Divider>

            <LoginButton
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => navigate("/login")}
            >
              로그인하기
            </LoginButton>
          </Box>
        </FormContainer>
      </Container>
    </PageContainer>
  );
};

export default RegisterPage;

// 스타일드 컴포넌트들
const PageContainer = styled(Box)({
  minHeight: "calc(100dvh - 70px)",
  background: "linear-gradient(135deg, #f8fffe 0%, #e8f5e8 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 0",
});

const FormContainer = styled(Paper)({
  padding: 32,
  borderRadius: 24,
  backgroundColor: "white",
  boxShadow: "0 8px 32px rgba(96, 175, 160, 0.15)",
});

const FormTitle = styled(Typography)({
  textAlign: "center",
  marginBottom: 8,
  fontWeight: 600,
  color: "var(--app-chart-1)",
});

const FormDescription = styled(Typography)({
  textAlign: "center",
  marginBottom: 32,
  color: "var(--app-muted-fg)",
});

const StyledTextField = styled(TextField)({
  marginBottom: 24,
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "var(--app-border)",
    },
    "&:hover fieldset": {
      borderColor: "var(--app-chart-1)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--app-chart-1)",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "var(--app-chart-1)",
  },
});

const RegisterButton = styled(Button)({
  padding: "12px 0",
  marginBottom: 16,
  backgroundColor: "var(--app-chart-1)",
  color: "white",
  fontSize: "1.1rem",
  fontWeight: 600,
  borderRadius: 16,
  textTransform: "none",
  "&:hover": {
    backgroundColor: "var(--app-chart-2)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(96, 175, 160, 0.4)",
  },
  transition: "all 0.3s ease",
});

const DividerText = styled(Typography)({
  color: "var(--app-muted-fg)",
  padding: "0 16px",
});

const LoginButton = styled(Button)({
  padding: "12px 0",
  borderColor: "var(--app-chart-1)",
  color: "var(--app-chart-1)",
  fontSize: "1.1rem",
  fontWeight: 600,
  borderRadius: 16,
  textTransform: "none",
  "&:hover": {
    borderColor: "var(--app-chart-2)",
    backgroundColor: "rgba(96, 175, 160, 0.05)",
    transform: "translateY(-2px)",
  },
  transition: "all 0.3s ease",
});
