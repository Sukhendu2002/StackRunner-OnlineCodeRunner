import React from "react";
import Select from "react-select";
import "./Navbar.css";

const Navbar = ({
  userLang,
  setUserLang,
  userTheme,
  setUserTheme,
  fontSize,
  setFontSize,
  setLangId,
  updateCode,
}) => {
  const languages = [
    { value: "c", label: "C", language: "c" },
    { value: "cpp", label: "C++", language: "cpp" },
    { value: "python", label: "Python", language: "py" },
    { value: "java", label: "Java", language: "java" },
  ];
  const themes = [
    { value: "vs-dark", label: "Dark" },
    { value: "light", label: "Light" },
  ];
  return (
    <div className="navbar">
      <h1>Stack Runner</h1>
      <div className="selection">
        <label
          style={{
            fontSize: 25,
          }}
        >
          Open File
        </label>
        <input
          type="file"
          placeholder="Open File"
          style={{
            fontSize: fontSize,
            borderRadius: 5,
          }}
          onChange={(e) => {
            //read file
            const reader = new FileReader();
            const fileExtension = e.target.files[0].name.split(".").pop();
            reader.onload = (e) => {
              // setUserCode(e.target.result);
              if (fileExtension === "c" || "cpp" || "py" || "java") {
                if (fileExtension === "c") {
                  setLangId(49);
                  setUserLang("c");
                  updateCode(e.target.result);
                } else if (fileExtension === "cpp") {
                  setLangId(53);
                  setUserLang("cpp");
                  updateCode(e.target.result);
                } else if (fileExtension === "py") {
                  setLangId(71);
                  setUserLang("python");
                  updateCode(e.target.result);
                } else if (fileExtension === "java") {
                  setLangId(62);
                  setUserLang("java");
                  updateCode(e.target.result);
                }
              } else {
                alert("Invalid File");
              }
            };
            reader.readAsText(e.target.files[0]);
          }}
        />
        <Select
          options={languages}
          value={userLang}
          onChange={(e) => {
            setUserLang(e.value);
            setLangId(e.language);
          }}
          placeholder={userLang.toUpperCase()}
        />
        <Select
          options={themes}
          value={userTheme}
          onChange={(e) => setUserTheme(e.value)}
          placeholder={userTheme}
        />
        <label>Font Size</label>
        <input
          type="range"
          min="18"
          max="30"
          value={fontSize}
          step="2"
          onChange={(e) => {
            setFontSize(e.target.value);
          }}
        />

        <label>{fontSize}</label>

        {/* logoutbuttoon */}
        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem("authToken");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
