const state = {
  parent: null,
  children: [],
  activeChildId: null
};

const app = document.getElementById('app');
const nav = document.getElementById('nav');

function closeMobileNav() {
  document.body.classList.remove('nav-open');
  const btn = document.getElementById('navToggle');
  if (btn) {
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', t('nav.openMenu'));
    btn.textContent = '☰';
  }
}

function isAdmin() {
  return state.parent && state.parent.role === 'admin';
}

function renderNav() {
  closeMobileNav();
  nav.innerHTML = '';
  const lang = languageNavHtml();
  if (!getToken()) {
    nav.innerHTML = `<button onclick="go('home')">${t('nav.home')}</button><button onclick="go('login')">${t('nav.login')}</button><button class="nav-cta" onclick="go('register')">${t('nav.register')}</button>${lang}`;
    return;
  }
  const buttons = [
    ['dashboard', t('nav.dashboard')],
    ['add-item', t('nav.listings')],
    ['browse', t('nav.browse')],
    ['exchanges', t('nav.exchanges')]
  ];
  if (isAdmin()) buttons.push(['admin', t('nav.admin')]);
  nav.innerHTML = buttons.map(([r, l]) => `<button onclick="go('${r}')">${l}</button>`).join('') +
    `<button class="secondary" onclick="logout()">${t('nav.logout')}</button>${lang}`;
}

function logout() { clearToken(); state.parent = null; state.children = []; go('home'); }

async function loadMe() {
  if (!getToken()) return;
  const data = await api('/parents/me');
  if (!data.parent) {
    clearToken();
    state.parent = null;
    state.children = [];
    throw new Error(t('errors.accountNotFound'));
  }
  state.parent = data.parent;
  state.children = data.children;
  if (!state.activeChildId && state.children.length) state.activeChildId = state.children[0].id;
}

function childChips(onSelect) {
  return state.children.map(c => `
    <span class="child-chip ${c.id === state.activeChildId ? 'active' : ''}" onclick="(${onSelect})('${c.id}')">
      ${c.avatar_emoji} ${c.display_name}
    </span>
  `).join('');
}

// ---------- ROUTER ----------
async function go(route, params = {}) {
  applyChrome();
  if (route === 'home' && (params.section || params.id)) {
    window.location.hash = `home/${params.section || params.id}`;
  } else if ((route === 'edit-item' || route === 'item-detail' || route === 'exchange-detail' || route === 'admin-family') && params.id) {
    window.location.hash = `${route}/${params.id}`;
  } else {
    window.location.hash = route;
  }
  renderNav();
  try {
    if (route === 'home') return renderHome(params);
    if (route === 'login') return renderLogin();
    if (route === 'register') return renderRegister();

    if (!getToken()) return renderHome();
    await loadMe();
    renderNav();

    if (route === 'dashboard') return await renderDashboard();
    if (route === 'add-item') return await renderAddItem();
    if (route === 'edit-item' || route === 'item-detail') return await renderItemDetail(params.id);
    if (route === 'browse') return renderBrowse();
    if (route === 'exchanges') return renderExchanges();
    if (route === 'exchange-detail') return renderExchangeDetail(params.id);
    if (route === 'admin') return await renderAdmin();
    if (route === 'admin-family') return await renderAdminFamily(params.id);
  } catch (err) {
    if (!getToken()) {
      state.parent = null;
      state.children = [];
      renderNav();
      renderHome();
      const msg = document.getElementById('msg');
      if (msg) msg.innerHTML = `<span class="error">${err.message}</span>`;
      return;
    }
    app.innerHTML = `<div class="card error">⚠ ${err.message}</div>`;
  }
}

function findSwapsNearMe() {
  return getToken() ? go('browse') : go('register');
}

