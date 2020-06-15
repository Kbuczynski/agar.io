export const handleForm = () => {
  const nick = document.querySelector("#nick").value,
    color = document.querySelector("#color").value,
    mode = parseInt(document.querySelector("#mode").value),
    enemys = document.querySelector("#enemys").value,
    welcomeScreen = document.querySelector(".welcome-screen");

  welcomeScreen.style.filter = "opacity(0)";
  setTimeout(() => (welcomeScreen.style.display = "none"), 1000);

  return {
    nick: nick,
    color: color,
    mode: mode,
    enemys: enemys
  };
};
