import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function Services() {
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
          <span onClick={() => navigate("/about")}>About</span>
          <span style={{ fontWeight: "600" }}>Services</span>
          <span onClick={() => navigate("/contact")}>Contact</span>
          <button
            style={styles.loginBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        <h1 style={styles.title}>Our Services</h1>
        <p style={styles.subtitle}>
          Powerful tools to collaborate, brainstorm, and build together.
        </p>
      </div>

      {/* SERVICES GRID */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>🖊 Real-Time Whiteboard</h3>
          <p>
            Draw, brainstorm, and collaborate instantly with
            smooth real-time synchronization.
          </p>
        </div>

        <div style={styles.card}>
          <h3>💬 Live Chat</h3>
          <p>
            Built-in chat system to communicate while working
            on the same board.
          </p>
        </div>

        <div style={styles.card}>
          <h3>🔗 Shareable Rooms</h3>
          <p>
            Create boards and invite teammates instantly
            using secure room links.
          </p>
        </div>

        <div style={styles.card}>
          <h3>🔒 Secure Authentication</h3>
          <p>
            JWT-based authentication system ensuring
            secure and protected access.
          </p>
        </div>

        <div style={styles.card}>
          <h3>⚡ Fast & Scalable</h3>
          <p>
            Built with MERN stack and Socket.io
            for high performance collaboration.
          </p>
        </div>

        <div style={styles.card}>
          <h3>📂 Board Management</h3>
          <p>
            Create, rename, delete, and manage
            multiple boards easily.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ================= STYLES ================= */

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
    marginBottom: "15px",
  },

  subtitle: {
    color: "#6b7280",
    fontSize: "16px",
  },

  grid: {
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
    transition: "0.3s ease",
  },
};

export default Services;