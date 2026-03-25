const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

if (burger && nav) {
  burger.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

// Ferme le menu mobile quand on clique sur un lien
document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    if (nav) nav.classList.remove("open");
  });
});