function renderHome(params = {}) {
  app.innerHTML = `
    <section class="page-hero">
      <div class="hero-visual">
        <img src="/img/hero.jpg?v=14" alt="${t('home.heroAlt')}" width="1024" height="471" />
      </div>
      <div class="hero-copy">
        <h1>${t('home.heroTitle')}</h1>
        <p class="lede">${t('home.heroLede')}</p>
        <div class="cta-row">
          <button type="button" class="primary" onclick="findSwapsNearMe()">${t('home.ctaFind')}</button>
          <button type="button" class="ghost" onclick="go('home', {section:'safety'})">${t('home.ctaSafe')}</button>
        </div>
      </div>
    </section>

    <h2 id="how">${t('home.howTitle')}</h2>
    <div class="how-steps">
      <article class="how-step">
        <h2>${t('home.step1Title')}</h2>
        <p>${t('home.step1Body')}</p>
      </article>
      <article class="how-step">
        <h2>${t('home.step2Title')}</h2>
        <p>${t('home.step2Body')}</p>
      </article>
      <article class="how-step">
        <h2>${t('home.step3Title')}</h2>
        <p>${t('home.step3Body')}</p>
      </article>
      <article class="how-step">
        <h2>${t('home.step4Title')}</h2>
        <p>${t('home.step4Body')}</p>
      </article>
    </div>

    <div class="values">
      <div class="value-card mint">
        <h3>${t('home.value1Title')}</h3>
        <p>${t('home.value1Body')}</p>
      </div>
      <div class="value-card yellow">
        <h3>${t('home.value2Title')}</h3>
        <p>${t('home.value2Body')}</p>
      </div>
      <div class="value-card pink">
        <h3>${t('home.value3Title')}</h3>
        <p>${t('home.value3Body')}</p>
      </div>
    </div>

    <div class="band" id="safety">
      <h2>${t('home.safetyTitle')}</h2>
      <ul>
        <li>${t('home.safety1')}</li>
        <li>${t('home.safety2')}</li>
        <li>${t('home.safety3')}</li>
        <li>${t('home.safety4')}</li>
        <li>${t('home.safety5')}</li>
      </ul>
    </div>

    <div class="band">
      <h2>${t('home.duringTitle')}</h2>
      <ol>
        <li>${t('home.during1')}</li>
        <li>${t('home.during2')}</li>
        <li>${t('home.during3')}</li>
        <li>${t('home.during4')}</li>
      </ol>
      <div class="cta-row">
        <button type="button" class="primary" onclick="findSwapsNearMe()">${t('home.ctaFind')}</button>
        <button type="button" class="ghost" onclick="go('login')">${t('home.alreadyAccount')}</button>
      </div>
    </div>
  `;
  const section = params.section || params.id;
  if (section) {
    setTimeout(() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' }), 50);
  }
}

// ---------- AUTH VIEWS ----------
function renderRegister() {
  app.innerHTML = `
    <div class="card">
      ${languagePickerHtml()}
      <button type="button" class="small" onclick="go('home')">${t('auth.back')}</button>
      <h2>${t('auth.registerTitle')}</h2>
      <p class="muted">${t('auth.registerHint')}</p>
      <form id="regForm">
        <input name="name" placeholder="${t('auth.name')}" required />
        <input name="email" type="email" placeholder="${t('auth.email')}" required />
        <input name="password" type="password" placeholder="${t('auth.password')}" required />
        <input name="address_text" placeholder="${t('auth.address')}" />
        <button class="primary" type="submit">${t('auth.createAccount')}</button>
      </form>
      <p id="msg"></p>
    </div>
  `;
  document.getElementById('regForm').onsubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      const data = await api('/parents/register', { method: 'POST', body: Object.fromEntries(f) });
      setToken(data.token);
      go('dashboard');
    } catch (err) {
      document.getElementById('msg').innerHTML = `<span class="error">${err.message}</span>`;
    }
  };
}

function renderLogin() {
  app.innerHTML = `
    <div class="card">
      ${languagePickerHtml()}
      <button type="button" class="small" onclick="go('home')">${t('auth.back')}</button>
      <h2>${t('auth.loginTitle')}</h2>
      <form id="loginForm">
        <input name="email" type="email" placeholder="${t('auth.email')}" required />
        <input name="password" type="password" placeholder="${t('auth.password')}" required />
        <button class="primary" type="submit">${t('auth.logIn')}</button>
      </form>
      <p id="msg"></p>
      <p class="muted">${t('auth.noAccount')} <a href="#" onclick="go('register')">${t('auth.registerLink')}</a></p>
    </div>
  `;
  document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      const data = await api('/parents/login', { method: 'POST', body: Object.fromEntries(f) });
      setToken(data.token);
      go('dashboard');
    } catch (err) {
      document.getElementById('msg').innerHTML = `<span class="error">${err.message}</span>`;
    }
  };
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso) {
  if (!iso) return t('common.unknownDate');
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return t('common.unknownDate');
  return d.toLocaleString(getLang() === 'en' ? 'en-GB' : 'pl-PL', { dateStyle: 'medium', timeStyle: 'short' });
}

function swapStatusLabel(status) {
  const key = `status.${status}`;
  const label = t(key);
  return label === key ? (status || t('status.unknown')) : label;
}

function categoryLabel(cat) {
  if (cat === 'toy') return t('listings.toy');
  if (cat === 'book') return t('listings.book');
  return cat || '';
}

