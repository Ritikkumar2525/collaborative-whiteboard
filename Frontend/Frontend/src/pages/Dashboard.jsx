import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const token = localStorage.getItem("token");

  /* ================= PROTECT DASHBOARD ================= */
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  /* ================= FETCH BOARDS ================= */
  const fetchBoards = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/boards", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setBoards(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBoards();
  }, [user]);

  /* ================= CREATE ================= */
  const createBoard = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/boards", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setBoards((prev) => [data, ...prev]);
    } catch (error) {
      console.error("Create error:", error);
    }
  };

  /* ================= DELETE ================= */
  const deleteBoard = async (roomId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this board?"
    );
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:8000/api/boards/${roomId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setBoards((prev) =>
        prev.filter((board) => board.roomId !== roomId)
      );
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  /* ================= RENAME ================= */
  const renameBoard = async (roomId) => {
    const newTitle = prompt("Enter new board name:");
    if (!newTitle) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/boards/${roomId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newTitle }),
        }
      );

      const updated = await res.json();

      setBoards((prev) =>
        prev.map((board) =>
          board.roomId === roomId ? updated : board
        )
      );
    } catch (error) {
      console.error("Rename error:", error);
    }
  };

  /* ================= LOGOUT HANDLER ================= */
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  /* ================= LOADER ================= */
  if (loading)
    return (
      <div style={styles.loadingWrapper}>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={styles.loader}></div>
      </div>
    );

  return (
    <div style={styles.page}>
      {/* ================= NAVBAR ================= */}
      <div style={styles.navbar}>
        <div style={styles.logo} onClick={() => navigate("/")}>
          CollabBoard
        </div>

        <div style={styles.navLinks}>
          <span onClick={() => navigate("/")}>Home</span>
          <span onClick={() => navigate("/about")}>About</span>
          <span onClick={() => navigate("/services")}>
            Services
          </span>
          <span onClick={() => navigate("/contact")}>
            Contact
          </span>
          <span style={styles.activeLink}>Dashboard</span>

          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Your Boards</h1>
            {user && (
              <p style={styles.subtitle}>
                Welcome back, {user.name} 👋
              </p>
            )}
          </div>

          <button style={styles.newBtn} onClick={createBoard}>
            + New Board
          </button>
        </div>

        <div style={styles.grid}>
          {boards.length === 0 && (
            <div style={styles.emptyState}>
              <h3>No boards yet</h3>
              <p>
                Create your first board to start collaborating 🚀
              </p>
            </div>
          )}

          {boards.map((board) => (
            <div
              key={board.roomId}
              style={styles.card}
              onClick={() =>
                navigate(`/room/${board.roomId}`)
              }
            >
              <h3 style={styles.cardTitle}>
                {board.title}
              </h3>

              <div style={styles.actions}>
                <button
                  style={styles.renameBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    renameBoard(board.roomId);
                  }}
                >
                  Rename
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBoard(board.roomId);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
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

  activeLink: {
    fontWeight: "600",
    borderBottom: "2px solid #111827",
  },

  logoutBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#111827",
    color: "white",
    cursor: "pointer",
  },

  container: {
    padding: "70px 100px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "60px",
  },

  title: {
    fontSize: "32px",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "6px",
  },

  newBtn: {
    padding: "12px 22px",
    borderRadius: "10px",
    border: "none",
    background: "#111827",
    color: "white",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "30px",
  },

  card: {
    padding: "30px",
    borderRadius: "18px",
    background: "white",
    boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },

  cardTitle: {
    fontSize: "18px",
    marginBottom: "25px",
  },

  actions: {
    display: "flex",
    gap: "15px",
  },

  renameBtn: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#e5e7eb",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },

  emptyState: {
    background: "white",
    padding: "60px",
    borderRadius: "18px",
    textAlign: "center",
    gridColumn: "1 / -1",
  },

  loadingWrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  loader: {
    width: "40px",
    height: "40px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #111827",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default Dashboard;