/* =========================================================
   INK LAB by BLIZZ — Interacciones
   ========================================================= */

(function () {
  "use strict";

  var header = document.getElementById("header");
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  /* Header con sombra al hacer scroll */
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Menú móvil */
  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* Cerrar menú al hacer clic en un enlace */
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* Activar enlace de navegación según la página actual */
  var pageName = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav__link").forEach(function (link) {
    var href = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
    if (!href) href = "index.html";
    if (href === pageName) link.classList.add("active");
  });

  /* Aparición al hacer scroll (IntersectionObserver) */
  var revealSelectors = [
    ".section__head",
    ".card",
    ".proceso__steps > li",
    ".testimonio",
    ".estudio__media",
    ".estudio__content",
    ".galeria__item",
    ".contacto__info",
    ".contacto__form",
    ".ctafoot__inner",
    ".footer__col"
  ];

  var revealEls = [];
  revealSelectors.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      var siblings = [];
      if (el.parentElement) {
        siblings = Array.prototype.slice.call(el.parentElement.children);
      }
      var idx = siblings.indexOf(el);
      el.classList.add("reveal");
      el.style.setProperty("--d", (idx % 3) * 110 + "ms");
      revealEls.push(el);
    });
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* Fondo animado: polvo dorado */
  var canvas = document.getElementById("bgCanvas");
  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && !prefersReducedMotion) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var particleCount = window.innerWidth < 768 ? 30 : 60;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function createParticle(randomY) {
      return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : canvas.height + 10,
        r: Math.random() * 1.8 + 0.4,
        speed: Math.random() * 0.45 + 0.12,
        drift: Math.random() * 0.3 - 0.15,
        phase: Math.random() * Math.PI * 2,
        pulse: Math.random() * 0.012 + 0.004
      };
    }

    for (var i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    var hue = 36;
    function draw(timestamp) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var j = 0; j < particles.length; j++) {
        var p = particles[j];
        p.y -= p.speed;
        p.x += Math.sin(timestamp * 0.001 + p.phase) * 0.18 + p.drift;

        if (p.y < -12) {
          particles[j] = createParticle(false);
          continue;
        }

        var alpha = 0.3 + Math.abs(Math.sin(timestamp * p.pulse + p.phase)) * 0.6;
        var radius = p.r * (0.9 + Math.sin(timestamp * p.pulse + p.phase) * 0.25);

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(" + hue + ", 66%, 46%, " + alpha.toFixed(3) + ")";
        ctx.shadowColor = "rgba(150, 106, 25, 0.55)";
        ctx.shadowBlur = 7;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* Galería: carga fotos si existen; si no, usa las ilustraciones temporales */
  var grid = document.getElementById("galeriaGrid");
  if (grid) {
    var items = grid.querySelectorAll(".galeria__item");
    items.forEach(function (item, i) {
      var img = new Image();
      var set = function () {
        item.innerHTML = "";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        item.appendChild(img);
      };
      img.onload = set;
      img.onerror = function () {
        img.src = "assets/gallery/tattoo-" + (i + 1) + ".svg";
      };
      img.src = "assets/gallery/tattoo-" + (i + 1) + ".jpg";
    });
  }

  /* Formulario de cita */
  var form = document.getElementById("citaForm");
  if (form) {
    var successMsg = document.getElementById("formSuccess");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll(".form__group").forEach(function (group) {
        group.classList.remove("invalid");
      });
      if (successMsg) {
        successMsg.hidden = true;
        successMsg.style.display = "none";
      }

      var nombre = document.getElementById("nombre");
      var telefono = document.getElementById("telefono");
      var servicio = document.getElementById("servicio");

      if (!nombre.value.trim()) {
        markInvalid(nombre);
        valid = false;
      }
      if (!telefono.value.trim() || !/^[+\d\s()-]{7,}$/.test(telefono.value.trim())) {
        markInvalid(telefono);
        valid = false;
      }
      if (!servicio.value) {
        markInvalid(servicio);
        valid = false;
      }

      if (!valid) return;

      var fecha = document.getElementById("fecha").value;
      var mensaje = document.getElementById("mensaje").value;

      /* Cuerpo del mensaje para WhatsApp */
      var texto =
        "Hola INK LAB by BLIZZ! Quiero agendar una cita.%0A%0A" +
        "Nombre: " + encodeURIComponent(nombre.value.trim()) + "%0A" +
        "Teléfono: " + encodeURIComponent(telefono.value.trim()) + "%0A" +
        "Servicio: " + encodeURIComponent(servicio.value) +
        (fecha ? "%0AFecha preferida: " + encodeURIComponent(fecha) : "") +
        (mensaje.trim() ? "%0AIdea: " + encodeURIComponent(mensaje.trim()) : "");

      window.open(
        "https://wa.me/573008131531?text=" + texto,
        "_blank",
        "noopener"
      );

      if (successMsg) {
        successMsg.hidden = false;
        successMsg.style.display = "block";
      }
      form.reset();
    });

    function markInvalid(field) {
      var group = field.closest(".form__group");
      if (group) group.classList.add("invalid");
    }

    /* Limpiar estado de error al escribir */
    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      field.addEventListener("input", function () {
        field.closest(".form__group").classList.remove("invalid");
      });
    });
  }
})();