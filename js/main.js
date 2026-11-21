// Mark JS as loaded (enables CSS reveal animations)
document.body.classList.add('js-loaded');

// GSAP setup
gsap.registerPlugin(ScrollTrigger);

// Hero entrance
gsap.from(".hero-sub", { opacity: 0, y: 20, duration: 0.8, delay: 0.2 });
gsap.from(".hero-title", { opacity: 0, y: 30, duration: 1, delay: 0.4 });
gsap.from(".hero-desc", { opacity: 0, y: 20, duration: 0.8, delay: 0.6 });
gsap.from(".hero-cta", { opacity: 0, scale: 0.9, duration: 0.6, delay: 0.8 });

// Hero parallax
gsap.to(".hero-bg img", {
  yPercent: 30,
  ease: "none",
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
});

// Parallax for decorative beans
gsap.utils.toArray(".coffee-bean-deco").forEach((bean, i) => {
  gsap.to(bean, {
    y: -30 - i * 10,
    ease: "none",
    scrollTrigger: {
      trigger: bean.parentElement,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});

// Reveal on scroll
const reveals = document.querySelectorAll(".reveal");
reveals.forEach((el) => {
  // If already in viewport on load, show immediately
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.95) {
    el.classList.add("visible");
  }
  ScrollTrigger.create({
    trigger: el,
    start: "top 95%",
    onEnter: () => el.classList.add("visible"),
  });
});

// Stagger menu cards
gsap.from(".menu-card", {
  opacity: 0,
  y: 50,
  duration: 0.6,
  stagger: 0.15,
  scrollTrigger: {
    trigger: "#меню",
    start: "top 80%",
  },
});

// Lightbox
const photos = [
  "images/gallery-1.jpg",
  "images/gallery-2.jpg",
  "images/gallery-3.jpg",
  "images/gallery-4.jpg",
  "images/gallery-5.jpg",
  "images/hero.jpg",
];

let currentPhotoIndex = 0;

function openLightbox(i) {
  currentPhotoIndex = i;
  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const counter = document.getElementById("lightbox-counter");
  img.src = photos[i];
  if (counter) counter.textContent = (i + 1) + " / " + photos.length;
  lb.classList.add("active");
  lb.style.display = "flex";
  document.body.style.overflow = "hidden";
}
window.openLightbox = openLightbox;

function closeLightbox() {
  const lb = document.getElementById("lightbox");
  lb.classList.remove("active");
  lb.style.display = "none";
  document.body.style.overflow = "";
}
window.closeLightbox = closeLightbox;

function nextPhoto() {
  currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
  openLightbox(currentPhotoIndex);
}
window.nextPhoto = nextPhoto;

function prevPhoto() {
  currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
  openLightbox(currentPhotoIndex);
}
window.prevPhoto = prevPhoto;

// Close lightbox when clicking on background
const lightboxEl = document.getElementById("lightbox");
if (lightboxEl) {
  lightboxEl.addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLightbox();
  });
}

// Keyboard navigation for lightbox
document.addEventListener("keydown", (e) => {
  const lb = document.getElementById("lightbox");
  if (!lb || lb.style.display !== "flex") return;
  if (e.key === "ArrowRight") nextPhoto();
  if (e.key === "ArrowLeft") prevPhoto();
  if (e.key === "Escape") closeLightbox();
});

// Booking form — AJAX via FormSubmit
const form = document.getElementById("booking-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    const originalText = btn.textContent;
    btn.textContent = "Отправка...";
    btn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: formData,
      });

      if (response.ok) {
        form.classList.add("hidden");
        document.getElementById("booking-success").classList.remove("hidden");
      } else {
        throw new Error("Ошибка отправки");
      }
    } catch (err) {
      alert("Не удалось отправить бронь. Попробуйте позже или позвоните нам.");
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

// Menu cards scatter on section hover
const menuSection = document.getElementById("меню");
const menuCards = document.querySelectorAll(".menu-card");
if (menuSection && menuCards.length) {
  menuSection.addEventListener("mouseenter", () => {
    menuCards.forEach((card, i) => {
      const offset = (i - 1) * 20;
      gsap.to(card, { x: offset, y: -8, duration: 0.4, ease: "power2.out" });
    });
  });
  menuSection.addEventListener("mouseleave", () => {
    menuCards.forEach((card) => {
      gsap.to(card, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
    });
  });
}

// Gallery photos scatter on container hover (3 photos, beautiful spread)
const galleryScroll = document.querySelector(".h-scroll");
if (galleryScroll) {
  const photos = galleryScroll.querySelectorAll("div");
  galleryScroll.addEventListener("mouseenter", () => {
    photos.forEach((photo, i) => {
      const offsets = [-25, 0, 25];
      const rotations = [-3, 0, 3];
      gsap.to(photo, { x: offsets[i] || 0, y: -10, rotation: rotations[i] || 0, scale: 1.03, duration: 0.5, ease: "power3.out" });
    });
  });
  galleryScroll.addEventListener("mouseleave", () => {
    photos.forEach((photo) => {
      gsap.to(photo, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.5, ease: "power3.out" });
    });
  });
}

// Header hide on scroll down
let lastScroll = 0;
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  const current = window.scrollY;
  if (current > lastScroll && current > 100) {
    header.style.transform = "translateY(-100%)";
  } else {
    header.style.transform = "translateY(0)";
  }
  lastScroll = current;
});