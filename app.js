(function () {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mk4MobileMenuBtn');
  const sidebarMobile = document.getElementById('mk4SidebarMobile');
  const overlay = document.getElementById('mk4Overlay');
  
  function toggleMobileMenu() {
    sidebarMobile.classList.toggle('open');
    overlay.classList.toggle('open');
  }
  
  function closeMobileMenu() {
    sidebarMobile.classList.remove('open');
    overlay.classList.remove('open');
  }
  
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  overlay.addEventListener('click', closeMobileMenu);

  const rawPalettes = [
    // Palettes d'origine
    ['Capricorne Deep', ['#05100C', '#0B1C15', '#1B3B2B', '#FBB02D', '#4ADE80']],
    ['Warm Bronze (CarlDev)', ['#FFF3EB', '#FFEDD6', '#FF4D4D', '#FBB02D', '#12241C']],
    ['Emerald Prestige', ['#081C15', '#1B4322', '#036666', '#FBB02D', '#EBF2FA']],
    ['Neutre Minimal', ['#E7E1D8', '#20242C', '#8B92A0', '#FFFFFF']],

    // Palettes Sonture / Terres & Épices
    ['Sonture Spices', ['#EFE8D8', '#EFCA93', '#AB7D41', '#C3593F', '#AD2F21']],
    ['Sonture Earth', ['#DCBAAE', '#491814', '#62644C', '#95A3A6', '#060666']],

    // Palettes Royal Website
    ['Royal Crimson', ['#5400DE', '#9E2A2B', '#E08F3E', '#B1A7A6', '#FFF8F0']],
    ['Imperial Purple', ['#240046', '#E0AAFF', '#FBB02D', '#ECCAFF', '#03071E']],
    ['Ocean Royale', ['#03045E', '#023EBA', '#00B4D8', '#CAF0F8', '#FBB02D']],
    ['Rose Royale', ['#602437', '#8A2846', '#B9375E', '#FFCAD4', '#E05780']],

    // Palettes Modern & Sunset
    ['Sunset Vibes', ['#E46343', '#FDA54C', '#FFCD74', '#FEF0CB', '#697791']],
    ['Modern Helvetica', ['#EAFC24', '#4A3AFF', '#131318', '#FFFFFF', '#8B92A0']],

    // Palettes Dégradés & Ciel
    ['Ocean Gradient', ['#2E3192', '#1BFFFF', '#0B1C15', '#FFFFFF']],
    ['Sanguine Sunset', ['#D4145A', '#FBB03B', '#FFF3EB', '#12241C']],
    ['Luscious Lime', ['#009245', '#FCEE21', '#081C15', '#FFFFFF']],
    ['Purple Lake', ['#662D8C', '#ED1E79', '#240046', '#FFFFFF']],
    ['Sweet Morning', ['#FF5F6D', '#FFC371', '#FFF8F0', '#491814']],
    ['Sky Orbit', ['#4E65FF', '#92EFFD', '#03071E', '#FFFFFF']],

    // Nouvelles palettes ajoutées
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

  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function luminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  const palettes = rawPalettes.map((p, i) => {
    const sorted = p[1].slice().sort((a, b) => luminance(b) - luminance(a));
    return {
      id: 'p' + i, name: p[0], hex: p[1],
      bg: sorted[0], text: sorted[sorted.length - 1], accent: p[1][3] || p[1][1]
    };
  });

  let mode = 'device', device = 'desktop', paletteId = 'p0', currentImage = null;
  const canvas = document.getElementById('mk4Canvas');
  const ctx = canvas.getContext('2d');

  const DEV = {
    desktop: { w: 1200, h: 750, bezel: 0, chrome: 40, r: 16 },
    tablet: { w: 600, h: 800, bezel: 14, chrome: 0, r: 24 },
    android: { w: 390, h: 844, bezel: 16, chrome: 0, r: 40 }
  };

  // Initialize palettes for desktop
  document.getElementById('mk4PalCount').textContent = palettes.length;
  document.getElementById('mk4Palettes').innerHTML = palettes.map(p => `
    <div class="mk4-palette ${p.id === paletteId ? 'active' : ''}" data-pal="${p.id}">
      <div class="mk4-swatches">${p.hex.slice(0, 4).map(h => `<span style="background:${h}"></span>`).join('')}</div>
      <div class="mk4-palette-name">${p.name}</div>
    </div>`).join('');

  // Initialize palettes for mobile
  document.getElementById('mk4PalCountMobile').textContent = palettes.length;
  document.getElementById('mk4PalettesMobile').innerHTML = palettes.map(p => `
    <div class="mk4-palette ${p.id === paletteId ? 'active' : ''}" data-pal="${p.id}">
      <div class="mk4-swatches">${p.hex.slice(0, 4).map(h => `<span style="background:${h}"></span>`).join('')}</div>
      <div class="mk4-palette-name">${p.name}</div>
    </div>`).join('');

  function handlePaletteClick(e) {
    const p = e.target.closest('.mk4-palette');
    if (!p) return;
    paletteId = p.dataset.pal;
    document.querySelectorAll('.mk4-palette').forEach(x => x.classList.toggle('active', x.dataset.pal === paletteId));
    render();
    closeMobileMenu();
  }

  document.getElementById('mk4Palettes').addEventListener('click', handlePaletteClick);
  document.getElementById('mk4PalettesMobile').addEventListener('click', handlePaletteClick);

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
    const scale = w / img.width;
    const drawW = w;
    const drawH = img.height * scale;
    c.drawImage(img, 0, 0, img.width, img.height, x, y, drawW, drawH);
  }

  function drawDevice(c, devType, x, y, customWidth = null) {
    const d = DEV[devType] || DEV.desktop;
    const isGlass = document.getElementById('mk4GlassToggle').checked;
    const w = customWidth || d.w;

    let h = customWidth ? (customWidth / d.w) * d.h : d.h;
    if (currentImage) {
      const imgRatio = currentImage.height / currentImage.width;
      if (imgRatio < 1.2) {
        h = w * imgRatio;
      } else {
        h = w * 0.625;
      }
    }

    c.save();
    c.shadowColor = 'rgba(0,0,0, 0.4)'; c.shadowBlur = 35; c.shadowOffsetY = 15;

    if (devType === 'desktop') {
      c.fillStyle = isGlass ? 'rgba(255, 255, 255, 0.15)' : '#12241C';
      c.strokeStyle = isGlass ? 'rgba(255, 255, 255, 0.3)' : 'transparent';
      roundRectPath(c, x, y, w, h + d.chrome, d.r);
      c.fill(); if (isGlass) c.stroke();
      c.restore();

      [0, 1, 2].forEach((i, idx) => {
        c.beginPath(); c.arc(x + 20 + i * 20, y + d.chrome / 2, 5, 0, Math.PI * 2);
        c.fillStyle = isGlass ? 'rgba(255,255,255,0.5)' : (idx === 0 ? '#EF4444' : idx === 1 ? '#F59E0B' : '#10B981');
        c.fill();
      });

      c.save();
      roundRectPath(c, x, y + d.chrome, w, h, 0); c.clip();
      c.fillStyle = '#FFFFFF'; c.fillRect(x, y + d.chrome, w, h);
      if (currentImage) drawImageFitTop(c, currentImage, x, y + d.chrome, w, h);
      c.restore();
    } else {
      c.fillStyle = isGlass ? 'rgba(255, 255, 255, 0.1)' : '#081510';
      c.strokeStyle = isGlass ? 'rgba(255,255,255,0.4)' : '#1B3B2B';
      c.lineWidth = 2;
      roundRectPath(c, x, y, w + d.bezel * 2, h + d.bezel * 2, d.r + d.bezel);
      c.fill(); if (isGlass) c.stroke(); c.restore();

      c.save();
      roundRectPath(c, x + d.bezel, y + d.bezel, w, h, d.r); c.clip();
      c.fillStyle = '#FFFFFF'; c.fillRect(x + d.bezel, y + d.bezel, w, h);
      if (currentImage) drawImageFitTop(c, currentImage, x + d.bezel, y + d.bezel, w, h);
      c.restore();
    }
  }

  function render() {
    const p = palettes.find(x => x.id === paletteId) || palettes[0];
    const scale = window.devicePixelRatio || 1;
    const authorName = document.getElementById('mk4Author').value || "Par Votre Nom";
    
    let baseW = 1360, baseH = 900;

    if (mode === 'fullpage') {
      baseW = 1100;
      baseH = currentImage ? Math.max(1200, (currentImage.height / currentImage.width) * 860 + 160) : 1400;
    } else if (mode === 'presentation') {
      const devW = 1040;
      let imgRatio = currentImage ? (currentImage.height / currentImage.width) : 0.625;
      if (imgRatio >= 1.2) imgRatio = 0.625;
      const devH = devW * imgRatio + DEV.desktop.chrome;

      baseW = 1400;
      baseH = 220 + devH + 80;
    } else if (mode === 'trio') {
      baseW = 1600; baseH = 1050;
    } else if (mode === 'device') {
      const imgRatio = currentImage ? (currentImage.height / currentImage.width) : 0.625;
      const effectiveRatio = imgRatio < 1.2 ? imgRatio : 0.625;
      baseH = Math.max(500, DEV[device].w * effectiveRatio + 160);
    }

    canvas.width = baseW * scale;
    canvas.height = baseH * scale;
    canvas.style.width = baseW + 'px';
    canvas.style.height = baseH + 'px';
    
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, baseW, baseH);

    if (mode === 'fullpage') {
      ctx.fillStyle = p.bg; ctx.fillRect(0, 0, baseW, baseH);
      const imgW = 860;
      const imgH = currentImage ? (currentImage.height / currentImage.width) * imgW : 1100;
      const startX = (baseW - imgW) / 2, startY = 60;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0, 0.4)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 15;
      roundRectPath(ctx, startX, startY, imgW, imgH, 12);
      ctx.fillStyle = '#FFFFFF'; ctx.fill();
      ctx.restore();

      ctx.save();
      roundRectPath(ctx, startX, startY, imgW, imgH, 12); ctx.clip();
      if (currentImage) ctx.drawImage(currentImage, startX, startY, imgW, imgH);
      ctx.restore();

      ctx.fillStyle = p.text; ctx.font = '600 18px "Space Grotesk"'; ctx.textAlign = 'right';
      ctx.fillText(`Designed & Developed by ${authorName}`, baseW - startX, startY + imgH + 45);
    } 
    else if (mode === 'presentation') {
      ctx.fillStyle = p.bg; ctx.fillRect(0, 0, baseW, baseH);

      ctx.fillStyle = p.accent;
      roundRectPath(ctx, 80, 50, 140, 38, 19); ctx.fill();
      ctx.fillStyle = '#05100C'; ctx.font = '700 14px Inter'; ctx.textBaseline = 'middle';
      ctx.fillText(document.getElementById('mk4Badge').value || "Site Web", 108, 69);

      ctx.fillStyle = p.text; ctx.font = '700 48px "Space Grotesk"'; ctx.textBaseline = 'top';
      ctx.fillText(document.getElementById('mk4Title').value || "Titre du Projet", 80, 100);

      ctx.font = '500 20px Inter'; ctx.fillStyle = p.text; ctx.globalAlpha = 0.8;
      ctx.fillText(`Par ${authorName}`, 80, 165);
      ctx.globalAlpha = 1.0;

      const devW = 1040;
      const startX = (baseW - devW) / 2;
      drawDevice(ctx, 'desktop', startX, 220, devW);
    } 
    else if (mode === 'trio') {
      ctx.fillStyle = p.bg; ctx.fillRect(0, 0, baseW, baseH);
      drawDevice(ctx, 'desktop', 280, 100, 1040);
      drawDevice(ctx, 'tablet', 1050, 320, 420);
      drawDevice(ctx, 'android', 120, 380, 260);

      ctx.fillStyle = p.text; ctx.font = '700 20px "Space Grotesk"'; ctx.textAlign = 'center';
      ctx.fillText(`Création originale — ${authorName}`, baseW / 2, baseH - 40);
    }
    else {
      drawDevice(ctx, device, 80, 80);
    }
  }

  // Sync mobile and desktop controls
  function syncSelect(idDesktop, idMobile) {
    const desktop = document.getElementById(idDesktop);
    const mobile = document.getElementById(idMobile);
    if (desktop && mobile) {
      desktop.addEventListener('change', () => mobile.value = desktop.value);
      mobile.addEventListener('change', () => { desktop.value = mobile.value; closeMobileMenu(); });
    }
  }
  
  function syncCheckbox(idDesktop, idMobile) {
    const desktop = document.getElementById(idDesktop);
    const mobile = document.getElementById(idMobile);
    if (desktop && mobile) {
      desktop.addEventListener('change', () => mobile.checked = desktop.checked);
      mobile.addEventListener('change', () => { desktop.checked = mobile.checked; closeMobileMenu(); });
    }
  }
  
  function syncInput(idDesktop, idMobile) {
    const desktop = document.getElementById(idDesktop);
    const mobile = document.getElementById(idMobile);
    if (desktop && mobile) {
      desktop.addEventListener('input', () => mobile.value = desktop.value);
      mobile.addEventListener('input', () => { desktop.value = mobile.value; closeMobileMenu(); });
    }
  }
  
  function syncTextArea(idDesktop, idMobile) {
    const desktop = document.getElementById(idDesktop);
    const mobile = document.getElementById(idMobile);
    if (desktop && mobile) {
      desktop.addEventListener('input', () => mobile.value = desktop.value);
      mobile.addEventListener('input', () => { desktop.value = mobile.value; closeMobileMenu(); });
    }
  }
  
  // Sync all controls
  syncSelect('mk4Mode', 'mk4ModeMobile');
  syncCheckbox('mk4GlassToggle', 'mk4GlassToggleMobile');
  syncInput('mk4Author', 'mk4AuthorMobile');
  syncInput('mk4Badge', 'mk4BadgeMobile');
  syncTextArea('mk4Title', 'mk4TitleMobile');
  
  // Sync file upload display
  function updateUploadText(text) {
    const desktopText = document.getElementById('mk4UploadText');
    const mobileText = document.getElementById('mk4UploadTextMobile');
    if (desktopText) desktopText.innerHTML = text;
    if (mobileText) mobileText.innerHTML = text;
  }
  
  // Sync export button state
  function updateExportButtonState(disabled) {
    const desktopBtn = document.getElementById('mk4ExportBtn');
    const mobileBtn = document.getElementById('mk4ExportBtnMobile');
    if (desktopBtn) desktopBtn.disabled = disabled;
    if (mobileBtn) mobileBtn.disabled = disabled;
  }
  
  // Sync device buttons
  function updateDeviceButtons(deviceType) {
    const allButtons = document.querySelectorAll('.mk4-btn-opt[data-device]');
    allButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.device === deviceType);
    });
  }

  document.getElementById('mk4Mode').addEventListener('change', e => {
    mode = e.target.value;
    document.getElementById('mk4ModeMobile').value = mode;
    const isSpecialMode = ['fullpage', 'presentation', 'trio'].includes(mode);
    document.getElementById('mk4PaletteBox').style.display = isSpecialMode ? 'block' : 'none';
    document.getElementById('mk4PresFields').style.display = isSpecialMode ? 'flex' : 'none';
    document.getElementById('mk4DeviceBox').style.display = mode === 'device' ? 'block' : 'none';
    document.getElementById('mk4PaletteBoxMobile').style.display = isSpecialMode ? 'block' : 'none';
    document.getElementById('mk4PresFieldsMobile').style.display = isSpecialMode ? 'flex' : 'none';
    document.getElementById('mk4DeviceBoxMobile').style.display = mode === 'device' ? 'block' : 'none';
    render();
  });

  document.getElementById('mk4ModeMobile').addEventListener('change', e => {
    mode = e.target.value;
    document.getElementById('mk4Mode').value = mode;
    const isSpecialMode = ['fullpage', 'presentation', 'trio'].includes(mode);
    document.getElementById('mk4PaletteBox').style.display = isSpecialMode ? 'block' : 'none';
    document.getElementById('mk4PresFields').style.display = isSpecialMode ? 'flex' : 'none';
    document.getElementById('mk4DeviceBox').style.display = mode === 'device' ? 'block' : 'none';
    document.getElementById('mk4PaletteBoxMobile').style.display = isSpecialMode ? 'block' : 'none';
    document.getElementById('mk4PresFieldsMobile').style.display = isSpecialMode ? 'flex' : 'none';
    document.getElementById('mk4DeviceBoxMobile').style.display = mode === 'device' ? 'block' : 'none';
    render();
    closeMobileMenu();
  });
  
  document.getElementById('mk4GlassToggle').addEventListener('change', () => {
    document.getElementById('mk4GlassToggleMobile').checked = document.getElementById('mk4GlassToggle').checked;
    render();
  });
  
  document.getElementById('mk4GlassToggleMobile').addEventListener('change', () => {
    document.getElementById('mk4GlassToggle').checked = document.getElementById('mk4GlassToggleMobile').checked;
    render();
    closeMobileMenu();
  });
  
  document.getElementById('mk4Badge').addEventListener('input', () => {
    document.getElementById('mk4BadgeMobile').value = document.getElementById('mk4Badge').value;
    render();
  });
  
  document.getElementById('mk4BadgeMobile').addEventListener('input', () => {
    document.getElementById('mk4Badge').value = document.getElementById('mk4BadgeMobile').value;
    render();
    closeMobileMenu();
  });
  
  document.getElementById('mk4Title').addEventListener('input', () => {
    document.getElementById('mk4TitleMobile').value = document.getElementById('mk4Title').value;
    render();
  });
  
  document.getElementById('mk4TitleMobile').addEventListener('input', () => {
    document.getElementById('mk4Title').value = document.getElementById('mk4TitleMobile').value;
    render();
    closeMobileMenu();
  });
  
  document.getElementById('mk4Author').addEventListener('input', () => {
    document.getElementById('mk4AuthorMobile').value = document.getElementById('mk4Author').value;
    render();
  });
  
  document.getElementById('mk4AuthorMobile').addEventListener('input', () => {
    document.getElementById('mk4Author').value = document.getElementById('mk4AuthorMobile').value;
    render();
    closeMobileMenu();
  });

  function handleDeviceClick(e) {
    const b = e.target.closest('.mk4-btn-opt');
    if (b) { 
      device = b.dataset.device; 
      updateDeviceButtons(device);
      render(); 
      closeMobileMenu();
    }
  }
  
  document.getElementById('mk4Devices').addEventListener('click', handleDeviceClick);
  document.getElementById('mk4DevicesMobile').addEventListener('click', handleDeviceClick);

  const dropZone = document.getElementById('mk4DropZone');
  window.addEventListener('dragover', e => { e.preventDefault(); dropZone?.classList.remove('hidden'); });
  window.addEventListener('dragleave', e => { if(e.target === dropZone) dropZone?.classList.add('hidden'); });
  window.addEventListener('drop', e => {
    e.preventDefault(); dropZone?.classList.add('hidden');
    const file = e.dataTransfer.files[0];
    if(file && file.type.startsWith('image/')) processFile(file);
  });
  
  document.getElementById('mk4File').addEventListener('change', e => { if(e.target.files[0]) processFile(e.target.files[0]); });
  document.getElementById('mk4FileMobile').addEventListener('change', e => { if(e.target.files[0]) processFile(e.target.files[0]); });

  function processFile(file) {
    const reader = new FileReader();
    reader.onload = evt => {
      const img = new Image();
      img.onload = () => {
        currentImage = img;
        updateUploadText(`<b>${file.name.slice(0, 18)}...</b><br/>Image chargée`);
        updateExportButtonState(false);
        render();
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }

  function exportImage() {
    if (!currentImage) return;
    const link = document.createElement('a'); 
    link.download = `mockup-${mode}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png'); 
    link.click();
    closeMobileMenu();
  }
  
  document.getElementById('mk4ExportBtn').addEventListener('click', exportImage);
  document.getElementById('mk4ExportBtnMobile').addEventListener('click', exportImage);

  render();
})();