function itemStatusLabel(status) {
  if (!status) return t('listings.available');
  const key = `status.${status}`;
  const label = t(key);
  return label === key ? status : label;
}

function conditionLabel(label) {
  const map = {
    'Like new': 'condition.likeNew',
    'Good': 'condition.good',
    'Fair': 'condition.fair',
    'Worn': 'condition.worn',
    'Not exchangeable': 'condition.notExchangeable',
    'Pending': 'listings.pending'
  };
  return map[label] ? t(map[label]) : (label || t('listings.pending'));
}

function durationLabel(d) {
  if (d === 'forever') return t('exchanges.forever');
  return d || '';
}

function listedItemCardHtml(item) {
  const score = `${escapeHtml(conditionLabel(item.ai_condition_label))} (${item.ai_condition_score ?? '?'}/10)`;
  return `
    <div class="item-card" role="button" tabindex="0" onclick="go('item-detail', {id:'${item.id}'})">
      <div class="item-media">
        ${item.photo_path ? `<img src="${item.photo_path}" alt="" />` : '<div class="item-ph"></div>'}
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <span class="badge ${conditionBadgeClass(item.ai_condition_score || 0)}">${score}</span>
      <div class="item-meta">
        <p class="muted">${item.owner_name ? `${escapeHtml(item.owner_name)} · ` : ''}${escapeHtml(categoryLabel(item.category))} · ${escapeHtml(itemStatusLabel(item.status))}</p>
        <p class="muted">${t('listings.listedOn', { date: formatDate(item.created_at) })}</p>
        <div class="item-actions">
          <button type="button" class="small" onclick="event.stopPropagation(); go('item-detail', {id:'${item.id}'})">${t('listings.openDetails')}</button>
        </div>
      </div>
    </div>
  `;
}

async function fillListedItems(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  try {
    const mine = await api('/items/mine');
    container.innerHTML = mine.length
      ? mine.map(listedItemCardHtml).join('')
      : `<p class="muted">${t('listings.none')}</p>`;
  } catch (err) {
    container.innerHTML = `<p class="error">${err.message}</p>`;
  }
}

async function deleteListing(id) {
  if (!confirm(t('listings.deleteConfirm'))) return;
  try {
    await api(`/items/${id}`, { method: 'DELETE' });
    const route = (window.location.hash || '').replace(/^#/, '').split('/')[0];
    if (route === 'edit-item' || route === 'item-detail') return go('add-item');
    await fillListedItems(route === 'add-item' ? 'myItems' : 'dashItems');
    const result = document.getElementById('result');
    if (result) result.innerHTML = '';
  } catch (err) {
    alert(err.message);
  }
}

// ---------- DASHBOARD ----------
async function renderDashboard() {
  if (!state.parent) return go('login');
  app.innerHTML = `
    <div class="card">
      <h2>${t('dash.welcome', { name: escapeHtml(state.parent?.name || t('dash.there')) })}</h2>
      <p class="muted">${t('dash.childrenHint')}</p>
      <div>${state.children.map(c => `<span class="child-chip">${c.avatar_emoji} ${escapeHtml(c.display_name)} ${c.birth_year ? `(b. ${c.birth_year})` : ''}</span>`).join('') || `<em>${t('dash.noChildren')}</em>`}</div>
    </div>
    <div class="card">
      <div class="card-head">
        <h3>${t('dash.yourListings')}</h3>
        <button type="button" class="small" onclick="go('add-item')">${t('dash.addListing')}</button>
      </div>
      <p class="muted">${t('dash.listingsHint')}</p>
      <div id="dashItems" class="grid"></div>
    </div>
    <div class="card">
      <h3>${t('dash.addChild')}</h3>
      <form id="childForm">
        <input name="display_name" placeholder="${t('dash.childName')}" required />
        <input name="birth_year" type="number" placeholder="${t('dash.birthYear')}" />
        <select name="avatar_emoji">
          <option value="🧒">${t('dash.avatarNeutral')}</option>
          <option value="👦">${t('dash.avatarBoy')}</option>
          <option value="👧">${t('dash.avatarGirl')}</option>
          <option value="🦸">${t('dash.avatarHero')}</option>
        </select>
        <button class="primary" type="submit">${t('dash.addChildBtn')}</button>
      </form>
      <p id="msg"></p>
    </div>
  `;
  document.getElementById('childForm').onsubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      await api('/children', { method: 'POST', body: Object.fromEntries(f) });
      await loadMe();
      await renderDashboard();
    } catch (err) {
      document.getElementById('msg').innerHTML = `<span class="error">${err.message}</span>`;
    }
  };
  await fillListedItems('dashItems');
}

