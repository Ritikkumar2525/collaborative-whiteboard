import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../hooks/useSocket";
import { useAuth } from "../context/AuthContext";

export default function Room() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [file, setFile] = useState(null);
  const [tool, setTool] = useState("pen");
  const [strokes, setStrokes] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentObject, setCurrentObject] = useState(null);
  
  // New state for the on-canvas text input
  const [textInput, setTextInput] = useState(null); 

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);
  const lastPointRef = useRef(null);
  const startPosRef = useRef(null);
  
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
      setRedoStack([]); 
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

    socket.on("clear-board", () => {
      setStrokes([]);
    });

    socket.on("load-messages", (msgs) => {
      setMessages(msgs);
    });

    return () => {
      socket.off("load-whiteboard");
      socket.off("draw");
      socket.off("receive-message");
      socket.off("user-typing");
      socket.off("user-stop-typing");
      socket.off("clear-board");
      socket.off("load-messages");
    };
  }, [roomId, user]);

  /* ================= CANVAS INITIALIZATION ================= */
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
    ctx.lineJoin = "round";
    ctx.textBaseline = "top";
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
      scaleRef.current, 0, 0, scaleRef.current,
      offsetRef.current.x, offsetRef.current.y
    );

    drawGrid(ctx);

    /* ===============================
       DRAW SAVED OBJECTS
    =============================== */
    strokes.forEach((obj) => {
      if (!obj) return;

      if (obj.type === "pen" || obj.type === "eraser") {
        ctx.strokeStyle = obj.type === "eraser" ? "rgba(0,0,0,1)" : obj.style.color;
        ctx.lineWidth = obj.style.brushSize;
        
        // Use destination-out to act as a real eraser
        if (obj.type === "eraser") ctx.globalCompositeOperation = "destination-out";
        
        ctx.beginPath();
        ctx.moveTo(obj.data.x0, obj.data.y0);
        ctx.lineTo(obj.data.x1, obj.data.y1);
        ctx.stroke();
        ctx.closePath();
        
        if (obj.type === "eraser") ctx.globalCompositeOperation = "source-over"; // Reset
      }

      if (obj.type === "rectangle") {
        ctx.strokeStyle = obj.style.color;
        ctx.lineWidth = obj.style.brushSize;
        ctx.strokeRect(obj.data.x, obj.data.y, obj.data.width, obj.data.height);
      }

      if (obj.type === "circle") {
        ctx.strokeStyle = obj.style.color;
        ctx.lineWidth = obj.style.brushSize;
        ctx.beginPath();
        ctx.ellipse(obj.data.centerX, obj.data.centerY, obj.data.radiusX, obj.data.radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }

      if (obj.type === "text") {
        ctx.fillStyle = obj.style.color;
        ctx.font = `${obj.style.brushSize * 4}px Poppins, sans-serif`;
        ctx.fillText(obj.data.text, obj.data.x, obj.data.y);
      }
    });

    /* ===============================
       DRAW PREVIEW (WHILE DRAGGING)
    =============================== */
    if (currentObject) {
      ctx.strokeStyle = currentObject.style.color;
      ctx.lineWidth = currentObject.style.brushSize;

      if (currentObject.type === "rectangle") {
        ctx.strokeRect(currentObject.data.x, currentObject.data.y, currentObject.data.width, currentObject.data.height);
      } else if (currentObject.type === "circle") {
        ctx.beginPath();
        ctx.ellipse(currentObject.data.centerX, currentObject.data.centerY, currentObject.data.radiusX, currentObject.data.radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    redraw();
  }, [strokes, currentObject]);

  const drawGrid = (ctx) => {
    const gridSize = 50;
    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 1;

    for (let x = -5000; x < 5000; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, -5000); ctx.lineTo(x, 5000); ctx.stroke();
    }
    for (let y = -5000; y < 5000; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(-5000, y); ctx.lineTo(5000, y); ctx.stroke();
    }
  };

  /* ================= DRAWING HANDLERS ================= */
  const startDrawing = (e) => {
    if (tool === "pan") {
      isPanningRef.current = true;
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - offsetRef.current.x) / scaleRef.current;
    const y = (e.clientY - rect.top - offsetRef.current.y) / scaleRef.current;

    // Handle Text Tool - Open an inline input
    if (tool === "text") {
      setTextInput({ 
        x, y, // Canvas coordinates (scaled)
        screenX: e.clientX - rect.left, // Screen coordinates for positioning the <input>
        screenY: e.clientY - rect.top,
        val: "" 
      });
      return;
    }

    // Close text input if clicking elsewhere
    if (textInput) finalizeText();

    startPosRef.current = { x, y };
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
    const x = (e.clientX - rect.left - offsetRef.current.x) / scaleRef.current;
    const y = (e.clientY - rect.top - offsetRef.current.y) / scaleRef.current;

    if (tool === "pen" || tool === "eraser") {
      const object = {
        id: crypto.randomUUID(),
        type: tool,
        data: { x0: lastPointRef.current.x, y0: lastPointRef.current.y, x1: x, y1: y },
        style: { color, brushSize },
      };

      setStrokes((prev) => [...prev, object]);
      socket.emit("draw", { roomId, object });
      lastPointRef.current = { x, y };
    } 
    else if (tool === "rectangle") {
      setCurrentObject({
        id: crypto.randomUUID(),
        type: "rectangle",
        data: { x: startPosRef.current.x, y: startPosRef.current.y, width: x - startPosRef.current.x, height: y - startPosRef.current.y },
        style: { color, brushSize },
      });
    }
    else if (tool === "circle") {
      const radiusX = Math.abs(x - startPosRef.current.x) / 2;
      const radiusY = Math.abs(y - startPosRef.current.y) / 2;
      const centerX = startPosRef.current.x + (x - startPosRef.current.x) / 2;
      const centerY = startPosRef.current.y + (y - startPosRef.current.y) / 2;

      setCurrentObject({
        id: crypto.randomUUID(),
        type: "circle",
        data: { centerX, centerY, radiusX, radiusY },
        style: { color, brushSize },
      });
    }
  };

  const stopDrawing = () => {
    if ((tool === "rectangle" || tool === "circle") && currentObject) {
      setStrokes((prev) => [...prev, currentObject]);
      socket.emit("draw", { roomId, object: currentObject });
      setCurrentObject(null);
    }
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

  const finalizeText = () => {
    if (textInput && textInput.val.trim() !== "") {
      const object = {
        id: crypto.randomUUID(),
        type: "text",
        data: { x: textInput.x, y: textInput.y, text: textInput.val },
        style: { color, brushSize },
      };
      setStrokes((prev) => [...prev, object]);
      socket.emit("draw", { roomId, object });
    }
    setTextInput(null);
  };

  /* ================= CHAT & HISTORY ================= */
  const handleTyping = (value) => {
    setInput(value);
    socket.emit("typing", { roomId });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => socket.emit("stop-typing", { roomId }), 800);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("send-message", { roomId, message: input, file });
    setInput(""); setFile(null);
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
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`);
      alert("Room link copied to clipboard! 🚀");
    } catch (err) { alert("Failed to copy link"); }
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-50 font-poppins">
      {/* TOP BAR */}
      <div className="h-16 border-b border-zinc-200 bg-white px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h2 className="text-sm text-zinc-500">Room</h2>
          <span className="text-sm font-medium text-black">{roomId}</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleShare} className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-zinc-800 transition">Share</button>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 border border-zinc-300 rounded cursor-pointer" title="Color" />
          <input type="range" min="1" max="30" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} title="Brush Size" />
        </div>
      </div>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT TOOLBAR */}
        <div className="w-20 border-r border-zinc-200 bg-white flex flex-col items-center py-6 gap-3 overflow-y-auto">
          {[
            { id: "pen", icon: "✏️", title: "Pen" },
            { id: "eraser", icon: "🧽", title: "Eraser" },
            { id: "rectangle", icon: "⬜", title: "Rectangle" },
            { id: "circle", icon: "⭕", title: "Circle" },
            { id: "text", icon: "🔤", title: "Text" },
            { id: "pan", icon: "🖐", title: "Pan Tool" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`w-10 h-10 rounded-md flex items-center justify-center text-lg ${
                tool === t.id ? "bg-black text-white" : "bg-zinc-100 hover:bg-zinc-200"
              }`}
              title={t.title}
            >
              {t.icon}
            </button>
          ))}

          <hr className="w-10 border-zinc-200 my-2" />
          <button onClick={handleUndo} className="w-10 h-10 rounded-md bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-xl" title="Undo">↩</button>
          <button onClick={handleRedo} className="w-10 h-10 rounded-md bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-xl" title="Redo">↪</button>
        </div>

        {/* CANVAS AREA */}
        <div className="flex-1 relative bg-white overflow-hidden">
          <canvas
            ref={canvasRef}
            className={`w-full h-full ${tool === "pan" ? "cursor-grab" : "cursor-crosshair"}`}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onWheel={handleWheel}
          />

          {/* ON-CANVAS HTML TEXT INPUT */}
          {textInput && (
            <input
              autoFocus
              type="text"
              value={textInput.val}
              onChange={(e) => setTextInput({ ...textInput, val: e.target.value })}
              onBlur={finalizeText}
              onKeyDown={(e) => {
                if (e.key === "Enter") finalizeText();
              }}
              style={{
                position: "absolute",
                left: textInput.screenX,
                top: textInput.screenY,
                color: color,
                fontSize: `${brushSize * 4 * scaleRef.current}px`,
                background: "transparent",
                border: "1px dashed #ccc",
                outline: "none",
                fontFamily: "Poppins, sans-serif",
                padding: "2px",
                zIndex: 10,
                minWidth: "150px"
              }}
              placeholder="Type and press Enter..."
            />
          )}
        </div>

        {/* CHAT AREA (unchanged) */}
        <div className="w-96 border-l border-zinc-200 bg-white flex flex-col">
          <div className="h-14 border-b border-zinc-200 px-4 flex items-center text-sm font-medium">Room Chat</div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isMe = msg.sender === user?.name;
              return (
                <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg text-sm ${isMe ? "bg-black text-white" : "bg-zinc-100 text-black"}`}>
                    <div className="text-xs opacity-60 mb-1">{msg.sender}</div>
                    {msg.message && <div>{msg.message}</div>}
                    <div className="text-[10px] opacity-50 mt-2 text-right">{new Date(msg.createdAt).toLocaleTimeString()}</div>
                  </div>
                </div>
              );
            })}
            {typingUser && <div className="text-xs text-zinc-400">{typingUser}</div>}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="border-t border-zinc-200 p-3 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => handleTyping(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button type="submit" className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-zinc-800 transition">Send</button>
          </form>
        </div>

      </div>
    </div>
  );
}