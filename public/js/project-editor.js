/**
 * Project page editor (views/projectForm.ejs).
 *
 * The page content is a list of blocks, in display order:
 *   { type: 'row',   items: [{ url, caption }], text }  -> 1 to 4 visuals side by side
 *   { type: 'vimeo', url, text }
 *   { type: 'text',  text }
 * It is sent as JSON in the hidden #blocks field and cleaned server side (utils/projectBlocks.js).
 *
 * Visuals are uploaded directly to S3 (window.S3Upload, public/js/s3-upload.js), one at a time.
 * The preview on the right reuses the markup and classes of views/project.ejs.
 */
(function () {
  'use strict';

  const MAX_ITEMS = 4;
  const PREVIEW_WIDTH = 1000; // px, roughly the width of the content column on the public site
  // Same as ROW_COLS in views/project.ejs
  const ROW_COLS = { 1: 'col-12', 2: 'col-sm-6 col-12', 3: 'col-sm-4 col-12', 4: 'col-md-3 col-6' };
  const BLOCK_LABELS = { row: 'Rangée de visuels', vimeo: 'Vidéo Vimeo', text: 'Paragraphe' };

  const data = JSON.parse(document.getElementById('pe-data').textContent);
  const form = document.getElementById('projectForm');
  const blocksInput = document.getElementById('blocks');
  const list = document.getElementById('pe-blocks');
  const previewFrame = document.getElementById('pe-preview-frame');
  const preview = document.getElementById('pe-preview');
  const submitStatus = document.getElementById('pe-submit-status');
  const mainVideoInput = document.getElementById('main_video');
  const S3 = window.S3Upload;

  let nextId = 1;
  const uid = () => nextId++;
  let dirty = false;

  // -------------------- Helpers -------------------- //

  // Same logic as utils/vimeo.js
  function toVimeoEmbed(url) {
    const value = (url || '').trim();
    if (!value || value.includes('player.vimeo.com/video/')) return value;
    const match = value.match(/vimeo\.com\/(?:.*\/)?(\d+)(?:\/([a-z0-9]+))?/i);
    if (!match) return value;
    return `https://player.vimeo.com/video/${match[1]}${match[2] ? `?h=${match[2]}` : ''}`;
  }

  function vimeoId(url) {
    const match = (url || '').match(/vimeo\.com\/(?:.*\/)?(\d+)/i);
    return match ? match[1] : null;
  }

  const isImage = (url) => url.endsWith('.jpg');
  // Uploaded files get a generated name (uploadController.js: <timestamp>-<random>.<ext>), not worth showing
  function fileName(url) {
    const name = decodeURIComponent((url || '').split('/').pop());
    return /^\d{13}-[0-9a-f]{12}\.(jpg|mp4)$/.test(name) ? '' : name;
  }

  // Media are displayed through the CDN, like on the public site (utils/cdn.js)
  function cdn(url) {
    if (!data.cdnDomain) return url;
    try {
      return `https://${data.cdnDomain}${new URL(url).pathname}`;
    } catch (e) {
      return url;
    }
  }

  // Tiny DOM builder: el('div', { class: 'x', onclick: fn }, child1, 'text', ...)
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === false) return;
      if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
      else if (key === 'class') node.className = value;
      else if (key in node && typeof value !== 'string') node[key] = value;
      else node.setAttribute(key, value === true ? '' : value);
    });
    children.flat().forEach(child => {
      if (child === null || child === undefined || child === false) return;
      node.append(child instanceof Node ? child : document.createTextNode(child));
    });
    return node;
  }

  let toastTimer;
  function toast(text, isError) {
    let box = document.querySelector('.pe-toast');
    if (!box) {
      box = el('div', { class: 'pe-toast', role: 'status' });
      document.body.appendChild(box);
    }
    box.textContent = text;
    box.classList.toggle('is-error', !!isError);
    box.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => box.classList.remove('is-visible'), isError ? 8000 : 4000);
  }

  function markDirty() {
    dirty = true;
  }

  // -------------------- State -------------------- //

  function makeItem(src) {
    return { id: uid(), url: src.url || '', caption: src.caption || '', name: src.name || fileName(src.url), state: src.state || 'done', progress: 0 };
  }

  function makeBlock(type, src) {
    src = src || {};
    const block = { id: uid(), type, url: src.url || '', text: src.text || '' };
    if (type === 'row') block.items = (src.items || []).map(makeItem);
    return block;
  }

  const blocks = (data.blocks || []).map(b => makeBlock(b.type, b));

  const findBlock = (id) => blocks.find(b => b.id === id);
  const rowOfItem = (item) => blocks.find(b => b.type === 'row' && b.items.includes(item));

  // -------------------- Uploads -------------------- //

  const queue = []; // items waiting for upload, in order
  let uploading = null;

  const pendingCount = () => queue.length + (uploading ? 1 : 0);

  function updateSubmitStatus() {
    const n = pendingCount();
    submitStatus.textContent = n ? `Envoi des fichiers en cours (${n} restant${n > 1 ? 's' : ''})… attendez avant d'enregistrer.` : '';
  }

  // Splits n files into balanced rows of max 4 (5 -> 3+2, 6 -> 3+3, 7 -> 4+3)
  function balancedSizes(n) {
    const rows = Math.ceil(n / MAX_ITEMS);
    return Array.from({ length: rows }, (_, i) => Math.floor(n / rows) + (i < n % rows ? 1 : 0));
  }

  /**
   * Adds files to a row (or to new rows when block is null). Files that do not fit
   * go into new rows inserted right after.
   */
  function addFiles(block, fileList) {
    const files = [];
    const errors = [];
    Array.from(fileList).forEach(file => {
      if (S3.ALLOWED_TYPES.includes(file.type)) files.push(file);
      else errors.push(S3.typeError(file, S3.ALLOWED_TYPES));
    });

    let index = block ? blocks.indexOf(block) : blocks.length - 1;
    const room = block ? MAX_ITEMS - block.items.length : 0;
    const groups = [];
    if (room > 0 && files.length) groups.push({ block, files: files.splice(0, room) });
    balancedSizes(files.length).forEach(size => groups.push({ block: null, files: files.splice(0, size) }));

    let created = 0;
    groups.forEach(group => {
      let target = group.block;
      if (!target) {
        target = makeBlock('row');
        blocks.splice(++index, 0, target);
        created++;
      }
      group.files.forEach(file => {
        const item = makeItem({ name: file.name, state: 'queued' });
        item.file = file;
        target.items.push(item);
        queue.push(item);
      });
    });

    const messages = [];
    if (created && block) messages.push(`${created} nouvelle(s) rangée(s) créée(s) : ${MAX_ITEMS} visuels maximum par rangée. Glissez les visuels pour les répartir autrement.`);
    if (errors.length) messages.push(errors.join(' '));
    if (messages.length) toast(messages.join(' '), errors.length > 0);

    if (groups.length) markDirty();
    renderEditor();
    processQueue();
  }

  async function processQueue() {
    updateSubmitStatus();
    if (uploading || !queue.length) return;

    const item = uploading = queue.shift();
    item.state = 'uploading';
    updateTile(item);

    try {
      item.url = await S3.upload(item.file, 'projects', (pct) => {
        item.progress = pct;
        updateTile(item);
      }, (xhr) => { item.xhr = xhr; });
      item.state = 'done';
    } catch (err) {
      item.state = 'error';
      item.error = err.message;
    }
    delete item.xhr;
    delete item.file;
    uploading = null;

    // The item may have been removed while uploading
    if (rowOfItem(item)) {
      updateTile(item);
      renderPreview();
    }
    processQueue();
  }

  function removeItem(item) {
    const row = rowOfItem(item);
    if (!row) return;
    if (item.xhr) item.xhr.abort();
    const queued = queue.indexOf(item);
    if (queued >= 0) queue.splice(queued, 1);
    row.items.splice(row.items.indexOf(item), 1);
    markDirty();
    updateSubmitStatus();
    renderEditor();
  }

  // -------------------- Editor -------------------- //

  function toolButton(label, title, onclick, disabled) {
    return el('button', { type: 'button', class: 'pe-tool', title, 'aria-label': title, disabled: !!disabled, onclick }, label);
  }

  function autoGrow(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
  }

  function textArea(value, placeholder, oninput, rows) {
    const area = el('textarea', { class: 'form-control pe-textarea', rows: rows || 3, placeholder });
    area.value = value;
    area.addEventListener('input', () => {
      oninput(area.value);
      autoGrow(area);
      markDirty();
    });
    requestAnimationFrame(() => autoGrow(area));
    return area;
  }

  // Only the media area is draggable: a draggable parent would prevent selecting text in the caption
  function tileMedia(item) {
    const box = el('div', { class: 'pe-tile__media', draggable: true });
    if (item.state === 'done') {
      const media = isImage(item.url)
        ? el('img', { src: cdn(item.url), alt: '', loading: 'lazy', draggable: false })
        : el('video', { src: `${cdn(item.url)}#t=0.5`, muted: true, playsInline: true, preload: 'metadata' });
      media.addEventListener('error', () => media.replaceWith(el('span', { class: 'pe-tile__placeholder' }, 'Aperçu indisponible')), { once: true });
      box.append(media);
      if (!isImage(item.url)) box.append(el('span', { class: 'pe-tile__badge' }, 'VIDÉO'));
    } else {
      const text = item.state === 'error' ? `Erreur : ${item.error}`
        : item.state === 'uploading' ? `Envoi… ${item.progress || 0} %`
          : 'En attente…';
      box.append(el('span', { class: 'pe-tile__placeholder' }, text));
      if (item.state === 'uploading') box.append(el('span', { class: 'pe-tile__progress', style: `width:${item.progress || 0}%` }));
    }
    return box;
  }

  function renderTile(row, item, index) {
    const tile = el('div', { class: 'pe-tile', 'data-item-id': item.id, 'data-state': item.state, title: item.name },
      tileMedia(item),
      el('div', { class: 'pe-tile__name' }, item.name),
      el('div', { class: 'pe-tile__tools' },
        toolButton('◀', 'Déplacer vers la gauche', () => moveItem(item, row, index - 1), index === 0),
        toolButton('▶', 'Déplacer vers la droite', () => moveItem(item, row, index + 2), index === row.items.length - 1),
        toolButton('✕', 'Retirer ce visuel', () => removeItem(item))
      )
    );
    const caption = textArea(item.caption, 'Légende (optionnel)', (value) => {
      item.caption = value;
      updatePreviewText(`caption-${item.id}`, value);
    }, 2);
    caption.classList.add('pe-tile__caption');
    tile.insertBefore(caption, tile.querySelector('.pe-tile__tools'));
    return tile;
  }

  // Refreshes one tile in place (upload progress) without re-rendering the editor
  function updateTile(item) {
    const tile = list.querySelector(`[data-item-id="${item.id}"]`);
    if (!tile) return;
    tile.dataset.state = item.state;
    tile.querySelector('.pe-tile__media').replaceWith(tileMedia(item));
  }

  function renderRowBody(block) {
    const input = el('input', { type: 'file', multiple: true, accept: 'image/jpeg,.jpg,.jpeg,video/mp4,.mp4', class: 'pe-visually-hidden' });
    input.addEventListener('change', () => {
      addFiles(block, input.files);
      input.value = '';
    });

    const grid = el('div', { class: 'pe-row', 'data-row-id': block.id },
      block.items.map((item, i) => renderTile(block, item, i)),
      block.items.length < MAX_ITEMS
        ? el('label', { class: 'pe-add-tile' }, input,
          el('span', { class: 'pe-add-tile__plus' }, '＋'),
          el('span', {}, block.items.length ? 'Ajouter un visuel' : 'Ajouter des visuels'),
          el('small', {}, 'JPG ou MP4 — ou glisser les fichiers ici'))
        : null
    );
    grid.style.setProperty('--cols', Math.max(block.items.length + (block.items.length < MAX_ITEMS ? 1 : 0), 1));

    return [
      grid,
      el('label', { class: 'pe-label mt-3' }, 'Texte sous la rangée ', el('span', { class: 'pe-optional' }, '(optionnel)')),
      textArea(block.text, 'Paragraphe affiché sous ces visuels', (value) => {
        block.text = value;
        updatePreviewText(`text-${block.id}`, value);
      }),
    ];
  }

  // Vimeo link field + status line, shared by the main video and the Vimeo blocks
  function bindVimeoInput(input, status, onchange) {
    const defaultHelp = status.textContent;
    const refresh = () => {
      const value = input.value.trim();
      const id = vimeoId(value);
      status.classList.toggle('is-ok', !!id);
      status.classList.toggle('is-error', !!value && !id);
      status.textContent = !value ? defaultHelp
        : id ? `✓ Vidéo Vimeo n° ${id} reconnue`
          : '⚠ Lien non reconnu : collez un lien du type https://vimeo.com/123456789';
    };
    let timer;
    input.addEventListener('input', () => {
      refresh();
      markDirty();
      clearTimeout(timer);
      timer = setTimeout(() => onchange(toVimeoEmbed(input.value)), 700);
    });
    input.addEventListener('change', () => {
      clearTimeout(timer);
      if (vimeoId(input.value)) input.value = toVimeoEmbed(input.value);
      onchange(toVimeoEmbed(input.value));
    });
    refresh();
  }

  function renderVimeoBody(block) {
    const input = el('input', { type: 'text', class: 'form-control', placeholder: 'https://vimeo.com/341833479', autocomplete: 'off', value: block.url });
    const status = el('p', { class: 'pe-help' }, 'Copiez le lien de la vidéo depuis Vimeo et collez-le ici.');
    bindVimeoInput(input, status, (url) => {
      if (url === block.url) return;
      block.url = url;
      renderPreview();
    });
    return [
      el('label', { class: 'pe-label' }, 'Lien Vimeo'),
      input,
      status,
      el('label', { class: 'pe-label mt-2' }, 'Texte sous la vidéo ', el('span', { class: 'pe-optional' }, '(optionnel)')),
      textArea(block.text, 'Paragraphe affiché sous la vidéo', (value) => {
        block.text = value;
        updatePreviewText(`text-${block.id}`, value);
      }),
    ];
  }

  function renderTextBody(block) {
    return textArea(block.text, 'Texte du paragraphe', (value) => {
      block.text = value;
      updatePreviewText(`text-${block.id}`, value);
    }, 4);
  }

  function blockHasContent(block) {
    return block.text.trim() || block.url || (block.items && block.items.length);
  }

  function moveBlock(block, delta) {
    const i = blocks.indexOf(block);
    const j = i + delta;
    if (j < 0 || j >= blocks.length) return;
    [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    markDirty();
    renderEditor();
    focusBlock(block, false);
  }

  function removeBlock(block) {
    if (blockHasContent(block) && !window.confirm(`Supprimer ce bloc « ${BLOCK_LABELS[block.type]} » et son contenu ?`)) return;
    (block.items || []).slice().forEach(item => {
      if (item.xhr) item.xhr.abort();
      const queued = queue.indexOf(item);
      if (queued >= 0) queue.splice(queued, 1);
    });
    blocks.splice(blocks.indexOf(block), 1);
    markDirty();
    updateSubmitStatus();
    renderEditor();
  }

  function renderBlock(block, index) {
    const count = block.type === 'row' ? el('small', { class: 'pe-block__count' }, `${block.items.length} / ${MAX_ITEMS}`) : null;
    const body = block.type === 'row' ? renderRowBody(block)
      : block.type === 'vimeo' ? renderVimeoBody(block)
        : renderTextBody(block);

    const card = el('div', { class: `pe-block pe-block--${block.type}`, 'data-block-id': block.id },
      el('div', { class: 'pe-block__head' },
        el('span', { class: 'pe-block__num' }, index + 1),
        el('span', { class: 'pe-block__type' }, BLOCK_LABELS[block.type]),
        count,
        el('div', { class: 'pe-block__tools' },
          toolButton('↑', 'Monter ce bloc', () => moveBlock(block, -1), index === 0),
          toolButton('↓', 'Descendre ce bloc', () => moveBlock(block, 1), index === blocks.length - 1),
          toolButton('✕', 'Supprimer ce bloc', () => removeBlock(block))
        )
      ),
      el('div', { class: 'pe-block__body' }, body)
    );
    return card;
  }

  function renderEditor() {
    list.replaceChildren(...blocks.map(renderBlock));
    if (!blocks.length) {
      list.append(el('p', { class: 'pe-empty' }, 'La page ne contient encore que l\'entête. Ajoutez des rangées de visuels, des vidéos ou des paragraphes avec les boutons ci-dessous.'));
    }
    renderPreview();
  }

  function focusBlock(block, flash = true) {
    const card = list.querySelector(`[data-block-id="${block.id}"]`);
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (flash) {
      card.classList.remove('is-flash');
      void card.offsetWidth; // restart the animation
      card.classList.add('is-flash');
    }
  }

  // -------------------- Moving visuals (buttons + drag & drop) -------------------- //

  // Moves item into row `target` at position `index` (index counted before removal)
  function moveItem(item, target, index) {
    const source = rowOfItem(item);
    if (!source) return;
    if (source !== target && target.items.length >= MAX_ITEMS) {
      toast(`Cette rangée contient déjà ${MAX_ITEMS} visuels.`, true);
      return;
    }
    const from = source.items.indexOf(item);
    if (source === target && from < index) index--;
    source.items.splice(from, 1);
    target.items.splice(Math.max(0, Math.min(index, target.items.length)), 0, item);
    markDirty();
    renderEditor();
  }

  let draggedItem = null;

  function clearDropMarkers() {
    list.querySelectorAll('.is-drop-before, .is-drop-after, .is-drop-target').forEach(n => n.classList.remove('is-drop-before', 'is-drop-after', 'is-drop-target'));
  }

  // Position where the dragged visual would land in a row, from the mouse position
  function dropPosition(grid, clientX, clientY) {
    const tiles = Array.from(grid.querySelectorAll('.pe-tile'));
    for (let i = 0; i < tiles.length; i++) {
      const rect = tiles[i].getBoundingClientRect();
      const sameLine = clientY < rect.bottom;
      if (sameLine && clientX < rect.left + rect.width / 2) return { index: i, tile: tiles[i], after: false };
    }
    return { index: tiles.length, tile: tiles[tiles.length - 1], after: true };
  }

  list.addEventListener('dragstart', (e) => {
    const tile = e.target.closest && e.target.closest('.pe-tile');
    if (!tile) return;
    draggedItem = blocks.flatMap(b => b.items || []).find(it => String(it.id) === tile.dataset.itemId) || null;
    tile.classList.add('is-dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', tile.dataset.itemId); // required by Firefox
  });

  list.addEventListener('dragend', () => {
    draggedItem = null;
    list.querySelectorAll('.is-dragging').forEach(n => n.classList.remove('is-dragging'));
    clearDropMarkers();
  });

  const isFileDrag = (e) => Array.from(e.dataTransfer.types || []).includes('Files');

  list.addEventListener('dragover', (e) => {
    const card = e.target.closest('.pe-block--row');
    if (!card) return;
    const row = findBlock(Number(card.dataset.blockId));
    clearDropMarkers();

    if (isFileDrag(e)) {
      e.preventDefault();
      card.classList.add('is-drop-target');
      return;
    }
    if (!draggedItem) return;
    if (row !== rowOfItem(draggedItem) && row.items.length >= MAX_ITEMS) return; // full row: no drop
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const grid = card.querySelector('.pe-row');
    const pos = dropPosition(grid, e.clientX, e.clientY);
    if (pos.tile) pos.tile.classList.add(pos.after ? 'is-drop-after' : 'is-drop-before');
    else card.classList.add('is-drop-target');
  });

  list.addEventListener('dragleave', (e) => {
    if (!list.contains(e.relatedTarget)) clearDropMarkers();
  });

  list.addEventListener('drop', (e) => {
    const card = e.target.closest('.pe-block--row');
    clearDropMarkers();
    if (!card) return;
    const row = findBlock(Number(card.dataset.blockId));
    e.preventDefault();
    if (isFileDrag(e)) {
      addFiles(row, e.dataTransfer.files);
    } else if (draggedItem) {
      const pos = dropPosition(card.querySelector('.pe-row'), e.clientX, e.clientY);
      moveItem(draggedItem, row, pos.index);
    }
  });

  // A file dropped outside a row would make the browser open it and lose the form
  window.addEventListener('dragover', (e) => { if (isFileDrag(e)) e.preventDefault(); });
  window.addEventListener('drop', (e) => { if (isFileDrag(e)) e.preventDefault(); });

  // -------------------- Add buttons -------------------- //

  const newRowInput = el('input', { type: 'file', multiple: true, accept: 'image/jpeg,.jpg,.jpeg,video/mp4,.mp4', class: 'pe-visually-hidden' });
  document.body.append(newRowInput);
  newRowInput.addEventListener('change', () => {
    addFiles(null, newRowInput.files);
    newRowInput.value = '';
    const last = blocks[blocks.length - 1];
    if (last) focusBlock(last);
  });

  document.querySelectorAll('[data-add]').forEach(button => {
    button.addEventListener('click', () => {
      const type = button.dataset.add;
      // "Rangée" opens the file picker directly: the row(s) are created with the chosen files
      if (type === 'row') return newRowInput.click();
      const block = makeBlock(type);
      blocks.push(block);
      markDirty();
      renderEditor();
      focusBlock(block);
      const field = list.querySelector(`[data-block-id="${block.id}"] input, [data-block-id="${block.id}"] textarea`);
      if (field) field.focus({ preventScroll: true });
    });
  });

  // -------------------- Preview -------------------- //
  // Built with the markup of views/project.ejs. Block nodes are cached and only rebuilt when
  // their structure changes, so Vimeo players are not reloaded at every keystroke.

  const previewCache = new Map(); // key -> { signature, node }

  function previewText(key, className) {
    return el('p', { class: className, 'data-preview-text': key });
  }

  function updatePreviewText(key, value) {
    const node = preview.querySelector(`[data-preview-text="${key}"]`);
    if (!node) return;
    node.textContent = (value || '').trim();
    node.hidden = !node.textContent;
  }

  function vimeoFrame(url, extraClass) {
    return el('div', { class: `video-iframe ${extraClass}` },
      el('iframe', { class: 'resp-iframe', src: url, frameborder: '0', allowfullscreen: true, title: 'vimeo-player' }));
  }

  function previewMedia(item) {
    if (item.state !== 'done') {
      return el('div', { class: 'pe-pv-pending' }, item.state === 'error' ? 'Erreur d\'envoi' : 'Envoi en cours…');
    }
    // muted as an attribute: required for autoplay
    return isImage(item.url)
      ? el('img', { class: 'img-fluid w-100', src: cdn(item.url), alt: '' })
      : el('video', { class: 'img-fluid w-100', src: cdn(item.url), muted: '', autoplay: '', loop: '', playsinline: '' });
  }

  function buildPreviewBlock(block) {
    const node = el('div', { class: 'pe-pv-block', 'data-jump': block.id });
    if (block.type === 'row') {
      const cols = ROW_COLS[block.items.length];
      node.append(el('div', { class: 'row gy-4 gx-4 mb-4' },
        block.items.map(item => el('div', { class: cols },
          previewMedia(item),
          previewText(`caption-${item.id}`, 'projet-legende mt-2')
        ))
      ));
    } else if (block.type === 'vimeo') {
      node.append(vimeoId(block.url) ? vimeoFrame(block.url, 'mb-4') : el('div', { class: 'pe-pv-pending pe-pv-pending--video mb-4' }, 'Vidéo Vimeo : lien à renseigner'));
    }
    node.append(previewText(`text-${block.id}`, 'text-white projet-paragraphe mb-4'));
    return node;
  }

  const blockSignature = (block) => block.type === 'row'
    ? `row:${block.items.map(it => `${it.id}.${it.state}.${it.url}`).join('|')}`
    : `${block.type}:${block.url}`;

  function cached(key, signature, build) {
    const entry = previewCache.get(key);
    if (entry && entry.signature === signature) return entry.node;
    const node = build();
    previewCache.set(key, { signature, node });
    return node;
  }

  function buildHeader() {
    const url = toVimeoEmbed(mainVideoInput.value);
    return el('section', { class: 'mb-3', 'data-jump': 'header' },
      vimeoId(url) ? vimeoFrame(url, 'mb-3') : el('div', { class: 'pe-pv-pending pe-pv-pending--video mb-3' }, 'Vidéo principale : lien à renseigner'),
      el('div', { class: 'text-center mt-3' },
        el('h1', { class: 'project_title', 'data-preview-text': 'title' }),
        ['director', 'other_contributors', 'productor'].map(key => el('p', { class: 'project', 'data-preview-text': key }))
      )
    );
  }

  const headerSlot = el('div', {});
  const section2 = el('section', {});
  preview.append(headerSlot, section2);

  function renderPreview() {
    const header = cached('header', `header:${toVimeoEmbed(mainVideoInput.value)}`, buildHeader);
    if (headerSlot.firstChild !== header) headerSlot.replaceChildren(header);

    const nodes = blocks
      .filter(b => b.type !== 'row' || b.items.length)
      .map(b => cached(b.id, blockSignature(b), () => buildPreviewBlock(b)));

    // Only move nodes that are out of place (moving an iframe reloads it)
    nodes.forEach((node, i) => {
      if (section2.children[i] !== node) section2.insertBefore(node, section2.children[i] || null);
    });
    while (section2.children.length > nodes.length) section2.lastChild.remove();

    let empty = preview.querySelector('.pe-pv-empty');
    if (!nodes.length && !empty) preview.append(el('p', { class: 'pe-pv-empty' }, 'Le contenu ajouté apparaîtra ici.'));
    else if (nodes.length && empty) empty.remove();

    // Texts are filled in place
    document.querySelectorAll('[data-preview]').forEach(input => updatePreviewText(input.dataset.preview, input.value));
    blocks.forEach(b => {
      updatePreviewText(`text-${b.id}`, b.text);
      (b.items || []).forEach(it => updatePreviewText(`caption-${it.id}`, it.caption));
    });
  }

  // Scale the preview to the column width (desktop layout, zoomed out)
  new ResizeObserver(() => {
    preview.style.zoom = String(Math.min(1, previewFrame.clientWidth / PREVIEW_WIDTH));
  }).observe(previewFrame);

  // Click in the preview -> matching part of the form
  preview.addEventListener('click', (e) => {
    const target = e.target.closest('[data-jump]');
    if (!target) return;
    if (target.dataset.jump === 'header') {
      mainVideoInput.closest('.pe-card').previousElementSibling.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const block = findBlock(Number(target.dataset.jump));
    if (block) focusBlock(block);
  });

  // -------------------- Header fields -------------------- //

  document.querySelectorAll('[data-preview]').forEach(input => {
    input.addEventListener('input', () => {
      updatePreviewText(input.dataset.preview, input.value);
      markDirty();
    });
  });

  bindVimeoInput(mainVideoInput, document.querySelector('[data-vimeo-status]'), () => renderPreview());
  form.querySelector('#linkedThumbnail').addEventListener('change', markDirty);

  // -------------------- Submit -------------------- //

  function serialize() {
    return blocks.map(b => ({
      type: b.type,
      text: b.text,
      url: b.url,
      items: b.items && b.items.filter(it => it.state === 'done').map(it => ({ url: it.url, caption: it.caption })),
    }));
  }

  form.addEventListener('submit', (e) => {
    if (pendingCount() > 0 || S3.pending() > 0) {
      e.preventDefault();
      window.alert('Des fichiers sont encore en cours d\'envoi. Attendez la fin avant d\'enregistrer.');
      return;
    }
    const failed = blocks.flatMap(b => b.items || []).filter(it => it.state === 'error').length;
    if (failed && !window.confirm(`${failed} fichier(s) n'ont pas pu être envoyés et ne seront pas enregistrés. Enregistrer quand même ?`)) {
      e.preventDefault();
      return;
    }
    mainVideoInput.value = toVimeoEmbed(mainVideoInput.value);
    blocksInput.value = JSON.stringify(serialize());
    dirty = false;
  });

  window.addEventListener('beforeunload', (e) => {
    if (!dirty && !pendingCount()) return;
    e.preventDefault();
    e.returnValue = '';
  });

  renderEditor();
})();
