import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function About() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.logo} onClick={() => navigate("/")}>
          CollabBoard
        </div>

        <div style={styles.navLinks}>
          <span onClick={() => navigate("/")}>Home</span>
          <span style={{ fontWeight: "600" }}>About</span>
          <span onClick={() => navigate("/services")}>Services</span>
          <span onClick={() => navigate("/contact")}>Contact</span>
          <button
            style={styles.loginBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <div style={styles.hero}>
        <h1 style={styles.title}>About CollabBoard</h1>
        <p style={styles.subtitle}>
          A modern real-time collaborative whiteboard platform
          built for teams, developers, and creators.
        </p>
      </div>

      {/* CONTENT SECTION */}
      <div style={styles.content}>
        <div style={styles.card}>
          <h3>🚀 Our Mission</h3>
          <p>
            To simplify real-time collaboration and make
            digital teamwork seamless, intuitive, and powerful.
          </p>
        </div>

        <div style={styles.card}>
          <h3>🧠 What We Offer</h3>
          <p>
            Live whiteboard drawing, real-time chat,
            multi-user collaboration, and a secure workspace.
          </p>
        </div>

        <div style={styles.card}>
          <h3>🔒 Secure & Scalable</h3>
          <p>
            Built using MERN stack with JWT authentication
            and scalable architecture.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f5f0",
    fontFamily: "Arial, sans-serif",
  },

  navbar: {
    height: "70px",
    background: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 80px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
  },

  logo: {
    fontWeight: "bold",
    fontSize: "20px",
    cursor: "pointer",
  },

  navLinks: {
    display: "flex",
    gap: "30px",
    alignItems: "center",
    cursor: "pointer",
  },

  loginBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#111827",
    color: "white",
    cursor: "pointer",
  },

  hero: {
    textAlign: "center",
    padding: "100px 20px 50px",
  },

  title: {
    fontSize: "38px",
    marginBottom: "20px",
  },

  subtitle: {
    maxWidth: "700px",
    margin: "0 auto",
    color: "#6b7280",
    fontSize: "16px",
  },

  content: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
    padding: "60px 100px",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
  },
};

export default About;