// ---------- ADD ITEM (with AI evaluation + 3D preview) ----------
async function renderAddItem() {
  if (!state.children.length) {
    app.innerHTML = `<div class="card">${t('listings.addChildFirst', { family: t('nav.dashboard') })}</div>`;
    return;
  }
  app.innerHTML = `
    <div class="card">
      <div class="card-head">
        <h2>${t('dash.yourListings')}</h2>
        <button type="button" class="small" onclick="document.getElementById('itemForm').scrollIntoView({behavior:'smooth'})">${t('dash.addListing')}</button>
      </div>
      <p class="muted">${t('listings.tapHint')}</p>
      <div id="myItems" class="grid"></div>
    </div>
    <div class="card">
      <h2>${t('listings.addToy')}</h2>
      <p class="muted">${t('listings.addHint')}</p>
      <div class="row">${t('listings.listingAs')} ${childChips('window.__selectChild')}</div>
      <form id="itemForm">
        <select name="category">
          <option value="toy">${t('listings.toy')}</option>
          <option value="book">${t('listings.book')}</option>
        </select>
        <input name="title" placeholder="${t('listings.titlePh')}" required />
        <textarea name="description" placeholder="${t('listings.descPh')}"></textarea>
        <label for="photo">${t('listings.photoGallery')}</label>
        <input id="photo" type="file" name="photo" accept="image/*" required />
        <button class="primary" type="submit">${t('listings.analyze')}</button>
      </form>
      <p id="msg"></p>
      <div id="result"></div>
    </div>
  `;
  window.__selectChild = (id) => { state.activeChildId = id; renderAddItem(); };

  document.getElementById('itemForm').onsubmit = async (e) => {
    e.preventDefault();
    const msg = document.getElementById('msg');
    msg.innerHTML = t('listings.analyzing');
    const fd = new FormData(e.target);
    fd.append('child_id', state.activeChildId);
    try {
      const item = await api('/items', { method: 'POST', body: fd, isForm: true });
      msg.innerHTML = `<span style="color:green">${t('listings.listed')}</span>`;
      renderItemResult(item);
      await fillListedItems('myItems');
    } catch (err) {
      msg.innerHTML = `<span class="error">${err.message}</span>`;
    }
  };
  await fillListedItems('myItems');
}

function conditionBadgeClass(score) {
  if (score >= 7) return 'good';
  if (score >= 4) return 'fair';
  return 'bad';
}

