import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={styles.page}>
      {/* Brand */}
      <div style={styles.brand} onClick={() => navigate("/")}>
        CollabBoard
      </div>

      {/* Register Card */}
      <div style={styles.card}>
        <h2 style={styles.heading}>Create Account</h2>
        <p style={styles.subText}>
          Join CollabBoard and start collaborating
        </p>

        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="email"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        <p style={styles.loginText}>
          Already have an account?{" "}
          <span
            style={styles.loginLink}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f5f0", // creamy
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
    width: "400px",
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
    outline: "none",
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

  loginText: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#6b7280",
  },

  loginLink: {
    color: "#111827",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Register;