import { Box, Button, Container, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FavoriteIcon from "@mui/icons-material/Favorite";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useAuthStore } from "../../../stores/authStore";

export default function HeroSection() {
  const isLoggedIn = useAuthStore((s) => s.isAuthed());

  return (
    <Box className="hero">
      <Container maxWidth="lg">
        <Box className="hero-inner">
          <Box className="hero-icon">
            <MenuBookIcon className="i-hero" sx={{ fontSize: 80 }} />
            <AutoAwesomeIcon className="i-sparkle" sx={{ fontSize: 25 }} />
          </Box>

          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              lineHeight: 1.3,
              mt: 1,
              mb: 1.5,
              fontSize: "clamp(28px, 4.5vw, 56px)",
            }}
          >
            영어 일기로 시작하는 <br />
            <Box
              component="span"
              sx={{ color: "var(--mui-palette-primary-main)" }}
            >
              자연스러운 영어 학습
            </Box>
          </Typography>

          <Typography
            component="p"
            sx={{
              color: "text.secondary",
              maxWidth: 720,
              mx: "auto",
              my: 3,
              lineHeight: 1.6,
              fontSize: "clamp(14px, 1.8vw, 18px)",
            }}
          >
            매일 영어로 일기를 쓰며 자연스럽게 어휘력을 늘리고 표현력을
            키워보세요.
            <br />
            AI가 도와주는 개인 맞춤형 영어 학습 경험을 시작하세요.
          </Typography>

          <Box className="hero-cta">
            <Button
              component={RouterLink}
              to={isLoggedIn ? "/daily" : "/login"}
              size="large"
              variant="contained"
              className="btn-primary"
              sx={{ fontWeight: 700 }}
              startIcon={<EditNoteIcon fontSize="small" />}
            >
              내 일기 작성하기
            </Button>
          </Box>
        </Box>
      </Container>

      <FavoriteIcon className="i-deco i-deco-left" />
      <TrackChangesIcon className="i-deco i-deco-right" />
    </Box>
  );
}
