import { useState, useEffect } from "react";
import "../App.css";
import Navbar from "../Components/Navbar";
import Axios from "axios";
import logo from "../loading.gif";
import AceEditor from "react-ace";
import Loader from "../Components/Loader";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-noconflict/snippets/c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";

function Run() {
  // State variable to set users source code
  const [userCode, setUserCode] = useState(``);
  const [userLang, setUserLang] = useState("python");
  const [userTheme, setUserTheme] = useState("twilight");
  const [fontSize, setFontSize] = useState(20);
  const [userInput, setUserInput] = useState("");
  const [userOutput, setUserOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [langId, setLangId] = useState("py");
  const [mode, setMode] = useState("python");

  const options = {
    fontSize: fontSize,
  };

  const updateCode = (newCode) => {
    setUserCode(newCode);
  };

  function formatErrorMessage(errorMessage) {
    const lines = errorMessage.split("\n");
    let errorType = "";
    let message = "";
    for (const line of lines) {
      if (line.includes("error:")) {
        errorType = line.replace("error:", "").trim();
      } else if (line.includes("note:")) {
        continue;
      } else if (line.includes("warning:")) {
        continue;
      } else {
        message += line.trim() + " ";
      }
    }
    return `Error: ${errorType}\n${message}`;
  }

  // Function to call the compile endpoint
  async function compile() {
    console.log("Compiling...");
    setLoading(true);
    const data = {
      language: langId,
      code: userCode,
      input: userInput,
      userId: localStorage.getItem("uid") || Date.now().toString(),
    };

    const res = await Axios.post(
      `${import.meta.env.VITE_URL}/api/v1/code/runCode`,
      data
    );
    let jobId = res.data.jobId;

    let jsonGetSolution = {
      status: "pending",
      stderr: null,
      compile_output: null,
    };

    while (jsonGetSolution.status === "pending") {
      const res = await Axios.get(
        `${import.meta.env.VITE_URL}/api/v1/code/status/` + jobId
      );
      jsonGetSolution.status = res.data.job.status;
      if (jsonGetSolution.status === "success") {
        jsonGetSolution.compile_output = res.data.job.output;
      }
      if (jsonGetSolution.status === "error") {
        jsonGetSolution.stderr = res.data.job.output;
      }

      console.log(res.data.job);

      //add delay
      await new Promise((r) => setTimeout(r, 1000));
    }

    if (jsonGetSolution.status === "success") {
      setUserOutput(jsonGetSolution.compile_output);
    }

    if (jsonGetSolution.status === "error") {
      setUserOutput(jsonGetSolution.stderr);
    }

    setLoading(false);
  }

  // Function to clear the output screen
  function clearOutput() {
    setUserOutput("");
  }

  return (
    <div className="App">
      <Navbar
        userLang={userLang}
        setUserLang={setUserLang}
        userTheme={userTheme}
        setUserTheme={setUserTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
        setLangId={setLangId}
        updateCode={updateCode}
        mode={mode}
        setMode={setMode}
      />
      <div className="main">
        <div className="left-container">
          <AceEditor
            placeholder={
              userLang === "python"
                ? "Write your python code here"
                : userLang === "java"
                ? "Write your java code here. The class name should be Main"
                : "Write your C/C++ code here"
            }
            className="editorSection"
            height="calc(100vh - 50px)"
            width="100%"
            mode={mode}
            theme={userTheme}
            name="blah2"
            onChange={(value) => {
              console.log(fontSize);
              setUserCode(value);
            }}
            value={userCode}
            fontSize={fontSize}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
          <button
            className="run-btn"
            onClick={() => compile()}
            style={{
              backgroundColor: "#4CAF50",
              border: "none",
              color: "white",
              padding: "15px 32px",
              textAlign: "center",
              textDecoration: "none",
              display: "inline-block",
              fontSize: "16px",
              margin: "4px 2px",
              cursor: "pointer",
            }}
          >
            Run
          </button>
        </div>
        <div className="right-container">
          <h4>Input:</h4>
          <div className="input-box">
            <textarea
              id="code-inp"
              onChange={(e) => setUserInput(e.target.value)}
            ></textarea>
          </div>
          <h4>Output:</h4>
          {loading ? (
            <div className="spinner-box">
              <Loader />
            </div>
          ) : (
            <div className="output-box">
              <pre>{userOutput}</pre>
              <button
                onClick={() => {
                  clearOutput();
                }}
                className="clear-btn"
                style={{
                  backgroundColor: "#4CAF50",
                  border: "none",
                  color: "white",
                  padding: "15px 32px",
                  textAlign: "center",
                  textDecoration: "none",
                  display: "inline-block",
                  fontSize: "16px",
                  margin: "4px 2px",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Run;
