import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../hooks/useSocket";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Room() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [file, setFile] = useState(null);
  const [tool, setTool] = useState("pen");
  const [strokes, setStrokes] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentObject, setCurrentObject] = useState(null);


  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);
  const lastPointRef = useRef(null);
  const fileInputRef = useRef(null);

  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const isPanningRef = useRef(false);

/* ================= PROTECT ROOM ================= */
useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!socket.connected) {
      const token = localStorage.getItem("token");
      socket.auth = { token };
      socket.connect();
    }

    socket.emit("join-chat-room", roomId);

    socket.on("load-whiteboard", (board) => {
        setStrokes(board?.objects || []);
      });

    socket.on("draw", ({ object }) => {
        setStrokes((prev) => [...prev, object]);
        setRedoStack([]); // keep this
      });

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("user-typing", (name) => {
      if (name !== user?.name) {
        setTypingUser(`${name} is typing...`);
      }
    });

    socket.on("user-stop-typing", () => {
      setTypingUser("");
    });

    socket.on("message-deleted", (messageId) => {
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== messageId)
      );

      socket.on("clear-board", () => {
        setStrokes([]);
      });

      socket.on("load-messages", (msgs) => {
        setMessages(msgs);
      });
    });

    return () => {
      socket.off("load-whiteboard");
      socket.off("draw");
      socket.off("receive-message");
      socket.off("user-typing");
      socket.off("user-stop-typing");
      socket.off("message-deleted");
      socket.off("clear-board");
      socket.off("load-messages");
    };
  }, [roomId, user]);

  /* ================= CANVAS ================= */
  useEffect(() => {
    const canvas = canvasRef.current;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      redraw();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    contextRef.current = ctx;

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const redraw = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!ctx) return;
  
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    ctx.setTransform(
      scaleRef.current,
      0,
      0,
      scaleRef.current,
      offsetRef.current.x,
      offsetRef.current.y
    );
  
    drawGrid(ctx);
  
    /* ===============================
       DRAW SAVED OBJECTS
    =============================== */
    strokes.forEach((obj) => {
      if (!obj) return;
  
      if (obj.type === "pen") {
        ctx.strokeStyle = obj.style.color;
        ctx.lineWidth = obj.style.brushSize;
  
        ctx.beginPath();
        ctx.moveTo(obj.data.x0, obj.data.y0);
        ctx.lineTo(obj.data.x1, obj.data.y1);
        ctx.stroke();
        ctx.closePath();
      }
  
      if (obj.type === "rectangle") {
        ctx.strokeStyle = obj.style.color;
        ctx.lineWidth = obj.style.brushSize;
  
        ctx.strokeRect(
          obj.data.x,
          obj.data.y,
          obj.data.width,
          obj.data.height
        );
      }
    });
  
    /* ===============================
       🔥 RECTANGLE PREVIEW (OUTSIDE LOOP)
    =============================== */
    if (currentObject && currentObject.type === "rectangle") {
      ctx.strokeStyle = currentObject.style.color;
      ctx.lineWidth = currentObject.style.brushSize;
  
      ctx.strokeRect(
        currentObject.data.x,
        currentObject.data.y,
        currentObject.data.width,
        currentObject.data.height
      );
    }
  };

  useEffect(() => {
    redraw();
  }, [strokes]);

  const drawGrid = (ctx) => {
    const gridSize = 50;
    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 1;

    for (let x = -5000; x < 5000; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, -5000);
      ctx.lineTo(x, 5000);
      ctx.stroke();
    }

    for (let y = -5000; y < 5000; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(-5000, y);
      ctx.lineTo(5000, y);
      ctx.stroke();
    }
  };

  /* ================= DRAW ================= */
  const startDrawing = (e) => {
    if (tool === "pan") {
      isPanningRef.current = true;
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();

    const x =
      (e.clientX - rect.left - offsetRef.current.x) /
      scaleRef.current;
    const y =
      (e.clientY - rect.top - offsetRef.current.y) /
      scaleRef.current;

    lastPointRef.current = { x, y };
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (isPanningRef.current) {
      offsetRef.current.x += e.movementX;
      offsetRef.current.y += e.movementY;
      redraw();
      return;
    }

    if (!isDrawing) return;

    const rect = canvasRef.current.getBoundingClientRect();

    const x =
      (e.clientX - rect.left - offsetRef.current.x) /
      scaleRef.current;
    const y =
      (e.clientY - rect.top - offsetRef.current.y) /
      scaleRef.current;

      const object = {
        id: crypto.randomUUID(),
        type: "pen",
        data: {
          x0: lastPointRef.current.x,
          y0: lastPointRef.current.y,
          x1: x,
          y1: y,
        },
        style: {
          color,
          brushSize,
        },
      };
      
      // Local update
      setStrokes((prev) => [...prev, object]);
      
      // Send to backend
      socket.emit("draw", { roomId, object });

    lastPointRef.current = { x, y };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    isPanningRef.current = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = 0.1;

    if (e.deltaY < 0) scaleRef.current += zoomFactor;
    else scaleRef.current -= zoomFactor;

    scaleRef.current = Math.max(0.2, Math.min(5, scaleRef.current));
    redraw();
  };

  /* ================= CHAT ================= */
  const handleTyping = (value) => {
    setInput(value);
    socket.emit("typing", { roomId });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing", { roomId });
    }, 800);
  };

  const sendMessage = () => {
    if (!input.trim() && !file) return;

    socket.emit("send-message", {
      roomId,
      message: input,
      file,
    });

    setInput("");
    setFile(null);
  };

  const handleDelete = (messageId) => {
    socket.emit("delete-message", { messageId, roomId });
    setActiveMenuId(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  





  const handleUndo = () => {
    setStrokes((prev) => {
      if (prev.length === 0) return prev;
  
      const newStrokes = [...prev];
      const removed = newStrokes.pop();
  
      setRedoStack((r) => [...r, removed]);
  
      return newStrokes;
    });
  };
  
  const handleRedo = () => {
    setRedoStack((prevRedo) => {
      if (prevRedo.length === 0) return prevRedo;
  
      const newRedo = [...prevRedo];
      const restored = newRedo.pop();
  
      setStrokes((prev) => [...prev, restored]);
  
      return newRedo;
    });
  };


  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/room/${roomId}`;
  
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Room link copied to clipboard! 🚀");
    } catch (err) {
      alert("Failed to copy link");
    }
  };


  
  /* ================= UI ================= */
  return (
    <div style={styles.container}>
      {/* TOP BAR */}
      <div style={styles.topBar}>
        <h2 style={styles.roomTitle}>Room: {roomId}</h2>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
    <button style={styles.shareBtn} onClick={handleShare}>
      🔗 Share
    </button>

    <input
      type="color"
      value={color}
      onChange={(e) => setColor(e.target.value)}
    />

    <input
      type="range"
      min="1"
      max="20"
      value={brushSize}
      onChange={(e) => setBrushSize(Number(e.target.value))}
    />
  </div>

        <div style={styles.topControls}>

            

  {/* SHAPE TOOLS */}
  <button
    style={tool === "pen" ? styles.activeTopTool : styles.topTool}
    onClick={() => setTool("pen")}
  >
    ✏️
  </button>

  <button
    style={tool === "rectangle" ? styles.activeTopTool : styles.topTool}
    onClick={() => setTool("rectangle")}
  >
    ▭
  </button>

  <button
    style={tool === "circle" ? styles.activeTopTool : styles.topTool}
    onClick={() => setTool("circle")}
  >
    ◯
  </button>

  <button
    style={tool === "line" ? styles.activeTopTool : styles.topTool}
    onClick={() => setTool("line")}
  >
    ／
  </button>

  <button
    style={tool === "text" ? styles.activeTopTool : styles.topTool}
    onClick={() => setTool("text")}
  >
    T
  </button>

  {/* COLOR PICKER */}
  <input
    type="color"
    value={color}
    onChange={(e) => setColor(e.target.value)}
  />

  {/* BRUSH SIZE */}
  <input
    type="range"
    min="1"
    max="20"
    value={brushSize}
    onChange={(e) => setBrushSize(Number(e.target.value))}
  />

</div>
      </div>

      {/* MAIN AREA */}
      <div style={styles.mainSection}>
        {/* LEFT TOOLBAR */}
        <div style={styles.leftToolbar}>
          <button
            style={tool === "pen" ? styles.activeTool : styles.toolBtn}
            onClick={() => setTool("pen")}
          >
            ✏️
          </button>

          <button
            style={tool === "pan" ? styles.activeTool : styles.toolBtn}
            onClick={() => setTool("pan")}
          >
            🖐
          </button>

          

          <button
  style={styles.toolBtn}
  onClick={handleUndo}
>
  ↩
</button>

<button
  style={styles.toolBtn}
  onClick={handleRedo}
>
  ↪
</button>
        </div>

        {/* WHITEBOARD */}
        <div style={styles.whiteboard}>
          <canvas
            ref={canvasRef}
            style={styles.canvas}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onWheel={handleWheel}
          />
        </div>

        {/* YOUR ADVANCED CHAT BOX */}
        <div style={styles.chatBoxWrapper}>
          <div style={styles.chatBox}>
            {messages.map((msg) => {
              const isMe = msg.sender === user?.name;

              return (
                <div
                  key={msg._id}
                  style={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      backgroundColor: isMe ? "#4CAF50" : "#ffffff",
                      color: isMe ? "white" : "black",
                      padding: "10px 15px",
                      borderRadius: "16px",
                      maxWidth: "70%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "12px",
                        opacity: 0.8,
                        marginBottom: "5px",
                      }}
                    >
                      <span>{msg.sender}</span>

                      {isMe && (
                        <button
                          onClick={() =>
                            setActiveMenuId(
                              activeMenuId === msg._id ? null : msg._id
                            )
                          }
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: isMe ? "white" : "black",
                          }}
                        >
                          ⋮
                        </button>
                      )}
                    </div>

                    {msg.message && <div>{msg.message}</div>}

                    {activeMenuId === msg._id && (
                      <div style={styles.menu}>
                        <div
                          style={styles.deleteItem}
                          onClick={() => handleDelete(msg._id)}
                        >
                          🗑 Delete
                        </div>
                      </div>
                    )}

                    <div style={styles.time}>
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })}

            {typingUser && (
              <div style={styles.typing}>{typingUser}</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
  onSubmit={(e) => {
    e.preventDefault();
    sendMessage();
  }}
  style={styles.inputRow}
>
  <input
    type="text"
    value={input}
    onChange={(e) => handleTyping(e.target.value)}
    placeholder="Type a message..."
    style={styles.input}
  />

  {/* Hidden File Input */}
  <input
    type="file"
    ref={fileInputRef}
    style={{ display: "none" }}
    onChange={(e) => setFile(e.target.files[0])}
  />

  {/* Attachment Icon */}
  <span
    style={styles.attachIcon}
    onClick={() => fileInputRef.current.click()}
  >
    📎
  </span>

  <button type="submit" style={styles.button}>
    Send
  </button>
</form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  topBar: {
    minHeight: "70px",
    display: "flex",
    flexWrap: "wrap",        // 👈 important
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    borderBottom: "1px solid #ddd",
    background: "#ffffff",
    gap: "10px",             // 👈 spacing when wrapping
  },
  roomTitle: {
    margin: 0,
    fontSize: "18px",
    wordBreak: "break-all",  // 👈 prevents overflow
  },
  topControls: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
  },
  mainSection: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
  },
  whiteboard: {
    flex: 1,
    background: "#f8f8f8",
  },
  canvas: {
    width: "100%",
    height: "100%",
    display: "block",
    background: "#fff",
    cursor: "crosshair",
  },
  leftToolbar: {
    position: "absolute",
    top: "100px",
    left: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "white",
    padding: "12px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    zIndex: 100,
  },
  toolBtn: {
    border: "none",
    background: "#f5f5f5",
    padding: "10px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "18px",
  },
  activeTool: {
    border: "none",
    background: "#4CAF50",
    color: "white",
    padding: "10px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "18px",
  },
  chatBoxWrapper: {
    width: "350px",
    minWidth: "350px",
    maxWidth: "350px",
    borderLeft: "1px solid #ddd",
    background: "#f2f2f2",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
  },
  
  inputRow: {
    display: "flex",
    gap: "10px",
    padding: "10px",
    borderTop: "1px solid #ddd",
    background: "#ffffff",
  },

  topTool: {
    border: "none",
    background: "#f5f5f5",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  
  activeTopTool: {
    border: "none",
    background: "#4CAF50",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  shareBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#111827",
    color: "white",
    cursor: "pointer",
  },
};

export default Room;