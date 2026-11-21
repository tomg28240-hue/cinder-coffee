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

function openLightbox(i) {
  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  img.src = photos[i];
  lb.classList.add("active");
  lb.style.display = "flex";
}
window.openLightbox = openLightbox;

function closeLightbox() {
  const lb = document.getElementById("lightbox");
  lb.classList.remove("active");
  lb.style.display = "none";
}
window.closeLightbox = closeLightbox;

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