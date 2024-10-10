import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "../pages/LoginPage"

const AppRouter = () => {
  return (
  <Router>
    <main className="container-fluid">
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  </Router>
  );
};

export default AppRouter;
