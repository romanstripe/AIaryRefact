import React from "react";
import {
  Box,
  Button,
  ListItemIcon,
  Avatar,
  Typography,
  Link,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import useDropdownAnimation from "../../../util/useDropdownAnimation";

// 프로필 이미지들 import
import user1 from "../../../assets/user1.png";
import user2 from "../../../assets/user2.png";
import user3 from "../../../assets/user3.png";
import user4 from "../../../assets/user4.png";

const TeamDropdown = () => {
  const { open, isAnimating, toggle, close } = useDropdownAnimation(300);
  const dropdownRef = React.useRef(null);

  const profile = [
    {
      name: "김현진",
      image: user1,
      role: "Product Owner",
      link: "https://github.com/hj7321",
    },
    {
      name: "정승아",
      image: user2,
      role: "Scrum Master",
      link: "https://github.com/Jeongsunga",
    },
    {
      name: "박서연",
      image: user3,
      role: "Developer",
      link: "https://github.com/romanstripe",
    },
    {
      name: "한사라",
      image: user4,
      role: "Developer",
      link: "https://github.com/namee-h",
    },
  ];

  const handleClick = toggle;
  const handleClose = close;

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [open]);

  return (
    <>
      <DropdownButton
        id="developers-button"
        aria-controls={open ? "developers-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={<ExpandMore />}
      >
        팀원 보기
      </DropdownButton>
      {open && (
        <DropdownMenu
          ref={dropdownRef}
          className={isAnimating ? "entering" : "entered"}
        >
          {profile.map((profile, index) => (
            <DropdownMenuItem key={index} onClick={handleClose}>
              <ListItemIcon>
                <Avatar src={profile.image} sx={{ width: 28, height: 28 }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, ml: 2, alignSelf: "flex-end" }}
                >
                  {profile.role}
                </Typography>
              </ListItemIcon>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 1,
                  flex: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {profile.name}
                </Typography>
                <Link
                  href={profile.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--app-chart-1)",
                    textDecoration: "none",
                    alignSelf: "flex-end",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  GitHub
                </Link>
              </Box>
            </DropdownMenuItem>
          ))}
        </DropdownMenu>
      )}
    </>
  );
};

export default TeamDropdown;

// Styled Components
const DropdownButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  borderColor: "var(--app-chart-1)",
  textTransform: "none",
  fontSize: "14px",
  padding: "8px 16px",
  minWidth: "200px",
  justifyContent: "space-between",
  "&:hover": {
    color: "var(--app-chart-1)",
    borderColor: "var(--app-chart-1)",
    backgroundColor: "rgba(96, 175, 160, 0.1)",
  },
  "& .MuiButton-endIcon": {
    marginLeft: "8px",
    transition: "transform 0.2s ease",
  },
  "&[aria-expanded='true'] .MuiButton-endIcon": {
    transform: "rotate(180deg)",
  },
}));

const DropdownMenu = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid var(--app-chart-1)`,
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  width: "350px",
  marginTop: "8px",
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  transformOrigin: "top center",
  "&.entering": {
    opacity: 0,
    transform: "translateY(-10px) scaleY(0.8)",
  },
  "&.entered": {
    opacity: 1,
    transform: "translateY(0) scaleY(1)",
  },
  "&.exiting": {
    opacity: 0,
    transform: "translateY(-10px) scaleY(0.8)",
  },
}));

const DropdownMenuItem = styled(Box)({
  fontSize: "14px",
  padding: "8px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  minHeight: "40px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(96, 175, 160, 0.1)",
  },
  "&:first-of-type": {
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  },
  "&:last-of-type": {
    borderBottomLeftRadius: "8px",
    borderBottomRightRadius: "8px",
  },
});
