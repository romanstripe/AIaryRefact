import React from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import UserAvatar from "./UserAvatar";
import { useAuthStore } from "../../../stores/authStore";

const MobileDrawer = ({
  open,
  onClose,
  menuItems,
  isActiveMenu,
  handleNavigation,
  handleToggleLogin,
}) => {
  const { user } = useAuthStore();
  const isLoggedIn = useAuthStore((s) => s.isAuthed());

  return (
    <StyledDrawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <DrawerContainer>
        <DrawerHeader>
          <UserContainer>
            <UserAvatar size={30} />
            {user && (
              <Typography px={2} fontSize={16}>
                {user.name} 님
              </Typography>
            )}
          </UserContainer>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DrawerHeader>

        <DrawerList>
          {menuItems.map((item) => (
            <DrawerListItem
              key={item.text}
              button
              onClick={() => handleNavigation(item.path)}
              isActive={isActiveMenu(item.path)}
            >
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiTypography-root": {
                    fontSize: "1.1rem",
                    fontWeight: 500,
                  },
                }}
              />
            </DrawerListItem>
          ))}

          <DrawerAuthSection>
            <DrawerAuthButton
              variant="outlined"
              onClick={() => {
                handleToggleLogin();
              }}
              fullWidth
            >
              {isLoggedIn ? "로그아웃" : "로그인"}
            </DrawerAuthButton>
            {!isLoggedIn && (
              <DrawerSignupButton
                variant="outlined"
                onClick={() => handleNavigation("/register")}
                fullWidth
              >
                회원가입
              </DrawerSignupButton>
            )}
          </DrawerAuthSection>
        </DrawerList>
      </DrawerContainer>
    </StyledDrawer>
  );
};

export default MobileDrawer;

const StyledDrawer = styled(Drawer)({
  display: { xs: "block" },
  "& .MuiDrawer-paper": {
    boxSizing: "border-box",
    width: 250,
  },
});

const DrawerContainer = styled(Box)({
  width: 250,
});

const DrawerHeader = styled(Box)({
  padding: "16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const UserContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  width: "100%",
});

const DrawerList = styled(List)({});

const DrawerListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "isActive",
})(({ isActive }) => ({
  backgroundColor: isActive ? "rgba(96, 175, 160, 0.15)" : "transparent",
  borderLeft: isActive ? "4px solid var(--app-chart-2)" : "none",
  "&:hover": {
    backgroundColor: isActive
      ? "rgba(96, 175, 160, 0.2)"
      : "rgba(96, 175, 160, 0.1)",
  },
}));

const DrawerAuthSection = styled(Box)({
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  borderTop: "1px solid rgba(96, 175, 160, 0.1)",
  marginTop: "8px",
});

const DrawerAuthButton = styled(Button)({
  borderColor: "var(--app-chart-1)",
  color: "var(--app-chart-1)",
  "&:hover": {
    borderColor: "var(--app-chart-2)",
    backgroundColor: "rgba(96, 175, 160, 0.05)",
  },
});

const DrawerSignupButton = styled(Button)({
  borderColor: "var(--app-chart-1)",
  color: "var(--app-chart-1)",
  "&:hover": {
    borderColor: "var(--app-chart-2)",
    backgroundColor: "rgba(96, 175, 160, 0.05)",
  },
});
