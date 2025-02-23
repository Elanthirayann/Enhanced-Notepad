import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FaSave, FaUndo, FaRedo, FaTrash, FaSun, FaMoon } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { ImMenu } from "react-icons/im";
import showdown from "showdown";
import "./App.css";

function App() {
  const [markdown, setMarkdown] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const inputRef = useRef(null);
  const isUndoRedoRef = useRef(false);

  const handleChange = (e) => {
    setMarkdown(e.target.value);
    if (!isUndoRedoRef.current) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(e.target.value);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    isUndoRedoRef.current = false;
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleUndo = () => {
    if (historyIndex > 0) {
      isUndoRedoRef.current = true;
      setHistoryIndex(historyIndex - 1);
      setMarkdown(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoRef.current = true;
      setHistoryIndex(historyIndex + 1);
      setMarkdown(history[historyIndex + 1]);
    }
  };

  const handleClear = () => {
    setMarkdown("");
    setHistory([]);
    setHistoryIndex(-1);
  };

  const handleSaveMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown.md";
    a.click();
  };

  const handleSaveHTML = () => {
    const converter = new showdown.Converter();
    const htmlContent = converter.makeHtml(markdown);
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown.html";
    a.click();
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;
      const markdownWithText = `${markdown}\n\n${fileContent}`;
      setMarkdown(markdownWithText);
    };

    reader.readAsText(file);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={`app ${isDarkTheme ? "dark" : ""}`}>
      <div className="toolbar">
        <div className="toolbar-left">
          <button onClick={handleSaveMarkdown}>
            <FaSave />
            &#160;.MD
          </button>
          <button onClick={handleSaveHTML}>
            <FiFileText />
            &#160;.HTML
          </button>
          <button onClick={handleUndo} disabled={historyIndex <= 0}>
            <FaUndo />
            &#160;Undo
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
          >
            <FaRedo />
            &#160;Redo
          </button>
          <button onClick={handleClear}>
            <FaTrash />
            &#160;Clear
          </button>
          <button onClick={toggleTheme}>
            {isDarkTheme ? <FaSun /> : <FaMoon />}
            &#160;Theme
          </button>
          <div className="file-upload-container">
            <label htmlFor="file-upload-input" className="file-upload-button">
              <FiFileText />
              Upload File
            </label>
            <input
              id="file-upload-input"
              type="file"
              onChange={handleFileUpload}
              accept=".txt,.md"
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="toolbar-right">
          <span>Enhanced Notepad</span>
        </div>
        <div
          className={`hamburger ${isSidebarOpen ? "active" : ""}`}
          onClick={toggleSidebar}
        >
          <ImMenu />
        </div>
      </div>
      <div className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <button onClick={handleSaveMarkdown}>
          <FaSave />
          Save MD
        </button>
        <button onClick={handleSaveHTML}>
          <FiFileText />
          Save HTML
        </button>
        <button onClick={handleUndo} disabled={historyIndex <= 0}>
          <FaUndo />
          Undo
        </button>
        <button
          onClick={handleRedo}
          disabled={historyIndex >= history.length - 1}
        >
          <FaRedo />
          Redo
        </button>
        <button onClick={handleClear}>
          <FaTrash />
          Clear
        </button>
        <button onClick={toggleTheme}>
          {isDarkTheme ? <FaSun /> : <FaMoon />}
          Theme
        </button>
        <div className="file-upload-container">
          <label
            htmlFor="file-upload-input-sidebar"
            className="file-upload-button"
          >
            <FiFileText />
            Upload File
          </label>
          <input
            id="file-upload-input-sidebar"
            type="file"
            onChange={handleFileUpload}
            accept=".txt,.md"
            style={{ display: "none" }}
          />
        </div>
      </div>
      <div className="editor-preview">
        <textarea
          ref={inputRef}
          value={markdown}
          onChange={handleChange}
          placeholder="Start writing your markdown..."
          onClick={closeSidebar}
        />
        <ReactMarkdown className="preview" children={markdown} />
      </div>
    </div>
  );
}

export default App;