function renderItemResult(item) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
    <div class="item-card" style="margin-top:16px; max-width: 360px;">
      <div class="item-media">
        ${item.photo_path ? `<img src="${item.photo_path}" />` : '<div class="item-ph"></div>'}
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <span class="badge ${conditionBadgeClass(item.ai_condition_score || 0)}">
        ${escapeHtml(conditionLabel(item.ai_condition_label))} (${item.ai_condition_score ?? '?'}/10)
      </span>
      <div class="item-meta">
        <p>${escapeHtml(item.ai_description || '')}</p>
        <div class="item-actions">
          <button type="button" class="small" onclick="go('item-detail', {id:'${item.id}'})">${t('listings.openDetails')}</button>
          <button type="button" class="danger" onclick="deleteListing('${item.id}')">${t('listings.delete')}</button>
        </div>
        <div class="viewer3d" id="viewer-${item.id}"></div>
      </div>
    </div>
  `;
  if (item.photo_path) render3DPreview(`viewer-${item.id}`, item.photo_path);
}

async function renderItemDetail(id) {
  if (!id) return go('add-item');
  const item = await api(`/items/${id}`);
  const photos = item.photos || [];
  const swaps = item.swaps || [];
  const photoTiles = photos.length
    ? photos.map(p => `
        <div class="photo-tile">
          <img src="${p.photo_path}" alt="" />
          <button type="button" class="danger" onclick="removeListingPhoto('${item.id}', '${p.id}')">${t('detail.removePhoto')}</button>
        </div>
      `).join('')
    : `<p class="muted">${t('detail.noPhotos')}</p>`;
  const swapRows = swaps.length
    ? swaps.map(s => `
        <div class="swap-row">
          <p><strong>${escapeHtml(s.offered_title)}</strong> ↔ <strong>${escapeHtml(s.requested_title)}</strong></p>
          <p class="muted">${escapeHtml(s.from_child_name)} → ${escapeHtml(s.to_child_name)} · ${escapeHtml(swapStatusLabel(s.status))} · ${escapeHtml(durationLabel(s.duration_type))}</p>
          <p class="muted">${escapeHtml(formatDate(s.created_at))}</p>
        </div>
      `).join('')
    : `<p class="muted">${t('detail.noSwaps')}</p>`;

  app.innerHTML = `
    <div class="card">
      <button type="button" class="small" onclick="go('add-item')">${t('detail.back')}</button>
      <h2>${escapeHtml(item.title)}</h2>
      <p class="muted">${t('detail.listedMeta', {
        date: formatDate(item.created_at),
        owner: item.owner_name || '',
        category: categoryLabel(item.category),
        status: itemStatusLabel(item.status)
      })}</p>
      <span class="badge ${conditionBadgeClass(item.ai_condition_score || 0)}">
        ${escapeHtml(conditionLabel(item.ai_condition_label))} (${item.ai_condition_score ?? '?'}/10)
      </span>
      ${item.ai_description ? `<p>${escapeHtml(item.ai_description)}</p>` : ''}
    </div>
    <div class="card">
      <h3>${t('detail.photos')}</h3>
      <div class="photo-grid">${photoTiles}</div>
      <form id="photoForm" class="photo-form">
        <label for="addPhotos">${t('detail.addPhotos')}</label>
        <input id="addPhotos" type="file" name="photos" accept="image/*" multiple />
        <button class="primary" type="submit">${t('detail.addPhotosBtn')}</button>
      </form>
      <p id="photoMsg"></p>
    </div>
    <div class="card">
      <h3>${t('detail.edit')}</h3>
      <form id="editForm">
        <select name="category">
          <option value="toy" ${item.category === 'toy' ? 'selected' : ''}>${t('listings.toy')}</option>
          <option value="book" ${item.category === 'book' ? 'selected' : ''}>${t('listings.book')}</option>
        </select>
        <input name="title" placeholder="${t('detail.title')}" value="${escapeHtml(item.title)}" required />
        <textarea name="description" placeholder="${t('detail.description')}">${escapeHtml(item.description || '')}</textarea>
        <button class="primary" type="submit">${t('detail.save')}</button>
      </form>
      <p id="msg"></p>
    </div>
    <div class="card">
      <h3>${t('detail.swapHistory')}</h3>
      ${swapRows}
    </div>
    <div class="card">
      <button type="button" class="danger" onclick="deleteListing('${item.id}')">${t('detail.deleteListing')}</button>
    </div>
  `;

  document.getElementById('editForm').onsubmit = async (e) => {
    e.preventDefault();
    const msg = document.getElementById('msg');
    const f = new FormData(e.target);
    msg.innerHTML = t('detail.saving');
    try {
      await api(`/items/${item.id}`, {
        method: 'PUT',
        body: {
          title: f.get('title'),
          description: f.get('description'),
          category: f.get('category')
        }
      });
      msg.innerHTML = `<span style="color:green">${t('detail.saved')}</span>`;
      await renderItemDetail(item.id);
    } catch (err) {
      msg.innerHTML = `<span class="error">${err.message}</span>`;
    }
  };

  document.getElementById('photoForm').onsubmit = async (e) => {
    e.preventDefault();
    const msg = document.getElementById('photoMsg');
    const input = document.getElementById('addPhotos');
    if (!input.files.length) {
      msg.innerHTML = `<span class="error">${t('detail.choosePhoto')}</span>`;
      return;
    }
    msg.innerHTML = t('detail.uploading');
    try {
      await api(`/items/${item.id}/photos`, { method: 'POST', body: new FormData(e.target), isForm: true });
      await renderItemDetail(item.id);
    } catch (err) {
      msg.innerHTML = `<span class="error">${err.message}</span>`;
    }
  };
}

async function removeListingPhoto(itemId, photoId) {
  if (!confirm(t('detail.removePhotoConfirm'))) return;
  try {
    await api(`/items/${itemId}/photos/${photoId}`, { method: 'DELETE' });
    await renderItemDetail(itemId);
  } catch (err) {
    alert(err.message);
  }
}

// Lightweight MVP "3D preview": a rotating textured card using the uploaded
// photo. This stands in for a real 3D reconstruction service (Phase 2).
function render3DPreview(containerId, photoUrl) {
  const container = document.getElementById(containerId);
  if (!container || !window.THREE) return;
  const width = container.clientWidth, height = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 3.2;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const loader = new THREE.TextureLoader();
  loader.load(photoUrl, (texture) => {
    const geometry = new THREE.BoxGeometry(2, 2, 0.15);
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0xffffff }),
      new THREE.MeshStandardMaterial({ color: 0xffffff }),
      new THREE.MeshStandardMaterial({ color: 0xffffff }),
      new THREE.MeshStandardMaterial({ color: 0xffffff }),
      new THREE.MeshStandardMaterial({ map: texture }),
      new THREE.MeshStandardMaterial({ map: texture })
    ];
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(2, 2, 4);
    scene.add(light1);
    scene.add(new THREE.AmbientLight(0x888888));

    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.y += 0.012;
      cube.rotation.x = Math.sin(Date.now() * 0.0005) * 0.2;
      renderer.render(scene, camera);
    }
    animate();
  });
}

// ---------- BROWSE NEARBY ----------
async function renderBrowse() {
  if (!state.children.length) {
    app.innerHTML = `<div class="card">${t('listings.addChildFirst', { family: t('nav.dashboard') })}</div>`;
    return;
  }
  app.innerHTML = `
    <div class="card">
      <h2>${t('browse.title')}</h2>
      <div class="row">${t('browse.browsingAs')} ${childChips('window.__selectChildBrowse')}</div>
      <div id="items" class="grid" style="margin-top:16px;"></div>
    </div>
  `;
  window.__selectChildBrowse = (id) => { state.activeChildId = id; renderBrowse(); };
  await loadNearby();
}

async function loadNearby() {
  const data = await api(`/items/nearby?child_id=${state.activeChildId}`);
  const container = document.getElementById('items');
  container.innerHTML = `<p class="muted" style="grid-column:1/-1">${t('browse.within', { km: data.radius_km })}</p>` +
    (data.items.length ? '' : `<p style="grid-column:1/-1">${t('browse.none')}</p>`) +
    data.items.map(item => `
      <div class="item-card">
        <div class="item-media">
          ${item.photo_path ? `<img src="${item.photo_path}" />` : '<div class="item-ph"></div>'}
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <span class="badge ${conditionBadgeClass(item.ai_condition_score || 0)}">${escapeHtml(conditionLabel(item.ai_condition_label))} (${item.ai_condition_score}/10)</span>
        <div class="item-meta">
          <p class="muted">${t('browse.by', { avatar: item.owner_avatar || '', name: item.owner_name || '' })}</p>
          <p class="distance">${t('browse.away', { km: item.distance_km })}</p>
          <div class="item-actions">
            <button class="small" onclick="proposeExchange('${item.id}')">${t('browse.propose')}</button>
          </div>
        </div>
      </div>
    `).join('');
}

async function proposeExchange(requestedItemId) {
  try {
    const mine = await api('/items/mine');
    const myOwn = mine.filter(i => i.child_id === state.activeChildId && i.status === 'available');
    if (!myOwn.length) {
      alert(t('browse.needOwn'));
      return go('add-item');
    }
    const choice = prompt(t('browse.whichOffer', { list: myOwn.map((i, idx) => `${idx + 1}. ${i.title}`).join('\n') }));
    const idx = parseInt(choice, 10) - 1;
    if (isNaN(idx) || !myOwn[idx]) return;

    await api('/exchanges', {
      method: 'POST',
      body: {
        offered_item_id: myOwn[idx].id,
        requested_item_id: requestedItemId,
        from_child_id: state.activeChildId
      }
    });
    alert(t('browse.proposed'));
    go('exchanges');
  } catch (err) {
    alert(err.message);
  }
}

// ---------- EXCHANGES ----------
async function renderExchanges() {
  const list = await api('/exchanges');
  app.innerHTML = `
    <div class="card">
      <h2>${t('exchanges.title')}</h2>
      ${list.length ? '' : `<p class="muted">${t('exchanges.none')}</p>`}
      ${list.map(ex => `
        <div class="card" style="background:#f8f8fb;">
          <div class="row">
            ${ex.offered_photo ? `<img src="${ex.offered_photo}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">` : ''}
            <strong>${ex.offered_title}</strong> ↔
            ${ex.requested_photo ? `<img src="${ex.requested_photo}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">` : ''}
            <strong>${ex.requested_title}</strong>
          </div>
          <p class="muted">${ex.from_child_name} ↔ ${ex.to_child_name} · ${t('exchanges.status')}: <strong>${swapStatusLabel(ex.status)}</strong> · ${durationLabel(ex.duration_type)}</p>
          <div class="row">
            ${ex.status === 'pending_parent_approval' ? `<button class="small" onclick="approveExchange('${ex.id}')">${t('exchanges.approve')}</button><button class="small" style="background:#f44336" onclick="declineExchange('${ex.id}')">${t('exchanges.decline')}</button>` : ''}
            <button class="small" onclick="go('exchange-detail', {id:'${ex.id}'})">${t('exchanges.openChat')}</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

async function approveExchange(id) {
  try {
    const result = await api(`/exchanges/${id}/approve`, { method: 'POST' });
    if (result.status === 'delivery_requested') {
      alert(t('exchanges.bothApproved'));
    }
    renderExchanges();
  } catch (err) { alert(err.message); }
}
async function declineExchange(id) {
  try { await api(`/exchanges/${id}/decline`, { method: 'POST' }); renderExchanges(); }
  catch (err) { alert(err.message); }
}

async function renderExchangeDetail(id) {
  const [messages, canned] = await Promise.all([
    api(`/exchanges/${id}/messages`),
    api('/exchanges/canned-messages')
  ]);
  app.innerHTML = `
    <div class="card">
      <button class="small" onclick="go('exchanges')">${t('exchanges.back')}</button>
      <h2>${t('exchanges.chatTitle')}</h2>
      <div id="chatLog">${messages.map(m => `
        <div class="msg-bubble ${m.sender_child_id === state.activeChildId ? 'mine' : ''}">
          ${m.avatar_emoji} <strong>${m.sender_name}:</strong> ${escapeHtml(tCanned(m.text))}
        </div>
      `).join('') || `<p class="muted">${t('exchanges.noMessages')}</p>`}</div>
      <div class="row" style="margin-top:16px;">${t('exchanges.sendAs')} ${childChips('window.__selectChildChat')}</div>
      <div class="row" style="margin-top:8px; flex-wrap:wrap;">
        ${canned.map(c => `<button class="small" onclick="sendCanned('${id}', ${c.id})">${escapeHtml(tCanned(c.text))}</button>`).join('')}
      </div>
    </div>
  `;
  window.__selectChildChat = (cid) => { state.activeChildId = cid; renderExchangeDetail(id); };
}

async function sendCanned(exchangeId, cannedId) {
  try {
    await api(`/exchanges/${exchangeId}/messages`, {
      method: 'POST',
      body: { sender_child_id: state.activeChildId, canned_message_id: cannedId }
    });
    renderExchangeDetail(exchangeId);
  } catch (err) { alert(err.message); }
}

// ---------- ADMIN ----------
async function renderAdmin() {
  if (!isAdmin()) {
    app.innerHTML = `<div class="card error">${t('admin.required')}</div>`;
    return;
  }
  const [settings, stats, families] = await Promise.all([
    api('/admin/settings'),
    api('/admin/stats'),
    api('/admin/families')
  ]);
  app.innerHTML = `
    <div class="card">
      <h2>${t('admin.settings')}</h2>
      <p class="muted">${t('admin.settingsHint')}</p>
      <form id="radiusForm">
        <label>${t('admin.radius')}</label>
        <input name="radius_km" type="number" min="1" max="500" value="${settings.exchange_radius_km}" />
        <button class="primary" type="submit">${t('admin.updateRadius')}</button>
      </form>
      <p id="msg"></p>
    </div>
    <div class="card">
      <h3>${t('admin.stats')}</h3>
      <ul>
        <li>${t('admin.parents')}: ${stats.parents}</li>
        <li>${t('admin.children')}: ${stats.children}</li>
        <li>${t('admin.items')}: ${stats.items}</li>
        <li>${t('admin.exchanges')}: ${stats.exchanges}</li>
        <li>${t('admin.delivered')}: ${stats.completedExchanges}</li>
      </ul>
    </div>
    <div class="card">
      <h3>${t('admin.families')}</h3>
      <input id="familySearch" placeholder="${t('admin.search')}" />
      <div id="familyList"></div>
    </div>
  `;
  const renderFamilyList = (query = '') => {
    const q = query.trim().toLowerCase();
    const rows = families.filter((f) =>
      !q || `${f.name} ${f.email}`.toLowerCase().includes(q)
    );
    const list = document.getElementById('familyList');
    list.innerHTML = rows.length ? rows.map((f) => `
      <div class="admin-family-row" onclick="go('admin-family', {id:'${f.id}'})">
        <div>
          <strong>${escapeHtml(f.name)}</strong>
          <span class="muted"> · ${escapeHtml(f.email)}</span>
          ${f.role === 'admin' ? '<span class="badge fair">admin</span>' : ''}
          <p class="muted">${escapeHtml(formatDate(f.created_at))}${f.address_text ? ` · ${escapeHtml(f.address_text)}` : ''}</p>
        </div>
        <p class="muted">${t('admin.childrenN', { n: f.children_count })} · ${t('admin.listingsN', { n: f.listings_count })} · ${t('admin.exchangesN', { n: f.exchanges_count })}</p>
      </div>
    `).join('') : `<p class="muted">${t('admin.noMatch')}</p>`;
  };
  renderFamilyList();
  document.getElementById('familySearch').oninput = (e) => renderFamilyList(e.target.value);
  document.getElementById('radiusForm').onsubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      await api('/admin/settings/exchange-radius', { method: 'POST', body: Object.fromEntries(f) });
      document.getElementById('msg').innerHTML = `<span style="color:green">${t('admin.updated')}</span>`;
    } catch (err) {
      document.getElementById('msg').innerHTML = `<span class="error">${err.message}</span>`;
    }
  };
}

function adminListingRow(item) {
  return `
    <div class="admin-item-row">
      ${item.photo_path ? `<img src="${item.photo_path}" alt="" />` : '<div class="admin-item-ph"></div>'}
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <span class="badge ${conditionBadgeClass(item.ai_condition_score || 0)}">${escapeHtml(conditionLabel(item.ai_condition_label))} (${item.ai_condition_score ?? '?'}/10)</span>
        <p class="muted">${escapeHtml(categoryLabel(item.category))} · ${escapeHtml(itemStatusLabel(item.status))} · ${t('admin.listed', { date: formatDate(item.created_at) })}</p>
        ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}
      </div>
    </div>
  `;
}

function adminExchangeRow(ex) {
  return `
    <div class="swap-row">
      <p><strong>${escapeHtml(ex.offered_title)}</strong> ↔ <strong>${escapeHtml(ex.requested_title)}</strong></p>
      <p class="muted">${escapeHtml(ex.from_child_name)} → ${escapeHtml(ex.to_child_name)} · ${escapeHtml(swapStatusLabel(ex.status))} · ${escapeHtml(durationLabel(ex.duration_type))}</p>
      <p class="muted">${escapeHtml(formatDate(ex.created_at))}</p>
    </div>
  `;
}

async function renderAdminFamily(id) {
  if (!isAdmin()) {
    app.innerHTML = `<div class="card error">${t('admin.required')}</div>`;
    return;
  }
  if (!id) return go('admin');
  const data = await api(`/admin/families/${id}`);
  const { parent, children } = data;
  app.innerHTML = `
    <div class="card">
      <button type="button" class="small" onclick="go('admin')">${t('admin.allFamilies')}</button>
      <h2>${escapeHtml(parent.name)}</h2>
      <p class="muted">${escapeHtml(parent.email)} · ${escapeHtml(parent.role)} · ${t('admin.joined', { date: formatDate(parent.created_at) })}</p>
      ${parent.address_text ? `<p class="muted">${t('admin.location', { addr: escapeHtml(parent.address_text) })}</p>` : ''}
    </div>
    ${children.length ? children.map((child) => `
      <div class="card admin-child">
        <h3>${escapeHtml(child.avatar_emoji || '🧒')} ${escapeHtml(child.display_name)}</h3>
        <p class="muted">${t('admin.childProfile')} · ${child.birth_year ? `${t('admin.born', { year: child.birth_year })} · ` : ''}${t('admin.added', { date: formatDate(child.created_at) })}</p>
        <h4>${t('admin.listings', { n: child.listings.length })}</h4>
        ${child.listings.length ? child.listings.map(adminListingRow).join('') : `<p class="muted">${t('admin.noListings')}</p>`}
        <h4>${t('admin.exchangesTitle', { n: child.exchanges.length })}</h4>
        ${child.exchanges.length ? child.exchanges.map(adminExchangeRow).join('') : `<p class="muted">${t('admin.noExchanges')}</p>`}
      </div>
    `).join('') : `<div class="card"><p class="muted">${t('admin.noChildProfiles')}</p></div>`}
  `;
}

// ---------- INIT ----------
document.getElementById('navToggle')?.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  const btn = document.getElementById('navToggle');
  btn.setAttribute('aria-expanded', String(open));
  btn.setAttribute('aria-label', open ? t('nav.closeMenu') : t('nav.openMenu'));
  btn.textContent = open ? '✕' : '☰';
});
renderNav();
const hash = (location.hash || '').replace(/^#/, '');
const [initialRoute, initialId] = hash.split('/');
if (initialRoute) go(initialRoute, initialId ? { id: initialId } : {});
else go(getToken() ? 'dashboard' : 'home');
