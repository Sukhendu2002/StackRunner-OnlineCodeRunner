import { useState, useEffect } from "react";
import "../App.css";
import Editor from "@monaco-editor/react";
import Navbar from "../Components/Navbar";
import Axios from "axios";
import logo from "../loading.gif";

function Run() {
  // State variable to set users source code
  const [userCode, setUserCode] = useState(``);
  const [userLang, setUserLang] = useState("python");
  const [userTheme, setUserTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(20);
  const [userInput, setUserInput] = useState("");
  const [userOutput, setUserOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [langId, setLangId] = useState("py");

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
    };

    const res = await Axios.post(
      `${import.meta.env.VITE_AWS_URL}/api/v1/code/runCode`,
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
        `${import.meta.env.VITE_AWS_URL}/api/v1/code/status/` + jobId
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
      />
      <div className="main">
        <div className="left-container">
          <Editor
            options={options}
            height="calc(100vh - 50px)"
            width="100%"
            theme={userTheme}
            language={userLang}
            defaultLanguage="python"
            defaultValue="# Enter your code here"
            value={userCode}
            onChange={(value) => {
              setUserCode(value);
            }}
          />
          <button className="run-btn" onClick={() => compile()}>
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
              <img src={logo} alt="Loading..." />
            </div>
          ) : (
            <div className="output-box">
              <pre>{userOutput}</pre>
              <button
                onClick={() => {
                  clearOutput();
                }}
                className="clear-btn"
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
