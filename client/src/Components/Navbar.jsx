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
  mode,
  setMode,
}) => {
  const languages = [
    { value: "c", label: "C", language: "c", mode: "c_cpp" },
    { value: "cpp", label: "C++", language: "cpp", mode: "c_cpp" },
    { value: "python", label: "Python", language: "py", mode: "python" },
    { value: "java", label: "Java", language: "java", mode: "java" },
  ];
  const themes = [
    { value: "monokai", label: "Monokai" },
    { value: "twilight", label: "Twilight" },
    { value: "terminal", label: "Terminal" },
    { value: "solarized_dark", label: "Dolarized Dark" },
    { value: "Github", label: "Github" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "kuroir", label: "Kuroir" },
    { value: "xcode", label: "Xcode" },
    { value: "textmate", label: "Textmate" },
    { value: "solarized_light", label: "Dolarized Light" },
  ];

  const fontSizeOption = [
    { value: 14, label: "14" },
    { value: 16, label: "16" },
    { value: 18, label: "18" },
    { value: 20, label: "20" },
    { value: 24, label: "24" },
    { value: 28, label: "28" },
    { value: 32, label: "32" },
    {
      value: 40,
      label: "40",
    },
  ];
  return (
    <div className="navbar">
      <h1>Stack Runner</h1>
      <div className="selection">
        <label
          style={{
            fontSize: 20,
            color: "white",
          }}
        >
          Open File
        </label>
        <input
          type="file"
          placeholder="Open File"
          style={{
            fontSize: 18,
            borderRadius: 5,
            color: "white",
          }}
          onChange={(e) => {
            const reader = new FileReader();
            const fileExtension = e.target.files[0].name.split(".").pop();
            reader.onload = (e) => {
              // setUserCode(e.target.result);
              if (fileExtension === "c" || "cpp" || "py" || "java") {
                if (fileExtension === "c") {
                  setLangId("c");
                  setUserLang("c");
                  updateCode(e.target.result);
                } else if (fileExtension === "cpp") {
                  setLangId("cpp");
                  setUserLang("cpp");
                  updateCode(e.target.result);
                } else if (fileExtension === "py") {
                  setLangId("py");
                  setUserLang("python");
                  updateCode(e.target.result);
                } else if (fileExtension === "java") {
                  setLangId("java");
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
          value={
            languages.filter((language) => {
              return language.value === userLang;
            })[0]
          }
          onChange={(e) => {
            setUserLang(e.value);
            setLangId(e.language);
            setMode(e.mode);
          }}
          placeholder={
            languages.filter((language) => {
              return language.value === userLang;
            })[0].label
          }
        />
        <Select
          options={themes}
          value={
            themes.filter((theme) => {
              return theme.value === userTheme;
            })[0]
          }
          onChange={(e) => setUserTheme(e.value)}
          placeholder={
            themes.filter((theme) => {
              return theme.value === userTheme;
            })[0].label
          }
        />

        <label
          style={{
            color: "white",
          }}
        >
          Font Size
        </label>

        <Select
          options={fontSizeOption}
          value={
            fontSizeOption.filter((size) => {
              return size.value === fontSize;
            })[0]
          }
          onChange={(e) => setFontSize(e.value)}
          placeholder={
            fontSizeOption.filter((size) => {
              return size.value === fontSize;
            })[0].label
          }
        />

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
