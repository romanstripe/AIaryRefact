import "./App.css";
import AppRouter from "./routes/AppRouter";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import GlobalSnackbar from "./common/components/GlobalSnackbar";
import ScrollToTop from "./common/components/ScrollToTop";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ScrollToTop />
      <AppRouter />
      <GlobalSnackbar />
    </LocalizationProvider>
  );
}

export default App;
