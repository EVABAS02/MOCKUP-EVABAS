(function () {
  'use strict';

  // ========================================
  // Configuration - Constantes figées
  // ========================================

  const DEVICES = Object.freeze({
    desktop: Object.freeze({ w: 1200, h: 750, bezel: 0, chrome: 40, r: 16 }),
    tablet: Object.freeze({ w: 600, h: 800, bezel: 14, chrome: 0, r: 24 }),
    android: Object.freeze({ w: 390, h: 844, bezel: 16, chrome: 0, r: 40 })
  });

  const PALETTES = [
    ['Capricorne Deep', ['#05100C', '#0B1C15', '#1B3B2B', '#FBB02D', '#4ADE80']],
    ['Warm Bronze (CarlDev)', ['#FFF3EB', '#FFEDD6', '#FF4D4D', '#FBB02D', '#12241C']],
    ['Emerald Prestige', ['#081C15', '#1B4322', '#036666', '#FBB02D', '#EBF2FA']],
    ['Neutre Minimal', ['#E7E1D8', '#20242C', '#8B92A0', '#FFFFFF']],
    ['Sonture Spices', ['#EFE8D8', '#EFCA93', '#AB7D41', '#C3593F', '#AD2F21']],
    ['Sonture Earth', ['#DCBAAE', '#491814', '#62644C', '#95A3A6', '#060666']],
    ['Royal Crimson', ['#5400DE', '#9E2A2B', '#E08F3E', '#B1A7A6', '#FFF8F0']],
    ['Imperial Purple', ['#240046', '#E0AAFF', '#FBB02D', '#ECCAFF', '#03071E']],
    ['Ocean Royale', ['#03045E', '#023EBA', '#00B4D8', '#CAF0F8', '#FBB02D']],
    ['Rose Royale', ['#602437', '#8A2846', '#B9375E', '#FFCAD4', '#E05780']],
    ['Sunset Vibes', ['#E46343', '#FDA54C', '#FFCD74', '#FEF0CB', '#697791']],
    ['Modern Helvetica', ['#EAFC24', '#4A3AFF', '#131318', '#FFFFFF', '#8B92A0']],
    ['Ocean Gradient', ['#2E3192', '#1BFFFF', '#0B1C15', '#FFFFFF']],
    ['Sanguine Sunset', ['#D4145A', '#FBB03B', '#FFF3EB', '#12241C']],
    ['Luscious Lime', ['#009245', '#FCEE21', '#081C15', '#FFFFFF']],
    ['Purple Lake', ['#662D8C', '#ED1E79', '#240046', '#FFFFFF']],
    ['Sweet Morning', ['#FF5F6D', '#FFC371', '#FFF8F0', '#491814']],
    ['Sky Orbit', ['#4E65FF', '#92EFFD', '#03071E', '#FFFFFF']],
    ['Mala Bold Studio', ['#060581', '#DBCDE7', '#FC6E24', '#401A0B', '#C9C444']],
    ['Creative Zaid Slate', ['#DEDEEA', '#BCB9D8', '#8488B5', '#61678B', '#565471']],
    ['Dopely Warm Ochre', ['#FCFCF7', '#ECDCAB', '#DFC57B', '#BF932A', '#9E6200']],
    ['Axiforma Emerald', ['#032221', '#03624C', '#2CC295', '#00DF81', '#F1F7F6']],
    ['Dopely Dark Slate', ['#082032', '#2C394B', '#334756', '#D2D2D2', '#FF4C29']],
    ['Luna Ocean', ['#A7EBF2', '#54ACBF', '#26658C', '#023859', '#011C40']],
    ['Soft Pastels', ['#F7E1E6', '#FFD6A5', '#E6D6F7', '#D6EAD4', '#D0F0ED']],
    ['Hotelo Earth Green', ['#0C3B2E', '#6D9773', '#BB8A52', '#FFBA00', '#F7F8F6']],
    ['Sky Dusk Sunset', ['#9C1F20', '#BD5170', '#F57E27', '#1A123B', '#F5E6D3']]
  ];

  const state = {
    mode: 'device',
    device: 'desktop',
    paletteId: 'p0',
    currentImage: null,
    glassEffect: false
  };

  const elementCache = new Map();

  function getElement(id) {
    if (!elementCache.has(id)) {
      elementCache.set(id, document.getElementById(id));
    }
    return elementCache.get(id);
  }

  const elements = {
    menuToggle: getElement('mk4MenuToggle'),
    sidebar: getElement('mk4Sidebar'),
    overlay: getElement('mk4Overlay'),
    dropZone: getElement('mk4DropZone'),
    canvas: getElement('mk4Canvas'),
    ctx: null,
    fileInput: getElement('mk4File'),
    uploadText: getElement('mk4UploadText'),
    modeSelect: getElement('mk4Mode'),
    glassToggle: getElement('mk4GlassToggle'),
    deviceBox: getElement('mk4DeviceBox'),
    devices: getElement('mk4Devices'),
    paletteBox: getElement('mk4PaletteBox'),
    paletteCount: getElement('mk4PalCount'),
    paletteList: getElement('mk4Palettes'),
    presFields: getElement('mk4PresFields'),
    authorInput: getElement('mk4Author'),
    badgeInput: getElement('mk4Badge'),
    titleInput: getElement('mk4Title'),
    exportBtn: getElement('mk4ExportBtn')
  };

  elements.ctx = elements.canvas.getContext('2d');

  function toggleMenu() {
    const isOpen = elements.sidebar.classList.toggle('open');
    elements.overlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    elements.menuToggle.setAttribute('aria-expanded', isOpen);
  }

  function closeMenu() {
    elements.sidebar.classList.remove('open');
    elements.overlay.classList.remove('active');
    document.body.style.overflow = '';
    elements.menuToggle.setAttribute('aria-expanded', 'false');
  }

  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function luminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  const processedPalettes = PALETTES.map((p, i) => {
    const sorted = p[1].slice().sort((a, b) => luminance(b) - luminance(a));
    return {
      id: 'p' + i,
      name: p[0],
      hex: p[1],
      bg: sorted[0],
      text: sorted[sorted.length - 1],
      accent: p[1][3] || p[1][1]
    };
  });

  const imageScaleCache = new Map();

  function roundRectPath(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  function drawImageFitTop(c, img, x, y, w, h) {
    if (!img) return;
    const cacheKey = `${img.src}-${w}-${h}`;
    let scale, drawH;
    if (imageScaleCache.has(cacheKey)) {
      ({ scale, drawH } = imageScaleCache.get(cacheKey));
    } else {
      scale = w / img.width;
      drawH = img.height * scale;
      imageScaleCache.set(cacheKey, { scale, drawH });
    }
    c.drawImage(img, 0, 0, img.width, img.height, x, y, w, drawH);
  }

  function drawDevice(c, devType, x, y, customWidth = null) {
    const d = DEVICES[devType] || DEVICES.desktop;
    const w = customWidth || d.w;
    let h = customWidth ? (customWidth / d.w) * d.h : d.h;

    if (state.currentImage) {
      const imgRatio = state.currentImage.height / state.currentImage.width;
      h = imgRatio < 1.2 ? w * imgRatio : w * 0.625;
    }

    c.save();
    c.shadowColor = 'rgba(0,0,0, 0.4)';
    c.shadowBlur = 35;
    c.shadowOffsetY = 15;

    if (devType === 'desktop') {
      c.fillStyle = state.glassEffect ? 'rgba(255, 255, 255, 0.15)' : '#12241C';
      c.strokeStyle = state.glassEffect ? 'rgba(255, 255, 255, 0.3)' : 'transparent';
      roundRectPath(c, x, y, w, h + d.chrome, d.r);
      c.fill();
      if (state.glassEffect) c.stroke();
      c.restore();

      [0, 1, 2].forEach((i, idx) => {
        c.beginPath();
        c.arc(x + 20 + i * 20, y + d.chrome / 2, 5, 0, Math.PI * 2);
        c.fillStyle = state.glassEffect ? 'rgba(255,255,255,0.5)' : (idx === 0 ? '#EF4444' : idx === 1 ? '#F59E0B' : '#10B981');
        c.fill();
      });

      c.save();
      roundRectPath(c, x, y + d.chrome, w, h, 0);
      c.clip();
      c.fillStyle = '#FFFFFF';
      c.fillRect(x, y + d.chrome, w, h);
      if (state.currentImage) drawImageFitTop(c, state.currentImage, x, y + d.chrome, w, h);
      c.restore();
    } else {
      c.fillStyle = state.glassEffect ? 'rgba(255, 255, 255, 0.1)' : '#081510';
      c.strokeStyle = state.glassEffect ? 'rgba(255,255,255,0.4)' : '#1B3B2B';
      c.lineWidth = 2;
      roundRectPath(c, x, y, w + d.bezel * 2, h + d.bezel * 2, d.r + d.bezel);
      c.fill();
      if (state.glassEffect) c.stroke();
      c.restore();

      c.save();
      roundRectPath(c, x + d.bezel, y + d.bezel, w, h, d.r);
      c.clip();
      c.fillStyle = '#FFFFFF';
      c.fillRect(x + d.bezel, y + d.bezel, w, h);
      if (state.currentImage) drawImageFitTop(c, state.currentImage, x + d.bezel, y + d.bezel, w, h);
      c.restore();
    }
  }

  let renderRequestId = null;

  function render() {
    if (renderRequestId) {
      cancelAnimationFrame(renderRequestId);
    }
    renderRequestId = requestAnimationFrame(() => {
      const p = processedPalettes.find(x => x.id === state.paletteId) || processedPalettes[0];
      const scale = window.devicePixelRatio || 1;
      const authorName = elements.authorInput.value || "Par Votre Nom";
      let baseW = 1360, baseH = 900;

      if (state.mode === 'fullpage') {
        baseW = 1100;
        baseH = state.currentImage ? Math.max(1200, (state.currentImage.height / state.currentImage.width) * 860 + 160) : 1400;
      } else if (state.mode === 'presentation') {
        const devW = 1040;
        let imgRatio = state.currentImage ? (state.currentImage.height / state.currentImage.width) : 0.625;
        if (imgRatio >= 1.2) imgRatio = 0.625;
        const devH = devW * imgRatio + DEVICES.desktop.chrome;
        baseW = 1400;
        baseH = 220 + devH + 80;
      } else if (state.mode === 'trio') {
        baseW = 1600; baseH = 1050;
      } else if (state.mode === 'device') {
        const imgRatio = state.currentImage ? (state.currentImage.height / state.currentImage.width) : 0.625;
        const effectiveRatio = imgRatio < 1.2 ? imgRatio : 0.625;
        baseH = Math.max(500, DEVICES[state.device].w * effectiveRatio + 160);
      }

      elements.canvas.width = baseW * scale;
      elements.canvas.height = baseH * scale;
      elements.canvas.style.width = baseW + 'px';
      elements.canvas.style.height = baseH + 'px';
      elements.ctx.scale(scale, scale);
      elements.ctx.clearRect(0, 0, baseW, baseH);

      if (state.mode === 'fullpage') {
        elements.ctx.fillStyle = p.bg;
        elements.ctx.fillRect(0, 0, baseW, baseH);
        const imgW = 860;
        const imgH = state.currentImage ? (state.currentImage.height / state.currentImage.width) * imgW : 1100;
        const startX = (baseW - imgW) / 2, startY = 60;
        elements.ctx.save();
        elements.ctx.shadowColor = 'rgba(0,0,0, 0.4)';
        elements.ctx.shadowBlur = 30;
        elements.ctx.shadowOffsetY = 15;
        roundRectPath(elements.ctx, startX, startY, imgW, imgH, 12);
        elements.ctx.fillStyle = '#FFFFFF';
        elements.ctx.fill();
        elements.ctx.restore();
        elements.ctx.save();
        roundRectPath(elements.ctx, startX, startY, imgW, imgH, 12);
        elements.ctx.clip();
        if (state.currentImage) elements.ctx.drawImage(state.currentImage, startX, startY, imgW, imgH);
        elements.ctx.restore();
        elements.ctx.fillStyle = p.text;
        elements.ctx.font = '600 18px "Space Grotesk"';
        elements.ctx.textAlign = 'right';
        elements.ctx.fillText(`Designed & Developed by ${authorName}`, baseW - startX, startY + imgH + 45);
      } else if (state.mode === 'presentation') {
        elements.ctx.fillStyle = p.bg;
        elements.ctx.fillRect(0, 0, baseW, baseH);
        elements.ctx.fillStyle = p.accent;
        roundRectPath(elements.ctx, 80, 50, 140, 38, 19);
        elements.ctx.fill();
        elements.ctx.fillStyle = '#05100C';
        elements.ctx.font = '700 14px Inter';
        elements.ctx.textBaseline = 'middle';
        elements.ctx.fillText(elements.badgeInput.value || "Site Web", 108, 69);
        elements.ctx.fillStyle = p.text;
        elements.ctx.font = '700 48px "Space Grotesk"';
        elements.ctx.textBaseline = 'top';
        elements.ctx.fillText(elements.titleInput.value || "Titre du Projet", 80, 100);
        elements.ctx.font = '500 20px Inter';
        elements.ctx.fillStyle = p.text;
        elements.ctx.globalAlpha = 0.8;
        elements.ctx.fillText(`Par ${authorName}`, 80, 165);
        elements.ctx.globalAlpha = 1.0;
        const devW = 1040;
        const startX = (baseW - devW) / 2;
        drawDevice(elements.ctx, 'desktop', startX, 220, devW);
      } else if (state.mode === 'trio') {
        elements.ctx.fillStyle = p.bg;
        elements.ctx.fillRect(0, 0, baseW, baseH);
        drawDevice(elements.ctx, 'desktop', 280, 100, 1040);
        drawDevice(elements.ctx, 'tablet', 1050, 320, 420);
        drawDevice(elements.ctx, 'android', 120, 380, 260);
        elements.ctx.fillStyle = p.text;
        elements.ctx.font = '700 20px "Space Grotesk"';
        elements.ctx.textAlign = 'center';
        elements.ctx.fillText(`Création originale — ${authorName}`, baseW / 2, baseH - 40);
      } else {
        drawDevice(elements.ctx, state.device, 80, 80);
      }
      renderRequestId = null;
    });
  }

  window.addEventListener('beforeunload', () => {
    if (renderRequestId) {
      cancelAnimationFrame(renderRequestId);
    }
  });

  function initPalettes() {
    const createSwatches = (colors) => {
      return colors.slice(0, 4).map(h => `<span style="background:${h}" aria-hidden="true"></span>`).join('');
    };
    const fragment = document.createDocumentFragment();
    processedPalettes.forEach(p => {
      const div = document.createElement('div');
      div.className = `mk4-palette ${p.id === state.paletteId ? 'active' : ''}`;
      div.dataset.pal = p.id;
      div.setAttribute('role', 'option');
      div.setAttribute('aria-label', `Palette ${p.name}`);
      const swatches = document.createElement('div');
      swatches.className = 'mk4-swatches';
      swatches.innerHTML = createSwatches(p.hex);
      const name = document.createElement('div');
      name.className = 'mk4-palette-name';
      name.textContent = p.name;
      div.appendChild(swatches);
      div.appendChild(name);
      fragment.appendChild(div);
    });
    elements.paletteCount.textContent = processedPalettes.length;
    elements.paletteList.innerHTML = '';
    elements.paletteList.appendChild(fragment);

    elements.paletteList.addEventListener('click', e => {
      const p = e.target.closest('.mk4-palette');
      if (!p) return;
      state.paletteId = p.dataset.pal;
      document.querySelectorAll('.mk4-palette').forEach(x => {
        x.classList.toggle('active', x.dataset.pal === state.paletteId);
      });
      render();
      closeMenu();
    });
  }

  function updateModeUI() {
    const isSpecialMode = ['fullpage', 'presentation', 'trio'].includes(state.mode);
    elements.paletteBox.style.display = isSpecialMode ? 'block' : 'none';
    elements.presFields.style.display = isSpecialMode ? 'flex' : 'none';
    elements.deviceBox.style.display = state.mode === 'device' ? 'block' : 'none';
  }

  function processFile(file) {
    const img = new Image();
    img.onload = () => {
      if (state.currentImage && state.currentImage.src.startsWith('blob:')) {
        URL.revokeObjectURL(state.currentImage.src);
      }
      state.currentImage = img;
      elements.uploadText.innerHTML = `<b>${file.name.slice(0, 18)}...</b><br/>Image chargée`;
      elements.exportBtn.disabled = false;
      render();
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  }

  elements.menuToggle.addEventListener('click', toggleMenu);
  elements.overlay.addEventListener('click', closeMenu);

  elements.fileInput.addEventListener('change', e => {
    if (e.target.files[0]) processFile(e.target.files[0]);
  });

  elements.dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    elements.dropZone.classList.add('active');
  });

  window.addEventListener('dragover', e => {
    e.preventDefault();
    elements.dropZone.classList.add('active');
  });

  elements.dropZone.addEventListener('dragleave', e => {
    if (e.target === elements.dropZone) {
      e.preventDefault();
      elements.dropZone.classList.remove('active');
    }
  });

  window.addEventListener('dragleave', e => {
    if (e.target === elements.dropZone) {
      e.preventDefault();
      elements.dropZone.classList.remove('active');
    }
  });

  window.addEventListener('drop', e => {
    e.preventDefault();
    elements.dropZone.classList.remove('active');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  });

  elements.modeSelect.addEventListener('change', e => {
    state.mode = e.target.value;
    updateModeUI();
    render();
  });

  elements.glassToggle.addEventListener('change', e => {
    state.glassEffect = e.target.checked;
    render();
  });

  elements.devices.addEventListener('click', e => {
    const b = e.target.closest('.mk4-btn-opt');
    if (b) {
      state.device = b.dataset.device;
      document.querySelectorAll('.mk4-btn-opt').forEach(x => {
        x.classList.toggle('active', x === b);
      });
      render();
      closeMenu();
    }
  });

  let inputTimeout;
  function debouncedRender() {
    clearTimeout(inputTimeout);
    inputTimeout = setTimeout(render, 300);
  }

  elements.authorInput.addEventListener('input', debouncedRender);
  elements.badgeInput.addEventListener('input', debouncedRender);
  elements.titleInput.addEventListener('input', debouncedRender);

  elements.exportBtn.addEventListener('click', () => {
    if (!state.currentImage) return;
    const link = document.createElement('a');
    link.download = `mockup-${state.mode}-${Date.now()}.png`;
    link.href = elements.canvas.toDataURL('image/png');
    link.click();
    closeMenu();
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
      render();
    }, 100);
  });

  initPalettes();
  updateModeUI();
  render();

  if (window.innerWidth <= 768) {
    closeMenu();
  }

  window.addEventListener('beforeunload', () => {
    if (renderRequestId) {
      cancelAnimationFrame(renderRequestId);
    }
    clearTimeout(resizeTimeout);
    clearTimeout(inputTimeout);
    if (state.currentImage && state.currentImage.src.startsWith('blob:')) {
      URL.revokeObjectURL(state.currentImage.src);
    }
    imageScaleCache.clear();
    elementCache.clear();
  });
})();
