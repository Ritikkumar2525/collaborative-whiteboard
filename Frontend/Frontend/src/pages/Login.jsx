import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        form
      );

      const { accessToken } = res.data;
      login(accessToken);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  /* 🔥 GOOGLE LOGIN REDIRECT */
  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:8000/api/auth/google";
  };

  return (
    <div style={styles.page}>
      <div style={styles.brand} onClick={() => navigate("/")}>
        CollabBoard
      </div>

      <div style={styles.card}>
        <h2 style={styles.heading}>Welcome Back</h2>
        <p style={styles.subText}>
          Login to continue to your workspace
        </p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.line}></span>
          <span style={styles.or}>OR</span>
          <span style={styles.line}></span>
        </div>

        {/* 🔥 GOOGLE BUTTON */}
        <button
          onClick={handleGoogleLogin}
          style={styles.googleBtn}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            style={{ width: "18px", marginRight: "10px" }}
          />
          Continue with Google
        </button>

        <p style={styles.signupText}>
          Don’t have an account?{" "}
          <span
            style={styles.signupLink}
            onClick={() => navigate("/register")}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f5f0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },

  brand: {
    position: "absolute",
    top: "30px",
    left: "50px",
    fontSize: "22px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#111827",
  },

  card: {
    width: "380px",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  },

  heading: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#111827",
  },

  subText: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "25px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
  },

  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#111827",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    margin: "25px 0",
    gap: "10px",
  },

  line: {
    flex: 1,
    height: "1px",
    background: "#e5e7eb",
  },

  or: {
    fontSize: "12px",
    color: "#6b7280",
  },

  googleBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    background: "white",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  signupText: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#6b7280",
  },

  signupLink: {
    color: "#111827",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Login;