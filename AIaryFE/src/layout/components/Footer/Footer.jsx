import React from "react";
import { Box, Container, Typography, Link, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import LogoVer5 from "../../../assets/logo_ver5.svg";
import { useNavigate } from "react-router-dom";
import TeamDropdown from "./TeamDropdown";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/");
  };

  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <FooterContent>
          <FooterSection>
            <LogoContainer onClick={() => handleNavigation()}>
              <LogoImage src={LogoVer5} alt="AIary Logo" />
            </LogoContainer>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              영어 일기 작성의 새로운 경험
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI와 함께하는 스마트한 영어 학습
            </Typography>
          </FooterSection>

          <FooterSection>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 2, color: "var(--app-chart-1)" }}
            >
              Services
            </Typography>
            <FooterLink href="/daily">일기 작성</FooterLink>
            <FooterLink href="/vocab">단어장</FooterLink>
            <FooterLink href="/all-diaries">모든 일기</FooterLink>
          </FooterSection>

          <FooterSection>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "var(--app-chart-1)" }}
            >
              Developers
            </Typography>
            <TeamDropdown />
          </FooterSection>
        </FooterContent>

        <Divider sx={{ my: 3 }} />

        <FooterBottom>
          <Typography variant="body2" color="text.secondary">
            © 2025 Aiary. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Made with ❤️ for English learners
          </Typography>
        </FooterBottom>
      </Container>
    </StyledFooter>
  );
};

export default Footer;

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(4, 0, 2),
  marginTop: "auto",
}));

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  "&:hover": {
    opacity: 0.8,
  },
  marginBottom: "12px",
});
const LogoImage = styled("img")({
  width: "100px",
  height: "60px",
  marginRight: "12px",
});

const FooterContent = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
    gap: theme.spacing(3),
  },
}));

const FooterSection = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  position: "relative", // 메뉴의 절대 위치 기준점
});

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: "none",
  marginBottom: theme.spacing(0.5),
  "&:hover": {
    color: "var(--app-chart-1)",
  },
}));

const FooterBottom = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: theme.spacing(1),
    textAlign: "center",
  },
}));
