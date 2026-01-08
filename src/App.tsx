import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Calendar from "./pages/Calendar";
import "./App.scss";

function App() {
  return (
    <div className="content-wrapper">
      <h1>Calengantt</h1>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </div>
  );
}

export default App;
