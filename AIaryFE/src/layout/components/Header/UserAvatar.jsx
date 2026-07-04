import React from "react";
import { Avatar, Tooltip } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useAuthStore } from "../../../stores/authStore";

const UserAvatar = ({ size = 30, showTooltip = true }) => {
  const { user } = useAuthStore();

  if (!user) return null;

  const avatarContent = (
    <StyledAvatar size={size}>
      {user.profile ? (
        <img src={user.profile} alt={user.name || user.email} />
      ) : (
        <PersonIcon />
      )}
    </StyledAvatar>
  );

  if (showTooltip) {
    return (
      <Tooltip title={`${user.name || user.email}님`} arrow>
        {avatarContent}
      </Tooltip>
    );
  }

  return avatarContent;
};

export default UserAvatar;

const StyledAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== "size",
})(({ size }) => ({
  width: size,
  height: size,
  fontSize: `${size * 0.4}px`,
  backgroundColor: "rgba(96, 175, 160, 0.15)",
  color: "var(--app-chart-1)",
  border: "1px solid rgba(96, 175, 160, 0.2)",
  "&:hover": {
    backgroundColor: "rgba(96, 175, 160, 0.25)",
    transform: "scale(1.05)",
  },
  transition: "all 0.2s ease",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  },
  "& svg": {
    width: `${size * 0.6}px`,
    height: `${size * 0.6}px`,
  },
}));
