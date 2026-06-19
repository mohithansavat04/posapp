document.addEventListener('DOMContentLoaded', () => {
  const loginModal = document.getElementById('login-modal');
  const loginForm = document.getElementById('login-form');
  const navBtns = document.querySelectorAll('.nav-btn');
  const pageSections = document.querySelectorAll('.page-section');
  const pageTitle = document.getElementById('page-title');
  const logoutBtn = document.getElementById('logout-btn');

  let token = localStorage.getItem('pos_token');

  // Initial Auth Check
  if (!token) {
      loginModal.classList.remove('hidden');
  } else {
      fetchAllData();
  }

  // Handle Login
  if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          try {
              const res = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, password })
              });
              const data = await res.json();
              if (res.ok) {
                  token = data.token;
                  localStorage.setItem('pos_token', token);
                  loginModal.classList.add('hidden');
                  fetchAllData();
              } else alert(data.message || 'Login failed');
          } catch (err) { alert('Server error'); }
      });
  }

  // Handle Logout
  if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
          localStorage.removeItem('pos_token');
          token = null;
          loginModal.classList.remove('hidden');
      });
  }

  // SPA Navigation
  navBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
          e.preventDefault();
          navBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const targetId = btn.getAttribute('data-target');
          pageTitle.innerText = btn.innerText;

          pageSections.forEach(sec => sec.classList.add('hidden'));
          document.getElementById(targetId).classList.remove('hidden');
      });
  });

  // Global Fetch Wrapper
  async function apiFetch(endpoint, options = {}) {
      if (!token) return null;
      options.headers = { ...options.headers, 'Authorization': `Bearer ${token}` };
      const res = await fetch(endpoint, options);
      if (res.status === 401) {
          localStorage.removeItem('pos_token');
          loginModal.classList.remove('hidden');
          return null;
      }
      return res;
  }

  // Fetch All Data
  async function fetchAllData() {
      fetchDashboardStats();
      fetchProducts();
      fetchUsers();
      fetchOrders();
      fetchSettings();
  }

  // Dashboard Stats
  async function fetchDashboardStats() {
      try {
          const [prodRes, ordRes, userRes] = await Promise.all([
              apiFetch('/api/products'), apiFetch('/api/orders'), apiFetch('/api/users')
          ]);
          if (!prodRes) return;
          const products = await prodRes.json();
          const orders = await ordRes.json();
          const users = await userRes.json();

          document.getElementById('stat-products').innerText = products.length || 0;
          document.getElementById('stat-orders').innerText = orders.length || 0;
          
          const statUsers = document.getElementById('stat-users');
          if (statUsers) statUsers.innerText = users.length || 0;
          
          const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
          document.getElementById('stat-revenue').innerText = '₹' + revenue.toFixed(2);
      } catch (e) { console.error('Stat fetch failed', e); }
  }

  // Products
  const addProductForm = document.getElementById('add-product-form');
  const productsTbody = document.getElementById('products-tbody');
  
  async function fetchProducts() {
      const res = await apiFetch('/api/products');
      if (!res) return;
      const products = await res.json();
      productsTbody.innerHTML = products.map(p => `
          <tr>
              <td>${p.barcode}</td>
              <td>${p.name}</td>
              <td>${p.category}</td>
              <td>₹${p.price.toFixed(2)}</td>
              <td>${p.stock}</td>
          </tr>
      `).join('');
  }

  if (addProductForm) {
      addProductForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const payload = {
              name: document.getElementById('prod-name').value,
              barcode: document.getElementById('prod-barcode').value,
              price: parseFloat(document.getElementById('prod-price').value),
              stock: parseInt(document.getElementById('prod-stock').value),
              category: document.getElementById('prod-category').value
          };
          const res = await apiFetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          if (res && res.ok) {
              addProductForm.reset();
              fetchProducts();
              fetchDashboardStats(); // update dashboard count
          } else { alert('Failed to add product'); }
      });
  }

  // Users
  const addUserForm = document.getElementById('add-user-form');
  const usersTbody = document.getElementById('users-tbody');

  async function fetchUsers() {
      const res = await apiFetch('/api/users');
      if (!res) return;
      const users = await res.json();
      usersTbody.innerHTML = users.map(u => `
          <tr>
              <td><span style="text-transform: capitalize; padding: 4px 8px; border-radius: 4px; background: rgba(255,255,255,0.1);">${u.role}</span></td>
              <td>${u.name || '-'}</td>
              <td>${u.phone || '-'}</td>
              <td>${u.email || '-'}</td>
              <td>${u.role === 'staff' ? `ID: <b>${u.staffId}</b> <br> PIN: <b>${u.pin || 'Hashed/Hidden'}</b>` : (u.address || '-')}</td>
          </tr>
      `).join('');
  }

  if (addUserForm) {
      addUserForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const payload = {
              role: document.getElementById('user-role').value,
              name: document.getElementById('user-name').value,
              phone: document.getElementById('user-phone').value,
              email: document.getElementById('user-email').value,
              password: document.getElementById('user-password').value,
              address: document.getElementById('user-address').value
          };
          const res = await apiFetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          if (res && res.ok) {
              const data = await res.json();
              if (data.message === 'Staff created successfully') {
                  alert(`Staff created successfully!\n\nStaff ID: ${data.staffId}\nPIN: ${data.pin}\n\nPlease copy these credentials.`);
              }
              addUserForm.reset();
              const roleSelect = document.getElementById('user-role');
              if(roleSelect) roleSelect.dispatchEvent(new Event('change'));
              fetchUsers();
              fetchDashboardStats();
          } else {
              const err = await res.json();
              alert(err.message || 'Failed to add user'); 
          }
      });
  }

  // Orders
  const ordersTbody = document.getElementById('orders-tbody');
  
  async function fetchOrders() {
      const res = await apiFetch('/api/orders');
      if (!res) return;
      const orders = await res.json();
      ordersTbody.innerHTML = orders.map(o => `
          <tr>
              <td>${o._id.substring(0,8)}...</td>
              <td>${new Date(o.createdAt).toLocaleDateString()}</td>
              <td>${o.items.length} items</td>
              <td>₹${o.total.toFixed(2)}</td>
              <td><span style="text-transform: capitalize;">${o.paymentMethod}</span></td>
          </tr>
      `).join('');
  }

  // Settings
  const settingsForm = document.getElementById('settings-form');
  async function fetchSettings() {
      const res = await apiFetch('/api/settings');
      if (!res) return;
      const settings = await res.json();
      document.getElementById('set-name').value = settings.storeName || '';
      document.getElementById('set-gst').value = settings.gstPercentage || 0;
      document.getElementById('set-phone').value = settings.storePhone || '';
      document.getElementById('set-address').value = settings.storeAddress || '';
      document.getElementById('set-paper').value = settings.printerPaperSize || '80mm';
  }

  if (settingsForm) {
      settingsForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const payload = {
              storeName: document.getElementById('set-name').value,
              gstPercentage: parseFloat(document.getElementById('set-gst').value),
              storePhone: document.getElementById('set-phone').value,
              storeAddress: document.getElementById('set-address').value,
              printerPaperSize: document.getElementById('set-paper').value
          };
          const res = await apiFetch('/api/settings', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          if (res && res.ok) {
              alert('Settings updated successfully!');
          }
      });
  }
});
