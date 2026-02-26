import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* TOP STRIP */}
      <div style={styles.topStrip}>
        <span>Sign up & play for exciting rewards ✨</span>
      </div>

      {/* MAIN NAV */}
      <div style={styles.navWrapper}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>CollabBoard</div>
        </div>

        <div style={styles.menu}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/about" style={styles.link}>About</Link>
          <Link to="/contact" style={styles.link}>Contact</Link>

          {!user ? (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.goldBtn}>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" style={styles.link}>
                Dashboard
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                style={styles.logoutBtn}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  topStrip: {
    background: "#c62828",
    color: "white",
    textAlign: "center",
    padding: "8px",
    fontSize: "14px",
    letterSpacing: "1px",
  },

  navWrapper: {
    background: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderBottom: "1px solid #eee",
  },

  logoSection: {
    padding: "20px 0",
  },

  logo: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#b71c1c",
    letterSpacing: "2px",
  },

  menu: {
    display: "flex",
    gap: "40px",
    paddingBottom: "15px",
  },

  link: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
    fontSize: "15px",
  },

  goldBtn: {
    background: "linear-gradient(45deg,#c62828,#8e0000)",
    color: "white",
    padding: "8px 16px",
    borderRadius: "4px",
    textDecoration: "none",
  },

  logoutBtn: {
    background: "#8e0000",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Navbar;