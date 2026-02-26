import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-black rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-50 font-poppins">

      {/* NAVBAR */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            onClick={() => navigate("/")}
            className="text-xl font-semibold cursor-pointer"
          >
            InteractX
          </h1>

          <div className="flex items-center gap-8 text-sm text-zinc-600">
            <span
              onClick={() => navigate("/")}
              className="hover:text-black cursor-pointer"
            >
              Home
            </span>
            <span
              onClick={() => navigate("/about")}
              className="hover:text-black cursor-pointer"
            >
              About
            </span>
            <span className="text-black font-medium">
              Dashboard
            </span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="flex justify-between items-end mb-14">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              Your Boards
            </h1>
            {user && (
              <p className="mt-3 text-zinc-500">
                Welcome back, {user.name}
              </p>
            )}
          </div>

          <button
            onClick={createBoard}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-zinc-800 transition"
          >
            + New Board
          </button>
        </div>

        {boards.length === 0 ? (
          <div className="border border-zinc-200 bg-white rounded-2xl p-16 text-center">
            <h3 className="text-lg font-medium">
              No boards yet
            </h3>
            <p className="mt-2 text-zinc-500">
              Create your first board to start collaborating.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {boards.map((board) => (
              <div
                key={board.roomId}
                onClick={() =>
                  navigate(`/room/${board.roomId}`)
                }
                className="group p-8 bg-white border border-zinc-200 rounded-2xl cursor-pointer hover:border-zinc-400 transition"
              >
                <h3 className="text-lg font-semibold mb-8">
                  {board.title}
                </h3>

                <div className="flex gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      renameBoard(board.roomId);
                    }}
                    className="text-sm px-4 py-2 bg-zinc-100 rounded-md hover:bg-zinc-200 transition"
                  >
                    Rename
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBoard(board.roomId);
                    }}
                    className="text-sm px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;