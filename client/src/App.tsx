import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LoginForm from "./pages/LoginForm/LoginForm";
import RegisterForm from "./pages/RegisterForm/RegisterForm";
import ForgotPassword from "./pages/ForgotPassword/ForgotPossword";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ChangePassword from "./pages/ProfilePage/ChangePassword";
import AddEvent from "./pages/AddEvent/AddEvent";
import ManageEvents from "./pages/ManageEvents/ManageEvents";
import PointsAndAchievements from "./pages/PointsAndAchievements/PointsAndAchievements";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LoginForm />} />{" "}
          <Route path="/login" element={<LoginForm />}></Route>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/profile" element={<ProfilePage />}></Route>
          <Route path="/change-password" element={<ChangePassword />}></Route>
          <Route path="/new-event" element={<AddEvent />}></Route>
          <Route path="/manage-events" element={<ManageEvents />}></Route>
          <Route path="/rewards" element={<PointsAndAchievements />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
