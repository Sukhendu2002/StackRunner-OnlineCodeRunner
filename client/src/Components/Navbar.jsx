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
}) => {
  const languages = [
    { value: "c", label: "C", id: 49 },
    { value: "cpp", label: "C++", id: 53 },
    { value: "python", label: "Python", id: 71 },
    { value: "java", label: "Java", id: 62 },
  ];
  const themes = [
    { value: "vs-dark", label: "Dark" },
    { value: "light", label: "Light" },
  ];
  return (
    <div className="navbar">
      <h1>Stack Runner</h1>
      <div className="selection">
        <Select
          options={languages}
          value={userLang}
          onChange={(e) => {
            setUserLang(e.value);
            setLangId(e.id);
          }}
          placeholder={userLang}
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
      </div>
    </div>
  );
};

export default Navbar;
