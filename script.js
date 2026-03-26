const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

if (burger && nav) {
  burger.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

// Ferme le menu mobile quand on clique sur un lien
document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    if (nav) nav.classList.remove("open");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  prefillReservationFormFromURL();
  setupReservationForm();
});

function prefillReservationFormFromURL() {
  const params = new URLSearchParams(window.location.search);

  const eventParam = params.get("event");
  const dateParam = params.get("date");

  const eventTypeField = document.getElementById("eventType");
  const eventDateField = document.getElementById("date");

  if (eventParam && eventTypeField) {
    const eventMap = {
      "mariage": "Mariage",
      "afterwork": "Afterwork",
      "anniversaire": "Anniversaire",
      "soiree-privee": "Soirée privée",
      "evenement-entreprise": "Événement d’entreprise",
      "autre": "Autre"
    };

    eventTypeField.value = eventMap[eventParam] || eventParam;
  }

  if (dateParam && eventDateField) {
    eventDateField.value = dateParam;
  }
}

function setupReservationForm() {
  const form = document.getElementById("reservation-form");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");

  if (!form || typeof emailjs === "undefined") return;

  emailjs.init({
    publicKey: "iI8m9iYd8X-SVXaXf"
  });

  const formLoadedAt = Date.now();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const honeypot = document.getElementById("company");

    // Anti-spam 1: honeypot
    if (honeypot && honeypot.value.trim() !== "") {
      return;
    }

    // Anti-spam 2: envoi trop rapide = probable bot
    const secondsOnPage = (Date.now() - formLoadedAt) / 1000;
    if (secondsOnPage < 3) {
      if (status) {
        status.textContent = "Veuillez patienter un instant avant d’envoyer le formulaire.";
        status.classList.remove("success");
        status.classList.add("error");
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Envoi...";
    }

    if (status) {
      status.textContent = "";
      status.classList.remove("success", "error");
    }

    try {
      // 1) Mail envoyé à Vaward
      await emailjs.sendForm(
        "service_cbfrral",
        "template_tufodzk",
        form
      );

      // 2) Mail de confirmation envoyé au client
      await emailjs.sendForm(
        "service_cbfrral",
        "template_rerr0b7",
        form
      );

      if (status) {
        status.textContent = "Votre demande a bien été envoyée.";
        status.classList.remove("error");
        status.classList.add("success");
      }

      showSuccessPopup();
      form.reset();
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire :", error);

      if (status) {
        status.textContent = "Une erreur est survenue. Veuillez réessayer.";
        status.classList.remove("success");
        status.classList.add("error");
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Envoyer la demande";
      }
    }
  });
}

function showSuccessPopup() {
  const popup = document.getElementById("success-popup");
  const confettiContainer = document.getElementById("success-confetti");

  if (!popup) return;

  popup.classList.add("open");
  popup.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  launchConfetti(confettiContainer);
}

function closeSuccessPopup() {
  const popup = document.getElementById("success-popup");

  if (!popup) return;

  popup.classList.remove("open");
  popup.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function launchConfetti(container) {
  if (!container) return;

  container.innerHTML = "";

  const piecesCount = 28;

  for (let i = 0; i < piecesCount; i++) {
    const piece = document.createElement("span");
    piece.className = `confetti-piece${Math.random() > 0.72 ? " circle" : ""}`;

    const left = Math.random() * 100;
    const delay = Math.random() * 0.22;
    const duration = 1.4 + Math.random() * 1.1;
    const x = -120 + Math.random() * 240;
    const rotate = -260 + Math.random() * 520;

    const colors = [
      "#ff4ecd",
      "#7c5cff",
      "#33d1ff",
      "#ffe066",
      "#ffffff"
    ];

    piece.style.left = `${left}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${delay}s`;
    piece.style.animationDuration = `${duration}s`;
    piece.style.setProperty("--confetti-x", `${x}px`);
    piece.style.setProperty("--confetti-rotate", `${rotate}deg`);

    container.appendChild(piece);
  }

  setTimeout(() => {
    container.innerHTML = "";
  }, 2600);
}

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("success-popup");
  const closeBtn = document.getElementById("success-popup-close");
  const actionBtn = document.getElementById("success-popup-btn");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSuccessPopup);
  }

  if (actionBtn) {
    actionBtn.addEventListener("click", closeSuccessPopup);
  }

  if (popup) {
    popup.addEventListener("click", (e) => {
      if (e.target === popup) {
        closeSuccessPopup();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup && popup.classList.contains("open")) {
      closeSuccessPopup();
    }
  });
});