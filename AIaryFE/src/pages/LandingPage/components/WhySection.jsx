import { Box, Container } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function WhySection() {
  return (
    <Box className="why">
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <p className="section-title">왜 영어 일기인가요?</p>
          <p className="section-sub">
            일기 쓰기는 가장 자연스럽고 효과적인 언어 학습 방법입니다.
          </p>
        </Box>

        <div className="cards-container">
          <div className="card why-card">
            <CalendarMonthIcon className="i-card" sx={{ fontSize: 40 }} />
            <p className="card-title">매일의 기록</p>
            <p className="card-text">
              하루하루의 경험을 영어로 기록하며
              <br />
              자연스럽게 표현력을 늘려보세요
            </p>
          </div>

          <div className="card why-card">
            <MenuBookIcon className="i-card accent" sx={{ fontSize: 40 }} />
            <p className="card-title">어휘 확장</p>
            <p className="card-text">
              새로운 단어를 자동으로 수집하고 복습하여
              <br />
              어휘력을 체계적으로 늘려보세요
            </p>
          </div>

          <div className="card why-card">
            <TrendingUpIcon className="i-card" sx={{ fontSize: 40 }} />
            <p className="card-title">성장 추적</p>
            <p className="card-text">
              일기 작성 횟수와 학습한 단어 수를 추적하며
              <br />
              성장을 확인하세요
            </p>
          </div>
        </div>
      </Container>
    </Box>
  );
}
