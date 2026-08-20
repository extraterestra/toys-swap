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
    btn.setAttribute('aria-label', 'Open menu');
    btn.textContent = '☰';
  }
}

function renderNav() {
  closeMobileNav();
  nav.innerHTML = '';
  if (!getToken()) {
    nav.innerHTML = `<button onclick="go('login')">Parent Login</button><button onclick="go('register')">Register Family</button>`;
    return;
  }
  const buttons = [
    ['dashboard', 'My Family'],
    ['add-item', 'My listings'],
    ['browse', 'Browse Nearby'],
    ['exchanges', 'My Exchanges'],
    ['admin', 'Admin']
  ];
  nav.innerHTML = buttons.map(([r, l]) => `<button onclick="go('${r}')">${l}</button>`).join('') +
    `<button class="secondary" onclick="logout()">Log out</button>`;
}

function logout() { clearToken(); state.parent = null; state.children = []; go('login'); }

async function loadMe() {
  if (!getToken()) return;
  const data = await api('/parents/me');
  if (!data.parent) {
    clearToken();
    state.parent = null;
    state.children = [];
    throw new Error('Account not found. Please log in again.');
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
  if ((route === 'edit-item' || route === 'item-detail' || route === 'exchange-detail') && params.id) {
    window.location.hash = `${route}/${params.id}`;
  } else {
    window.location.hash = route;
  }
  renderNav();
  try {
    if (route === 'login') return renderLogin();
    if (route === 'register') return renderRegister();

    if (!getToken()) return renderLogin();
    await loadMe();

    if (route === 'dashboard') return await renderDashboard();
    if (route === 'add-item') return await renderAddItem();
    if (route === 'edit-item' || route === 'item-detail') return await renderItemDetail(params.id);
    if (route === 'browse') return renderBrowse();
    if (route === 'exchanges') return renderExchanges();
    if (route === 'exchange-detail') return renderExchangeDetail(params.id);
    if (route === 'admin') return renderAdmin();
  } catch (err) {
    if (!getToken()) {
      state.parent = null;
      state.children = [];
      renderNav();
      renderLogin();
      const msg = document.getElementById('msg');
      if (msg) msg.innerHTML = `<span class="error">${err.message}</span>`;
      return;
    }
    app.innerHTML = `<div class="card error">⚠ ${err.message}</div>`;
  }
}

// ---------- AUTH VIEWS ----------
function renderRegister() {
  app.innerHTML = `
    <div class="card">
      <h2>Register Your Family</h2>
      <p class="muted">One account per parent. You'll add your children's profiles after registering.</p>
      <form id="regForm">
        <input name="name" placeholder="Your name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <input name="address_text" placeholder="Neighborhood / postal code (approximate is fine)" />
        <button class="primary" type="submit">Create Account</button>
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
      <h2>Parent Login</h2>
      <form id="loginForm">
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button class="primary" type="submit">Log In</button>
      </form>
      <p id="msg"></p>
      <p class="muted">No account yet? <a href="#" onclick="go('register')">Register your family</a></p>
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
  if (!iso) return 'Unknown date';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Unknown date';
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function swapStatusLabel(status) {
  const labels = {
    pending_parent_approval: 'Waiting for parent approval',
    approved: 'Approved',
    delivery_requested: 'Sent to delivery',
    declined: 'Declined'
  };
  return labels[status] || status || 'Unknown';
}

function listedItemCardHtml(item) {
  return `
    <div class="item-card" role="button" tabindex="0" onclick="go('item-detail', {id:'${item.id}'})">
      ${item.photo_path ? `<img src="${item.photo_path}" alt="" />` : ''}
      <div class="body">
        <h3>${escapeHtml(item.title)}</h3>
        <span class="badge ${conditionBadgeClass(item.ai_condition_score || 0)}">
          ${escapeHtml(item.ai_condition_label || 'Pending')} (${item.ai_condition_score ?? '?'}/10)
        </span>
        <p class="muted">${item.owner_name ? `${escapeHtml(item.owner_name)} · ` : ''}${escapeHtml(item.category || '')} · ${escapeHtml(item.status || 'available')}</p>
        <p class="muted">Listed ${escapeHtml(formatDate(item.created_at))}</p>
        <div class="item-actions">
          <button type="button" class="small" onclick="event.stopPropagation(); go('item-detail', {id:'${item.id}'})">Open details</button>
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
      : '<p class="muted">No toys or books listed yet. Use Add listing below to create one.</p>';
  } catch (err) {
    container.innerHTML = `<p class="error">${err.message}</p>`;
  }
}

