(() => {
  const gallery    = document.getElementById('gallery');
  const emptyState = document.getElementById('empty-state');
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lb-img');
  const lbCaption  = document.getElementById('lb-caption');
  const lbClose    = document.getElementById('lb-close');
  const lbPrev     = document.getElementById('lb-prev');
  const lbNext     = document.getElementById('lb-next');

  let photos = [];
  let current = 0;

  // ── Helpers ────────────────────────────────────────────────────────────────

  function captionFromPath(filePath) {
    const name = filePath.split('/').pop();          // photos/foo.jpg → foo.jpg
    return name.replace(/\.[^.]+$/, '');             // strip extension
  }

  function show(el)  { el.hidden = false; }
  function hide(el)  { el.hidden = true; }

  // ── Gallery rendering ──────────────────────────────────────────────────────

  function renderGallery() {
    photos.forEach((src, index) => {
      const img = document.createElement('img');
      img.src     = src;
      img.alt     = captionFromPath(src);
      img.loading = 'lazy';
      img.addEventListener('click', () => openLightbox(index));
      gallery.appendChild(img);
    });
  }

  // ── Lightbox ───────────────────────────────────────────────────────────────

  function openLightbox(index) {
    current = index;
    updateLightbox();
    show(lightbox);
    lightbox.focus();
  }

  function closeLightbox() {
    hide(lightbox);
  }

  function updateLightbox() {
    lbImg.src        = photos[current];
    lbImg.alt        = captionFromPath(photos[current]);
    lbCaption.textContent = captionFromPath(photos[current]);
    lbPrev.disabled  = current === 0;
    lbNext.disabled  = current === photos.length - 1;
  }

  function navigate(delta) {
    const next = current + delta;
    if (next >= 0 && next < photos.length) {
      current = next;
      updateLightbox();
    }
  }

  // ── Event listeners ────────────────────────────────────────────────────────

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => navigate(-1));
  lbNext.addEventListener('click', () => navigate(1));

  // Close when clicking the dark overlay (but not the image/buttons)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  });

  // ── Initialise ─────────────────────────────────────────────────────────────

  fetch('manifest.json')
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load manifest.json (${res.status})`);
      return res.json();
    })
    .then(data => {
      photos = Array.isArray(data) ? data : [];
      if (photos.length === 0) {
        show(emptyState);
      } else {
        show(gallery);
        renderGallery();
      }
    })
    .catch(err => {
      console.error(err);
      show(emptyState);   // graceful fallback on fetch failure
    });
})();
