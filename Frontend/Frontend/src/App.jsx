import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Room from "./pages/Room";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />

      <Route
        path="/room/:roomId"
        element={
          <ProtectedRoute>
            <Room />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;