// ================================================================
// main.js
// ================================================================


// ── LOADER ──────────────────────────────────────────────────────
const loader    = document.getElementById('loader');
const mainPage  = document.getElementById('main-page');
const barFill   = document.getElementById('loader-bar-fill');
const loaderNum = document.getElementById('loader-num');
let progress = 0;

const loadingInterval = setInterval(() => {
  progress += Math.random() * 2 + 0.5;
  progress = Math.min(progress, 100);
  barFill.style.width   = progress + '%';
  loaderNum.textContent = Math.floor(progress);
  if (progress >= 100) { clearInterval(loadingInterval); setTimeout(finishLoading, 400); }
}, 20);

function finishLoading() {
  loader.classList.add('loader-hidden');
  setTimeout(() => {
    mainPage.classList.add('page-visible');
    // Start observing scroll animations AFTER the page becomes visible
    initScrollReveal();
  }, 800);
}


// ── SCROLL REVEAL ────────────────────────────────────────────────
// IntersectionObserver watches elements and fires a callback when
// they enter or leave the viewport (the visible area of the screen).
//
// How it connects to CSS:
//   Elements start with class "scroll-reveal reveal-up" (invisible + shifted)
//   When they enter the viewport, we ADD class "revealed"
//   The CSS transition on .scroll-reveal handles the smooth animation

function initScrollReveal() {
  // Create the observer. It calls this function when an element
  // enters or leaves the viewport.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Element is now visible in the viewport
        entry.target.classList.add('revealed');
        // Stop watching this element — it only needs to animate once
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,  // trigger when 12% of the element is visible
    rootMargin: '0px 0px -40px 0px' // shrinks the detection zone slightly at the bottom
    // this means elements trigger just before they fully enter view
  });

  // ── SECTION HEADINGS ──
  // Each section title fades up when scrolled to
  document.querySelectorAll('section .display-5').forEach(el => {
    el.classList.add('scroll-reveal', 'reveal-up');
    observer.observe(el);
  });

  // ── ABOUT: text slides from left, photo slides from right ──
  const aboutBioMain = document.getElementById('about-bio-main');
  const aboutBioSub  = document.getElementById('about-bio-sub');
  const aboutPhoto   = document.querySelector('.about-photo-card');

  if (aboutBioMain) { aboutBioMain.classList.add('scroll-reveal', 'reveal-left'); observer.observe(aboutBioMain); }
  if (aboutBioSub)  { aboutBioSub.classList.add('scroll-reveal', 'reveal-left', 'reveal-delay-2'); observer.observe(aboutBioSub); }
  if (aboutPhoto)   { aboutPhoto.classList.add('scroll-reveal', 'reveal-right'); observer.observe(aboutPhoto); }

  // ── CONTACT FORM: fades up ──
  const contactForm = document.getElementById('contact-form');
  if (contactForm) { contactForm.classList.add('scroll-reveal', 'reveal-up'); observer.observe(contactForm); }

  // ── FOOTER ──
  const footer = document.querySelector('footer');
  if (footer) { footer.classList.add('scroll-reveal', 'reveal-fade'); observer.observe(footer); }
}

// Project cards get scroll reveal added dynamically AFTER they're rendered,
// so we handle them inside loadProjects() below.


// ── MOUSE SPOTLIGHT ─────────────────────────────────────────────
const spotlight = document.getElementById('mouse-spotlight');
let mouseX = 50, mouseY = 50, currentX = 50, currentY = 50;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth)  * 100;
  mouseY = (e.clientY / window.innerHeight) * 100;
});
function updateSpotlight() {
  currentX += (mouseX - currentX) * 0.12;
  currentY += (mouseY - currentY) * 0.12;
  spotlight.style.setProperty('--mouse-x', `${currentX}%`);
  spotlight.style.setProperty('--mouse-y', `${currentY}%`);
  requestAnimationFrame(updateSpotlight);
}
updateSpotlight();


// ── DARK / LIGHT MODE ───────────────────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
function setTheme(isDark) {
  document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
setTheme(localStorage.getItem('theme') !== 'light');
themeToggle.addEventListener('click', () => {
  setTheme(document.documentElement.getAttribute('data-bs-theme') !== 'dark');
});


// ── TYPING EFFECT ───────────────────────────────────────────────
const words = ["web experiences","modern websites","useful tools","clean solutions","digital products"];
let wordIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.getElementById('typing-text');
function typeEffect() {
  const word = words[wordIndex];
  typingEl.textContent = isDeleting ? word.substring(0, charIndex - 1) : word.substring(0, charIndex + 1);
  charIndex += isDeleting ? -1 : 1;
  let delay = isDeleting ? 40 : 70;
  if (!isDeleting && charIndex === word.length)  { delay = 1500; isDeleting = true; }
  else if (isDeleting && charIndex === 0)         { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 300; }
  setTimeout(typeEffect, delay);
}
window.addEventListener('load', () => setTimeout(typeEffect, 1000));


// ── MAGNETIC BUTTONS ────────────────────────────────────────────
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX - r.left - r.width/2) * 0.2}px, ${(e.clientY - r.top - r.height/2) * 0.2}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = 'translate(0,0)');
});