async function deleteListing(id) {
  if (!confirm('Delete this listing? This cannot be undone.')) return;
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
      <h2>Welcome, ${escapeHtml(state.parent?.name || 'there')} 👋</h2>
      <p class="muted">Your children's profiles. Add one to get started.</p>
      <div>${state.children.map(c => `<span class="child-chip">${c.avatar_emoji} ${escapeHtml(c.display_name)} ${c.birth_year ? `(b. ${c.birth_year})` : ''}</span>`).join('') || '<em>No children added yet.</em>'}</div>
    </div>
    <div class="card">
      <div class="card-head">
        <h3>Your listings</h3>
        <button type="button" class="small" onclick="go('add-item')">+ Add listing</button>
      </div>
      <p class="muted">Open a toy to see details, swap history, photos, and edit or delete it.</p>
      <div id="dashItems" class="grid"></div>
    </div>
    <div class="card">
      <h3>Add a Child Profile</h3>
      <form id="childForm">
        <input name="display_name" placeholder="Child's first name / nickname" required />
        <input name="birth_year" type="number" placeholder="Birth year (optional)" />
        <select name="avatar_emoji">
          <option value="🧒">🧒 Neutral</option>
          <option value="👦">👦 Boy</option>
          <option value="👧">👧 Girl</option>
          <option value="🦸">🦸 Superhero</option>
        </select>
        <button class="primary" type="submit">Add Child</button>
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
    app.innerHTML = `<div class="card">Add a child profile first from <a href="#" onclick="go('dashboard')">My Family</a>.</div>`;
    return;
  }
  app.innerHTML = `
    <div class="card">
      <div class="card-head">
        <h2>Your listings</h2>
        <button type="button" class="small" onclick="document.getElementById('itemForm').scrollIntoView({behavior:'smooth'})">+ Add listing</button>
      </div>
      <p class="muted">Tap a listing to open its details. Add a new one with the form under the list.</p>
      <div id="myItems" class="grid"></div>
    </div>
    <div class="card">
      <h2>Add a toy or book</h2>
      <p class="muted">Pick a photo from your gallery. Our AI will check its condition and write a friendly description.</p>
      <div class="row">Listing as: ${childChips('window.__selectChild')}</div>
      <form id="itemForm">
        <select name="category">
          <option value="toy">Toy</option>
          <option value="book">Book</option>
        </select>
        <input name="title" placeholder="Title (e.g. Lego Castle)" required />
        <textarea name="description" placeholder="Anything else to add? (optional)"></textarea>
        <label for="photo">Photo from gallery</label>
        <input id="photo" type="file" name="photo" accept="image/*" required />
        <button class="primary" type="submit">Analyze & List</button>
      </form>
      <p id="msg"></p>
      <div id="result"></div>
    </div>
  `;
  window.__selectChild = (id) => { state.activeChildId = id; renderAddItem(); };

  document.getElementById('itemForm').onsubmit = async (e) => {
    e.preventDefault();
    const msg = document.getElementById('msg');
    msg.innerHTML = `Analyzing photo with AI... 🔎`;
    const fd = new FormData(e.target);
    fd.append('child_id', state.activeChildId);
    try {
      const item = await api('/items', { method: 'POST', body: fd, isForm: true });
      msg.innerHTML = `<span style="color:green">Listed! 🎉</span>`;
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
    <div class="item-card" style="margin-top:16px;">
      ${item.photo_path ? `<img src="${item.photo_path}" />` : ''}
      <div class="body">
        <h3>${escapeHtml(item.title)}</h3>
        <span class="badge ${conditionBadgeClass(item.ai_condition_score || 0)}">
          ${escapeHtml(item.ai_condition_label || 'Pending')} (${item.ai_condition_score ?? '?'}/10)
        </span>
        <p>${escapeHtml(item.ai_description || '')}</p>
        <div class="item-actions">
          <button type="button" class="small" onclick="go('item-detail', {id:'${item.id}'})">Open details</button>
          <button type="button" class="danger" onclick="deleteListing('${item.id}')">Delete</button>
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
          <button type="button" class="danger" onclick="removeListingPhoto('${item.id}', '${p.id}')">Remove</button>
        </div>
      `).join('')
    : '<p class="muted">No photos yet.</p>';
  const swapRows = swaps.length
    ? swaps.map(s => `
        <div class="swap-row">
          <p><strong>${escapeHtml(s.offered_title)}</strong> ↔ <strong>${escapeHtml(s.requested_title)}</strong></p>
          <p class="muted">${escapeHtml(s.from_child_name)} → ${escapeHtml(s.to_child_name)} · ${escapeHtml(swapStatusLabel(s.status))} · ${escapeHtml(s.duration_type || '')}</p>
          <p class="muted">${escapeHtml(formatDate(s.created_at))}</p>
        </div>
      `).join('')
    : '<p class="muted">No swap history yet.</p>';

  app.innerHTML = `
    <div class="card">
      <button type="button" class="small" onclick="go('add-item')">← Back to listings</button>
      <h2>${escapeHtml(item.title)}</h2>
      <p class="muted">Listed ${escapeHtml(formatDate(item.created_at))} · ${escapeHtml(item.owner_name || '')} · ${escapeHtml(item.category || '')} · ${escapeHtml(item.status || 'available')}</p>
      <span class="badge ${conditionBadgeClass(item.ai_condition_score || 0)}">
        ${escapeHtml(item.ai_condition_label || 'Pending')} (${item.ai_condition_score ?? '?'}/10)
      </span>
      ${item.ai_description ? `<p>${escapeHtml(item.ai_description)}</p>` : ''}
    </div>
    <div class="card">
      <h3>Photos</h3>
      <div class="photo-grid">${photoTiles}</div>
      <form id="photoForm" class="photo-form">
        <label for="addPhotos">Add photos from gallery</label>
        <input id="addPhotos" type="file" name="photos" accept="image/*" multiple />
        <button class="primary" type="submit">Add photos</button>
      </form>
      <p id="photoMsg"></p>
    </div>
    <div class="card">
      <h3>Edit listing</h3>
      <form id="editForm">
        <select name="category">
          <option value="toy" ${item.category === 'toy' ? 'selected' : ''}>Toy</option>
          <option value="book" ${item.category === 'book' ? 'selected' : ''}>Book</option>
        </select>
        <input name="title" placeholder="Title" value="${escapeHtml(item.title)}" required />
        <textarea name="description" placeholder="Description">${escapeHtml(item.description || '')}</textarea>
        <button class="primary" type="submit">Save description</button>
      </form>
      <p id="msg"></p>
    </div>
    <div class="card">
      <h3>Swap history</h3>
      ${swapRows}
    </div>
    <div class="card">
      <button type="button" class="danger" onclick="deleteListing('${item.id}')">Delete listing</button>
    </div>
  `;

  document.getElementById('editForm').onsubmit = async (e) => {
    e.preventDefault();
    const msg = document.getElementById('msg');
    const f = new FormData(e.target);
    msg.innerHTML = 'Saving...';
    try {
      await api(`/items/${item.id}`, {
        method: 'PUT',
        body: {
          title: f.get('title'),
          description: f.get('description'),
          category: f.get('category')
        }
      });
      msg.innerHTML = `<span style="color:green">Saved!</span>`;
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
      msg.innerHTML = `<span class="error">Choose at least one photo</span>`;
      return;
    }
    msg.innerHTML = 'Uploading...';
    try {
      await api(`/items/${item.id}/photos`, { method: 'POST', body: new FormData(e.target), isForm: true });
      await renderItemDetail(item.id);
    } catch (err) {
      msg.innerHTML = `<span class="error">${err.message}</span>`;
    }
  };
}

async function removeListingPhoto(itemId, photoId) {
  if (!confirm('Remove this photo?')) return;
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
    app.innerHTML = `<div class="card">Add a child profile first from <a href="#" onclick="go('dashboard')">My Family</a>.</div>`;
    return;
  }
  app.innerHTML = `
    <div class="card">
      <h2>Browse Nearby Toys & Books</h2>
      <div class="row">Browsing as: ${childChips('window.__selectChildBrowse')}</div>
      <div id="items" class="grid" style="margin-top:16px;"></div>
    </div>
  `;
  window.__selectChildBrowse = (id) => { state.activeChildId = id; renderBrowse(); };
  await loadNearby();
}

async function loadNearby() {
  const data = await api(`/items/nearby?child_id=${state.activeChildId}`);
  const container = document.getElementById('items');
  container.innerHTML = `<p class="muted">Showing items within ${data.radius_km} km (set by admin).</p>` +
    (data.items.length ? '' : '<p>No items nearby yet — check back soon!</p>') +
    data.items.map(item => `
      <div class="item-card">
        ${item.photo_path ? `<img src="${item.photo_path}" />` : ''}
        <div class="body">
          <h3>${item.title}</h3>
          <span class="badge ${conditionBadgeClass(item.ai_condition_score || 0)}">${item.ai_condition_label} (${item.ai_condition_score}/10)</span>
          <p>${item.ai_description || ''}</p>
          <p class="muted">By ${item.owner_avatar} ${item.owner_name}</p>
          <p class="distance">📍 ${item.distance_km} km away</p>
          <button class="small" onclick="proposeExchange('${item.id}')">Propose Exchange</button>
        </div>
      </div>
    `).join('');
}

async function proposeExchange(requestedItemId) {
  try {
    const mine = await api('/items/mine');
    const myOwn = mine.filter(i => i.child_id === state.activeChildId && i.status === 'available');
    if (!myOwn.length) {
      alert('List one of your own toys/books first so you have something to offer!');
      return go('add-item');
    }
    const choice = prompt(`Which of your items to offer?\n${myOwn.map((i, idx) => `${idx + 1}. ${i.title}`).join('\n')}\n\nEnter number:`);
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
    alert('Exchange proposed! Both parents need to approve it under "My Exchanges".');
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
      <h2>My Exchanges</h2>
      ${list.length ? '' : '<p class="muted">No exchange requests yet.</p>'}
      ${list.map(ex => `
        <div class="card" style="background:#f8f8fb;">
          <div class="row">
            ${ex.offered_photo ? `<img src="${ex.offered_photo}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">` : ''}
            <strong>${ex.offered_title}</strong> ↔
            ${ex.requested_photo ? `<img src="${ex.requested_photo}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">` : ''}
            <strong>${ex.requested_title}</strong>
          </div>
          <p class="muted">${ex.from_child_name} ↔ ${ex.to_child_name} · Status: <strong>${ex.status}</strong> · ${ex.duration_type}</p>
          <div class="row">
            ${ex.status === 'pending_parent_approval' ? `<button class="small" onclick="approveExchange('${ex.id}')">Approve</button><button class="small" style="background:#f44336" onclick="declineExchange('${ex.id}')">Decline</button>` : ''}
            <button class="small" onclick="go('exchange-detail', {id:'${ex.id}'})">Open Chat</button>
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
      alert('Both parents approved! A delivery order has been sent to the delivery app. Parents will be charged only the delivery fee.');
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
      <button class="small" onclick="go('exchanges')">← Back</button>
      <h2>Chat (safe, pre-approved messages only)</h2>
      <div id="chatLog">${messages.map(m => `
        <div class="msg-bubble ${m.sender_child_id === state.activeChildId ? 'mine' : ''}">
          ${m.avatar_emoji} <strong>${m.sender_name}:</strong> ${m.text}
        </div>
      `).join('') || '<p class="muted">No messages yet.</p>'}</div>
      <div class="row" style="margin-top:16px;">Send as: ${childChips('window.__selectChildChat')}</div>
      <div class="row" style="margin-top:8px; flex-wrap:wrap;">
        ${canned.map(c => `<button class="small" onclick="sendCanned('${id}', ${c.id})">${c.text}</button>`).join('')}
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
  const [settings, stats] = await Promise.all([api('/admin/settings'), api('/admin/stats')]);
  app.innerHTML = `
    <div class="card">
      <h2>Admin Settings</h2>
      <p class="muted">MVP note: this page has no separate admin auth yet — restrict access before deploying publicly.</p>
      <form id="radiusForm">
        <label>Exchange visibility radius (km)</label>
        <input name="radius_km" type="number" min="1" max="500" value="${settings.exchange_radius_km}" />
        <button class="primary" type="submit">Update Radius</button>
      </form>
      <p id="msg"></p>
    </div>
    <div class="card">
      <h3>Platform Stats</h3>
      <ul>
        <li>Parents: ${stats.parents}</li>
        <li>Children: ${stats.children}</li>
        <li>Items listed: ${stats.items}</li>
        <li>Exchange requests: ${stats.exchanges}</li>
        <li>Exchanges sent to delivery: ${stats.completedExchanges}</li>
      </ul>
    </div>
  `;
  document.getElementById('radiusForm').onsubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      await api('/admin/settings/exchange-radius', { method: 'POST', body: Object.fromEntries(f) });
      document.getElementById('msg').innerHTML = `<span style="color:green">Updated!</span>`;
    } catch (err) {
      document.getElementById('msg').innerHTML = `<span class="error">${err.message}</span>`;
    }
  };
}

// ---------- INIT ----------
document.getElementById('navToggle')?.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  const btn = document.getElementById('navToggle');
  btn.setAttribute('aria-expanded', String(open));
  btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  btn.textContent = open ? '✕' : '☰';
});
renderNav();
const hash = (location.hash || '').replace(/^#/, '');
const [initialRoute, initialId] = hash.split('/');
if (initialRoute) go(initialRoute, initialId ? { id: initialId } : {});
else go(getToken() ? 'dashboard' : 'login');
