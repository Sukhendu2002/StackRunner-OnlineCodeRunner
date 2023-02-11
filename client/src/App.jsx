import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import PrivateRoute from "./routing/PrivateRoute";
import Home from "./Pages/Home";
import "./App.css";
import Run from "./Pages/Run";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/run" element={<Run />} />
          </Route>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
