import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <div style={styles.footer}>
      <div style={styles.container}>
        {/* LEFT */}
        <div style={styles.left}>
          <h3 style={styles.logo}>CollabBoard</h3>
          <p style={styles.desc}>
            Real-time collaborative whiteboard platform
            built for teams and creators.
          </p>
        </div>

        {/* MIDDLE */}
        <div style={styles.links}>
          <h4>Quick Links</h4>
          <span onClick={() => navigate("/")}>Home</span>
          <span onClick={() => navigate("/about")}>About</span>
          <span onClick={() => navigate("/services")}>Services</span>
          <span onClick={() => navigate("/contact")}>Contact</span>
        </div>

        {/* RIGHT */}
        <div style={styles.links}>
          <h4>Legal</h4>
          <span>Privacy Policy</span>
          <span>Terms & Conditions</span>
          <span>Support</span>
        </div>
      </div>

      <div style={styles.bottom}>
        © {new Date().getFullYear()} CollabBoard. All rights reserved.
      </div>
    </div>
  );
}

const styles = {
  footer: {
    background: "#111827",
    color: "white",
    paddingTop: "60px",
    marginTop: "80px",
  },

  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "40px",
    padding: "0 100px 40px",
  },

  left: {},

  logo: {
    marginBottom: "15px",
  },

  desc: {
    color: "#9ca3af",
    fontSize: "14px",
    lineHeight: "22px",
  },

  links: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    cursor: "pointer",
  },

  bottom: {
    textAlign: "center",
    padding: "20px",
    borderTop: "1px solid #1f2937",
    fontSize: "13px",
    color: "#9ca3af",
  },
};

export default Footer;