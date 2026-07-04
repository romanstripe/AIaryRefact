import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "../pages/LandingPage/LandingPage";
import Login from "../pages/LoginPage/LoginPage";
import Register from "../pages/RegisterPage/RegisterPage";
import Daily from "../pages/DailyPage/DailyPage";
import Vocab from "../pages/VocabPage/VocabPage";
import AllDiariesPage from "../pages/AllDiariesPage/AllDiariesPage";
import PrivateRoute from "./PrivateRoute";
import Layout from "../layout/Layout";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* 인증이 필요한 라우트들 */}
        <Route element={<PrivateRoute />}>
          <Route path="/vocab" element={<Vocab />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/all-diaries" element={<AllDiariesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
