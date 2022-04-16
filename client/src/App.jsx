import { useState, useEffect } from "react";
import "./App.css";
import Editor from "@monaco-editor/react";
import Navbar from "./Components/Navbar";
import Axios from "axios";
import logo from "./loading.gif";

function App() {
  // State variable to set users source code
  const [userCode, setUserCode] = useState(``);
  const [userLang, setUserLang] = useState("python");
  const [userTheme, setUserTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(20);
  const [userInput, setUserInput] = useState("");
  const [userOutput, setUserOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [langId, setLangId] = useState(71);

  const options = {
    fontSize: fontSize,
  };

  // Function to call the compile endpoint
  async function compile() {
    setLoading(true);
    if (userCode === ``) {
      setLoading(false);
      setUserOutput(`Please enter some code to compile`);
      return;
    }
    console.log(userCode);

    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key":
            "30016b0990msh3dd0c6a3daf8220p163266jsn8d986ae9b749",
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          source_code: userCode,
          stdin: userInput,
          language_id: langId,
        }),
      }
    );

    const jsonResponse = await response.json();

    let jsonGetSolution = {
      status: { description: "Queue" },
      stderr: null,
      compile_output: null,
    };
    while (
      jsonGetSolution.status.description !== "Accepted" &&
      jsonGetSolution.stderr == null &&
      jsonGetSolution.compile_output == null
    ) {
      if (jsonResponse.token) {
        let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;
        const getSolution = await fetch(url, {
          method: "GET",
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key":
              "30016b0990msh3dd0c6a3daf8220p163266jsn8d986ae9b749",
            "content-type": "application/json",
          },
        });
        jsonGetSolution = await getSolution.json();
      }
    }
    setLoading(false);
    if (jsonGetSolution.stdout) {
      console.log(jsonGetSolution);
      const output = atob(jsonGetSolution.stdout);
      setUserOutput(
        `Results :\n${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`
      );
      console.log(output);
      console.log(jsonGetSolution.time);
      console.log(jsonGetSolution.memory);
    } else if (jsonGetSolution.stderr) {
      const error = atob(jsonGetSolution.stderr);
      setUserOutput(`Error :\n${error}`);
    } else {
      const compilation_error = atob(jsonGetSolution.compile_output);
      setUserOutput(`Compilation Error :\n${compilation_error}`);
    }
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

export default App;
