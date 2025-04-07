
document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("toggle-theme");

  function setDarkModeState(isDark) {
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("darkMode", isDark);
    if (toggleBtn) {
      toggleBtn.innerHTML = isDark ? "🌙 Dark Mode" : "🌞 Light Mode";
    }
  }

  const currentMode = localStorage.getItem("darkMode") === "true";
  setDarkModeState(currentMode);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isDark = !document.body.classList.contains("dark");
      setDarkModeState(isDark);
    });
  }
});
