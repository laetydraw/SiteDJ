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

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function validateReservationForm(form) {
  const fields = [
    document.getElementById("name"),
    document.getElementById("email"),
    document.getElementById("phone"),
    document.getElementById("eventType"),
    document.getElementById("date"),
    document.getElementById("location"),
    document.getElementById("guests")
  ];

  fields.forEach((field) => field && field.classList.remove("invalid"));

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const eventType = document.getElementById("eventType");
  const date = document.getElementById("date");
  const location = document.getElementById("location");
  const guests = document.getElementById("guests");

  const requiredFields = [name, email, phone, eventType, date, location, guests];

  let firstInvalidField = null;

  requiredFields.forEach((field) => {
    if (field && !field.value.trim()) {
      field.classList.add("invalid");
      if (!firstInvalidField) firstInvalidField = field;
    }
  });

  if (firstInvalidField) {
    firstInvalidField.focus();
    return "Merci de remplir tous les champs obligatoires.";
  }

  if (!isValidEmail(email.value.trim())) {
    email.classList.add("invalid");
    email.focus();
    return "Merci de renseigner une adresse email valide.";
  }

  if (Number(guests.value) < 1) {
    guests.classList.add("invalid");
    guests.focus();
    return "Le nombre d’invités doit être supérieur à 0.";
  }

  return null;
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

    if (status) {
      status.textContent = "";
      status.classList.remove("success", "error");
    }

    // Anti-spam 1
    if (honeypot && honeypot.value.trim() !== "") {
      return;
    }

    // Validation des champs
    const validationError = validateReservationForm(form);
    if (validationError) {
      if (status) {
        status.textContent = validationError;
        status.classList.remove("success");
        status.classList.add("error");
      }
      return;
    }

    // Anti-spam 2
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

    try {
      await emailjs.sendForm(
        "service_cbfrra1",
        "template_tufodzk",
        form
      );

      await emailjs.sendForm(
        "service_cbfrra1",
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

document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.getElementById("dj-feedback-trigger");
    const modal = document.getElementById("dj-feedback-modal");
    const form = document.getElementById("dj-feedback-form");
    const toast = document.getElementById("dj-toast");

    const nameInput = document.getElementById("dj-name");
    const anonymousCheckbox = document.getElementById("dj-anonymous");
    const messageInput = document.getElementById("dj-message");
    const errorBox = document.getElementById("dj-error");

    const WORKER_URL = "https://vawardsupport.augustin-britsch.workers.dev/";

    if (!trigger || !modal || !form || !nameInput || !anonymousCheckbox || !messageInput) {
        return;
    }

    function openModal() {
        modal.classList.add("open");
    }

    function closeModal() {
        modal.classList.remove("open");
        if (errorBox) errorBox.textContent = "";
    }

    function updateAnonymousState() {
        if (anonymousCheckbox.checked) {
            nameInput.value = "";
            nameInput.disabled = true;
            nameInput.placeholder = "Anonyme";
        } else {
            nameInput.disabled = false;
            nameInput.placeholder = "Ton prénom (optionnel)";
        }
    }

    trigger.addEventListener("click", openModal);

    document.querySelectorAll("[data-close-dj]").forEach((el) => {
        el.addEventListener("click", closeModal);
    });

    anonymousCheckbox.addEventListener("change", updateAnonymousState);
    updateAnonymousState();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (errorBox) errorBox.textContent = "";

        const reaction = document.querySelector('input[name="reaction"]:checked')?.value || "🔥";
        const anonymous = anonymousCheckbox.checked;
        const name = anonymous ? "" : nameInput.value.trim();
        const message = messageInput.value.trim();

        if (!message) {
            if (errorBox) errorBox.textContent = "Merci d’écrire un petit message.";
            return;
        }

        try {
            const res = await fetch(WORKER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reaction,
                    name,
                    anonymous,
                    message,
                    page: window.location.href
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || "Erreur lors de l’envoi.");
            }

            form.reset();
            updateAnonymousState();
            closeModal();

            toast.classList.add("show");
            setTimeout(() => {
                toast.classList.remove("show");
            }, 3000);

        } catch (error) {
            console.error(error);
            if (errorBox) errorBox.textContent = "Impossible d’envoyer le message pour le moment.";
        }
    });
});