// ── LOAD ABOUT ──────────────────────────────────────────────────
async function loadAbout() {
  const { data, error } = await window.supabaseClient
    .from('about_content').select('*').eq('id', 1).single();
  if (error || !data) return;
  const nameEl    = document.getElementById('about-name');
  const bioMainEl = document.getElementById('about-bio-main');
  const bioSubEl  = document.getElementById('about-bio-sub');
  const photoEl   = document.getElementById('about-photo');
  if (nameEl    && data.heading)  nameEl.textContent    = data.heading;
  if (bioMainEl && data.bio_main) bioMainEl.textContent = data.bio_main;
  if (bioSubEl  && data.bio_sub)  bioSubEl.textContent  = data.bio_sub;
  if (photoEl && data.image_url && data.image_url.trim() !== '') photoEl.src = data.image_url;
}


// ── LOAD PROJECTS ───────────────────────────────────────────────
async function loadProjects() {
  const container = document.getElementById('projects-container');
  container.innerHTML = '<p class="text-secondary text-center col-12">Loading projects...</p>';

  const { data: projects, error } = await window.supabaseClient
    .from('projects').select('*').order('created_at', { ascending: false });

  if (error) { container.innerHTML = '<p class="text-danger col-12">Failed to load projects.</p>'; return; }
  if (!projects || projects.length === 0) {
    container.innerHTML = '<p class="text-secondary text-center col-12">No projects yet.</p>';
    return;
  }

  container.innerHTML = '';

  // We need a new IntersectionObserver for cards since they're added dynamically
  // (they don't exist on page load, so initScrollReveal() can't find them)
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  projects.forEach((p, index) => {
    const liveBtn   = p.live_url   ? `<a href="${p.live_url}"   class="btn btn-primary btn-sm me-2" target="_blank">Visit</a>`   : '';
    const githubBtn = p.github_url ? `<a href="${p.github_url}" class="btn btn-outline-light btn-sm" target="_blank">GitHub</a>` : '';

    // Create a wrapper div so we can add scroll-reveal to it
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';

    // Stagger the delay: first card = 0.1s, second = 0.2s, third = 0.3s
    // index % 3 keeps the pattern repeating for rows of 3 cards
    const delayClass = `reveal-delay-${(index % 3) + 1}`;
    col.classList.add('scroll-reveal', 'reveal-up', delayClass);

    col.innerHTML = `
      <div class="project-card">
        <img src="${p.image_url || 'https://placehold.co/400x250/0a0f1e/33ccff?text=' + encodeURIComponent(p.title || 'Project')}" alt="${p.title || ''}">
        <div class="project-overlay">
          <h5>${p.title || ''}</h5>
          <p>${p.description || ''}</p>
          <small class="text-secondary d-block mb-3">${p.technologies || ''}</small>
          <div>${liveBtn}${githubBtn}</div>
        </div>
      </div>`;

    container.appendChild(col);
    cardObserver.observe(col); // watch each card individually
  });
}


// ── CONTACT FORM ────────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const submitBtn   = document.getElementById('submit-btn');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !email || !message) { showFormFeedback('Please fill in all fields.', 'danger'); return; }

  submitBtn.disabled = true;
  submitBtn.classList.add('loading');

  const { error } = await window.supabaseClient
    .from('messages').insert({ name, email, message });

  submitBtn.disabled = false;
  submitBtn.classList.remove('loading');

  if (error) { showFormFeedback('Something went wrong. Please try again.', 'danger'); return; }
  contactForm.reset();
  showFormFeedback("Message sent! I'll get back to you soon.", 'success');
});

function showFormFeedback(text, type) {
  const existing = document.getElementById('form-feedback');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'form-feedback';
  el.className = `alert alert-${type} mt-3 text-center`;
  el.textContent = text;
  contactForm.after(el);
  setTimeout(() => el.remove(), 4000);
}


// ── INIT ────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    loadAbout();
    loadProjects();
  }, 500);
});