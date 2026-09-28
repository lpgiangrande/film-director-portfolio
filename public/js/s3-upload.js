/**
 * Direct browser -> S3 uploads for the back office.
 *
 * Single file: <input type="file" data-s3-upload data-folder="thumbnails" data-target="img_thumbnail">
 *   -> uploads the file and writes its public S3 URL into the #img_thumbnail text field.
 *
 * Also exposes window.S3Upload for the project editor (public/js/project-editor.js).
 * The server only ever receives S3 links as text.
 */
(function () {
  'use strict';

  const ALLOWED_TYPES = ['image/jpeg', 'video/mp4'];
  const TYPE_LABELS = { 'image/jpeg': 'JPG', 'video/mp4': 'MP4' };

  // Number of uploads in progress, used to block form submission until they are done
  let pendingUploads = 0;

  // -------------------- Helpers -------------------- //

  // Types allowed for a given input, based on its accept attribute
  function allowedTypesFor(input) {
    const accept = input.getAttribute('accept') || '';
    const types = ALLOWED_TYPES.filter(t => accept.includes(t));
    return types.length ? types : ALLOWED_TYPES;
  }

  function typeError(file, allowed) {
    const formats = allowed.map(t => TYPE_LABELS[t]).join(' ou ');
    return `« ${file.name} » n'est pas au bon format (formats acceptés : ${formats}).`;
  }

  // 1) Ask our server for a presigned URL
  async function getPresignedUrl(type, folder) {
    const params = new URLSearchParams({ type, folder });
    const res = await fetch(`/admin/presign?${params}`, {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    });

    // ensureAuthenticated redirects to /login (HTML) when the session has expired
    const isJson = (res.headers.get('content-type') || '').includes('application/json');
    if (!isJson) {
      throw new Error('Session expirée : reconnectez-vous (pensez à copier vos textes avant).');
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur serveur.');
    return data; // { uploadUrl, publicUrl }
  }

  // 2) PUT the file on S3 (XHR rather than fetch to get upload progress)
  function putToS3(uploadUrl, file, onProgress, onXhr) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type); // must match the signed ContentType

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(`Envoi refusé par S3 (code ${xhr.status}).`));
      };
      xhr.onerror = () => reject(new Error('Envoi impossible (réseau ou configuration CORS du bucket).'));
      xhr.onabort = () => reject(new Error('Envoi annulé.'));

      if (onXhr) onXhr(xhr);
      xhr.send(file);
    });
  }

  // Full upload: presign + PUT. Returns the public URL.
  async function uploadToS3(file, folder, onProgress, onXhr) {
    pendingUploads++;
    try {
      const { uploadUrl, publicUrl } = await getPresignedUrl(file.type, folder);
      await putToS3(uploadUrl, file, onProgress, onXhr);
      return publicUrl;
    } finally {
      pendingUploads--;
    }
  }

  function createStatus(afterEl) {
    const status = document.createElement('span');
    status.className = 's3-status';
    status.setAttribute('aria-live', 'polite');
    afterEl.insertAdjacentElement('afterend', status);
    return status;
  }

  function setStatus(el, state, text) {
    el.dataset.state = state; // pending | done | error
    el.textContent = text;
  }

  // -------------------- Single file inputs -------------------- //

  function initSingleUpload(input) {
    const target = document.getElementById(input.dataset.target);
    const folder = input.dataset.folder;
    if (!target) return console.warn('s3-upload: target not found', input.dataset.target);

    const status = createStatus(input);
    let currentUpload = 0; // ignore results of an upload replaced by a newer file

    input.addEventListener('change', async () => {
      const file = input.files[0];
      if (!file) return;

      const allowed = allowedTypesFor(input);
      if (!allowed.includes(file.type)) {
        setStatus(status, 'error', typeError(file, allowed));
        input.value = '';
        return;
      }

      const uploadId = ++currentUpload;
      setStatus(status, 'pending', 'Envoi en cours… 0 %');

      try {
        const url = await uploadToS3(file, folder, (pct) => {
          if (uploadId === currentUpload) setStatus(status, 'pending', `Envoi en cours… ${pct} %`);
        });
        if (uploadId !== currentUpload) return;
        target.value = url;
        target.dispatchEvent(new Event('input', { bubbles: true }));
        setStatus(status, 'done', `✓ Envoyé : ${file.name}`);
      } catch (err) {
        if (uploadId !== currentUpload) return;
        setStatus(status, 'error', `✗ Erreur : ${err.message}`);
      }
    });
  }

  // -------------------- Init -------------------- //

  window.S3Upload = {
    ALLOWED_TYPES,
    upload: uploadToS3, // (file, folder, onProgress, onXhr) -> Promise<publicUrl>
    typeError,
    pending: () => pendingUploads,
  };

  document.querySelectorAll('input[type="file"][data-s3-upload]').forEach(initSingleUpload);

  // Block submission while files are still uploading (the link would be missing)
  document.querySelectorAll('form').forEach(form => {
    if (!form.querySelector('[data-s3-upload]')) return;
    form.addEventListener('submit', (e) => {
      if (pendingUploads > 0) {
        e.preventDefault();
        window.alert('Des fichiers sont encore en cours d\'envoi. Attendez la fin avant d\'enregistrer.');
      }
    });
  });
})();
