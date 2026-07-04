import { Box } from "@mui/material";
import "dayjs/locale/ko";
import "./LandingPage.style.css";

import HeroSection from "./components/HeroSection";
import WhySection from "./components/WhySection";
import FeedSection from "./components/FeedSection";
import CallToActionSection from "./components/CallToActionSection";
import FloatingButton from "./components/FloatingButton";

export default function LandingPage() {
  return (
    <Box className="landing-root">
      <HeroSection />
      <WhySection />
      <FeedSection />
      <CallToActionSection />
      <FloatingButton />
    </Box>
  );
}
