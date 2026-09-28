/**
 * Biography editor (views/updateAbout.ejs): live preview + unsaved changes warning.
 * The photo upload itself is handled by public/js/s3-upload.js, which writes the new
 * S3 link into the hidden #pic field and fires an "input" event on it.
 */
(function () {
  'use strict';

  const cdnDomain = document.currentScript.dataset.cdnDomain;
  const form = document.getElementById('bio-form');
  const pic = document.getElementById('pic');
  const text = document.getElementById('text');
  const email = document.getElementById('email');
  const previewFrame = document.getElementById('pe-preview-frame');
  const preview = document.getElementById('pe-preview');
  const PREVIEW_WIDTH = 700; // about-wrapper is 500px wide on the public site, + margins

  let dirty = false;

  // Same as utils/cdn.js
  function cdn(url) {
    if (!cdnDomain) return url;
    try {
      return `https://${cdnDomain}${new URL(url).pathname}`;
    } catch (e) {
      return `https://${cdnDomain}/${url}`;
    }
  }

  function autoGrow() {
    text.style.height = 'auto';
    text.style.height = `${text.scrollHeight + 2}px`;
  }

  function render() {
    document.getElementById('bio-preview-text').textContent = text.value;
    document.getElementById('bio-preview-email').textContent = email.value;
  }

  pic.addEventListener('input', () => {
    const src = cdn(pic.value);
    document.getElementById('bio-photo-current').src = src;
    document.getElementById('bio-preview-pic').src = src;
    dirty = true;
  });

  [text, email].forEach(field => field.addEventListener('input', () => {
    render();
    if (field === text) autoGrow();
    dirty = true;
  }));

  new ResizeObserver(() => {
    preview.style.zoom = String(Math.min(1, previewFrame.clientWidth / PREVIEW_WIDTH));
  }).observe(previewFrame);

  form.addEventListener('submit', () => { dirty = false; });
  window.addEventListener('beforeunload', (e) => {
    if (!dirty && !window.S3Upload.pending()) return;
    e.preventDefault();
    e.returnValue = '';
  });

  render();
  autoGrow();
})();
