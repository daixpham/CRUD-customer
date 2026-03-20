import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import HomePage from "./pages/HomePage";
import CreateCustomerPage from "./pages/CreateCustomerPage";
import ViewCustomerPage from "./pages/ViewCustomerPage";
import EditCustomerPage from "./pages/EditCustomerPage";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ cursor: "pointer" }}
              onClick={() => (window.location.href = "/")}
            >
              Customer Management
            </Typography>
          </Toolbar>
        </AppBar>
        <Container sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/customer/new" element={<CreateCustomerPage />} />
            <Route path="/customer/:id" element={<ViewCustomerPage />} />
            <Route path="/customer/:id/edit" element={<EditCustomerPage />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
