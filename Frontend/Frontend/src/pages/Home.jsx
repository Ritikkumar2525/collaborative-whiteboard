import { useNavigate } from "react-router-dom";
import bgImage from "../assets/website-bg.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* NAVBAR */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          padding: window.innerWidth < 768 ? "20px" : "20px 60px",
          display: "flex",
          flexDirection: window.innerWidth < 500 ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: window.innerWidth < 768 ? "18px" : "22px",
            fontWeight: "bold",
            marginBottom: window.innerWidth < 500 ? "10px" : "0",
          }}
        >
          CollabBoard
        </div>

        <div
          style={{
            display: "flex",
            gap: window.innerWidth < 768 ? "15px" : "30px",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a
            href="/about"
            style={{ textDecoration: "none", color: "white" }}
          >
            About
          </a>

          <a
            href="/services"
            style={{ textDecoration: "none", color: "white" }}
          >
            Services
          </a>

          <a
            href="/contact"
            style={{ textDecoration: "none", color: "white" }}
          >
            Contact
          </a>

          <button
            onClick={() => navigate("/login")}
            style={{
              background: "transparent",
              border: "1px solid white",
              padding: "6px 16px",
              color: "white",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Login
          </button>
        </div>
      </div>

      {/* OVERLAY + CENTER BUTTON */}
      <div
        style={{
          height: "100%",
          width: "100%",
          background: "rgba(0,0,0,0.55)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: window.innerWidth < 768 ? "14px 28px" : "16px 40px",
            fontSize: window.innerWidth < 768 ? "16px" : "18px",
            borderRadius: "6px",
            border: "none",
            background: "#ef4444",
            color: "white",
            cursor: "pointer",
            transition: "0.3s ease",
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;