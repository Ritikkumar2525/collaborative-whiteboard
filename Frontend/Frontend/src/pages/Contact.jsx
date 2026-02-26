import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "../components/Footer";

function Contact() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully! 🚀");
    setForm({ name: "", email: "", message: "" });
  };

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
          <span onClick={() => navigate("/services")}>Services</span>
          <span style={{ fontWeight: "600" }}>Contact</span>
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
        <h1 style={styles.title}>Contact Us</h1>
        <p style={styles.subtitle}>
          We'd love to hear from you. Get in touch!
        </p>
      </div>

      {/* CONTACT SECTION */}
      <div style={styles.container}>
        {/* FORM */}
        <div style={styles.formCard}>
          <h3>Send a Message</h3>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              rows="5"
              style={styles.textarea}
            />

            <button type="submit" style={styles.button}>
              Send Message
            </button>
          </form>
        </div>

        {/* INFO */}
        <div style={styles.infoCard}>
          <h3>Contact Information</h3>
          <p>Email: support@collabboard.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Location: India</p>
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
  },

  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "40px",
    padding: "60px 100px",
  },

  formCard: {
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
  },

  infoCard: {
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },

  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    resize: "none",
  },

  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#111827",
    color: "white",
    cursor: "pointer",
  },
};

export default Contact;