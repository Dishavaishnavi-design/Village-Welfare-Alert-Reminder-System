const db = window.db;
const auth = window.auth;
const eligibility = window.eligibility;
const charts = window.charts;
const views = window.views;

// Application State
const state = {
  activeView: 'home',
  activeCitizenTab: 'eligible-schemes',
  activeAdminTab: 'users',
  selectedSchemeFilter: 'all'
};

// Main Entry Point
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Database
  await db.init();

  // Load Lucide Icons
  lucide.createIcons();

  // Setup Global Nav & Theme Controls
  initGlobalControls();

  // Run initial router based on hash link
  router();
  window.addEventListener('hashchange', router);
});

/* ==========================================================================
   GLOBAL UI CONTROLS & ROUTING
   ========================================================================== */

function initGlobalControls() {
  // 1. Dark Mode / Theme Toggle
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('vw_theme') || 'light';
  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeToggleIcons(storedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('vw_theme', newTheme);
    updateThemeToggleIcons(newTheme);
    
    // Redraw charts if active to adjust gridline colors
    triggerChartsRedraw();
  });

  // 2. Mobile Menu Navigation Controls
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const menuClose = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-nav-drawer');

  menuToggle.addEventListener('click', () => drawer.classList.remove('hidden'));
  menuClose.addEventListener('click', () => drawer.classList.add('hidden'));

  // Close drawer when clicking menu items
  const drawerItems = document.querySelectorAll('.drawer-item');
  drawerItems.forEach(item => {
    item.addEventListener('click', () => drawer.classList.add('hidden'));
  });

  // 3. Logout Buttons
  document.getElementById('btn-logout').addEventListener('click', handleLogout);
  document.getElementById('btn-logout-mobile').addEventListener('click', handleLogout);

  // 4. Global Modal Close
  document.getElementById('modal-close').addEventListener('click', hideModal);
  
  // 5. Phone Simulator Home bar Close
  document.getElementById('device-close-bar').addEventListener('click', hideDeviceSim);
  document.querySelector('.phone-back-btn').addEventListener('click', hideDeviceSim);
}

function updateThemeToggleIcons(theme) {
  const moonIcon = document.querySelector('.theme-icon-dark');
  const sunIcon = document.querySelector('.theme-icon-light');
  if (theme === 'dark') {
    moonIcon.classList.add('hidden');
    sunIcon.classList.remove('hidden');
  } else {
    moonIcon.classList.remove('hidden');
    sunIcon.classList.add('hidden');
  }
}

function handleLogout() {
  auth.logout();
  showToast('Portal Access', 'You have been successfully logged out.', 'info');
  window.location.hash = '#home';
  updateHeaderAuthStates();
}

function updateHeaderAuthStates() {
  const isLoggedIn = auth.isLoggedIn();
  const loggedOutActions = document.getElementById('logged-out-actions');
  const loggedInActions = document.getElementById('logged-in-actions');
  
  const authRequiredElements = document.querySelectorAll('.auth-required');
  const guestElements = document.querySelectorAll('.guest-only');
  const loggedInOnlyElements = document.querySelectorAll('.logged-in-only');

  if (isLoggedIn) {
    const user = auth.getCurrentUser();
    
    // Toggle primary blocks
    loggedOutActions.classList.add('hidden');
    loggedInActions.classList.remove('hidden');
    
    // Set user metadata in header
    document.getElementById('nav-user-name').textContent = user.name;
    document.getElementById('nav-user-avatar').textContent = user.name.charAt(0);
    
    const roleBadge = document.getElementById('nav-user-role');
    roleBadge.textContent = user.role;
    roleBadge.className = 'badge badge-role';
    if (user.role === 'admin') roleBadge.classList.add('badge-danger');
    else if (user.role === 'volunteer') roleBadge.classList.add('badge-success');
    else roleBadge.classList.add('badge-info');

    // Show/hide specific links based on role
    authRequiredElements.forEach(el => el.classList.add('hidden'));
    
    const roleNavs = document.querySelectorAll(`.${user.role}-only`);
    roleNavs.forEach(el => el.classList.remove('hidden'));

    loggedInOnlyElements.forEach(el => el.classList.remove('hidden'));
    guestElements.forEach(el => el.classList.add('hidden'));
  } else {
    loggedOutActions.classList.remove('hidden');
    loggedInActions.classList.add('hidden');

    authRequiredElements.forEach(el => el.classList.add('hidden'));
    loggedInOnlyElements.forEach(el => el.classList.add('hidden'));
    guestElements.forEach(el => el.classList.remove('hidden'));
  }
}

// Client Side Router
function router() {
  let hash = window.location.hash || '#home';
  state.activeView = hash.split('-')[0].replace('#', '');
  
  // Guard Dashboard page based on login role
  if (hash === '#dashboard') {
    const user = auth.getCurrentUser();
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    window.location.hash = `#${user.role}-dashboard`;
    return;
  }

  // Check login states for protected views
  const protectedViews = ['citizen-dashboard', 'volunteer-dashboard', 'admin-dashboard'];
  const currentView = hash.replace('#', '');
  if (protectedViews.includes(currentView)) {
    const user = auth.getCurrentUser();
    if (!user) {
      window.location.hash = '#login';
      return;
    }
    // Verify role permissions
    if (currentView === 'citizen-dashboard' && user.role !== 'citizen') {
      window.location.hash = `#${user.role}-dashboard`;
      return;
    }
    if (currentView === 'volunteer-dashboard' && user.role !== 'volunteer') {
      window.location.hash = `#${user.role}-dashboard`;
      return;
    }
    if (currentView === 'admin-dashboard' && user.role !== 'admin') {
      window.location.hash = `#${user.role}-dashboard`;
      return;
    }
  }

  // Update navigation items active state
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.drawer-item').forEach(el => el.classList.remove('active'));
  
  const activeNavItem = document.getElementById(`nav-${currentView}`);
  if (activeNavItem) activeNavItem.classList.add('active');

  // Render view templates
  const appView = document.getElementById('app-view');
  
  switch(currentView) {
    case 'home':
      appView.innerHTML = views.renderHome();
      initHomeView();
      break;
    case 'register':
      appView.innerHTML = views.renderRegister();
      initRegisterView();
      break;
    case 'login':
      appView.innerHTML = views.renderLogin();
      initLoginView();
      break;
    case 'citizen-dashboard':
      const citizenUser = auth.getCurrentUser();
      appView.innerHTML = views.renderCitizenDashboard(citizenUser);
      initCitizenDashboardView(citizenUser);
      break;
    case 'volunteer-dashboard':
      appView.innerHTML = views.renderVolunteerDashboard();
      initVolunteerDashboardView();
      break;
    case 'admin-dashboard':
      appView.innerHTML = views.renderAdminDashboard();
      initAdminDashboardView();
      break;
    case 'schemes':
      appView.innerHTML = views.renderSchemesCatalog();
      initSchemesCatalogView();
      break;
    case 'alerts':
      const currentUser = auth.getCurrentUser();
      const userId = currentUser ? currentUser.id : null;
      const userNotifs = db.getUserNotifications(userId || 'all');
      appView.innerHTML = views.renderAlertsPage(userNotifs);
      initAlertsView();
      break;
    case 'faq':
      appView.innerHTML = views.renderFAQ();
      initFAQView();
      break;
    case 'about':
      appView.innerHTML = views.renderAbout();
      break;
    default:
      window.location.hash = '#home';
  }

  // Update headers links visibility
  updateHeaderAuthStates();
  lucide.createIcons();
}

/* ==========================================================================
   VIEW CONTROLLER LIFECYCLES
   ========================================================================== */

// 1. Home View
function initHomeView() {
  const form = document.getElementById('home-contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Contact Desk', 'Thank you! Your message has been sent to the ward assistance officer.', 'success');
      form.reset();
    });
  }
}

// 2. Register View
function initRegisterView() {
  const form = document.getElementById('citizen-register-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = {
        name: document.getElementById('reg-name').value,
        mobile: document.getElementById('reg-mobile').value,
        aadhaar: document.getElementById('reg-aadhaar').value,
        village: document.getElementById('reg-village').value,
        age: document.getElementById('reg-age').value,
        gender: document.getElementById('reg-gender').value,
        occupation: document.getElementById('reg-occupation').value,
        category: document.getElementById('reg-category').value,
        password: document.getElementById('reg-password').value
      };

      const result = auth.registerCitizen(formData);
      if (result.success) {
        showToast('Registration Success', `Welcome, ${formData.name}! Your account is created.`, 'success');
        
        // Trigger simulation alerts upon new registration (Aadhaar linked warning)
        setTimeout(() => {
          triggerSimulatedReminder('aadhaar', result.user.id);
        }, 1500);

        window.location.hash = '#citizen-dashboard';
      } else {
        showToast('Registration Error', result.message, 'danger');
      }
    });
  }
}

// 3. Login View
function initLoginView() {
  const form = document.getElementById('portal-login-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const key = document.getElementById('login-key').value;
      const pass = document.getElementById('login-password').value;

      const result = auth.login(key, pass);
      if (result.success) {
        showToast('Access Granted', `Welcome back, ${result.user.name}.`, 'success');
        window.location.hash = `#${result.user.role}-dashboard`;
      } else {
        showToast('Access Denied', result.message, 'danger');
      }
    });
  }
}

// 4. Citizen Dashboard View
function initCitizenDashboardView(citizenUser) {
  const tabsContainer = document.getElementById('citizen-dashboard-tabs-content');
  
  // Tab buttons
  const tabEligible = document.getElementById('tab-eligible-schemes');
  const tabNotif = document.getElementById('tab-my-notifications');
  const tabApp = document.getElementById('tab-my-applications');
  const tabReminders = document.getElementById('tab-reminder-logs');

  const tabs = [tabEligible, tabNotif, tabApp, tabReminders];

  function clearActiveTabs() {
    tabs.forEach(t => t.classList.remove('active'));
  }

  // Mount listeners for tabs
  tabEligible.addEventListener('click', () => {
    clearActiveTabs();
    tabEligible.classList.add('active');
    state.activeCitizenTab = 'eligible-schemes';
    
    // Refresh eligible schemes list
    const profile = citizenUser.profile;
    const evaluated = eligibility.evaluateAll(profile, db.getSchemes());
    const apps = db.getCitizenApplications(citizenUser.id);
    
    tabsContainer.innerHTML = views.renderCitizenEligibleSchemes(evaluated, apps);
    attachCitizenDashboardActions(citizenUser);
  });

  tabNotif.addEventListener('click', () => {
    clearActiveTabs();
    tabNotif.classList.add('active');
    state.activeCitizenTab = 'notifications';
    
    const notifications = db.getUserNotifications(citizenUser.id);
    tabsContainer.innerHTML = views.renderCitizenNotifications(notifications);
    attachCitizenDashboardActions(citizenUser);
  });

  tabApp.addEventListener('click', () => {
    clearActiveTabs();
    tabApp.classList.add('active');
    state.activeCitizenTab = 'applications';
    
    const apps = db.getCitizenApplications(citizenUser.id);
    tabsContainer.innerHTML = views.renderCitizenApplications(apps);
  });

  tabReminders.addEventListener('click', () => {
    clearActiveTabs();
    tabReminders.classList.add('active');
    state.activeCitizenTab = 'reminders';
    
    const reminders = db.getCitizenReminders(citizenUser.id);
    tabsContainer.innerHTML = views.renderCitizenReminders(reminders);
  });

  // Attach immediate actions inside loaded tab
  attachCitizenDashboardActions(citizenUser);
}

function attachCitizenDashboardActions(citizenUser) {
  // 1. Details instructions trigger
  const detailsBtns = document.querySelectorAll('.view-scheme-details');
  detailsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const schemeId = btn.getAttribute('data-id');
      const scheme = db.getSchemeById(schemeId);
      if (scheme) {
        showModal(
          scheme.scheme_name,
          `
            <div class="flex flex-col gap-3">
              <p><strong>Benefits:</strong> ${scheme.benefits}</p>
              <p><strong>Last Date to Apply:</strong> <span class="text-danger font-semibold">${scheme.deadline}</span></p>
              <p><strong>Eligibility Criteria:</strong> ${scheme.eligibility_criteria}</p>
              <div class="p-3 bg-light rounded mt-2 border" style="background-color: var(--background-color);">
                <h5 class="font-bold text-sm mb-1">Step-by-Step Instructions:</h5>
                <p class="text-xs text-muted" style="line-height: 1.5;">${scheme.apply_instructions}</p>
              </div>
            </div>
          `
        );
      }
    });
  });

  // 2. Application Submission button
  const applyBtns = document.querySelectorAll('.apply-scheme-btn');
  applyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const schemeId = btn.getAttribute('data-id');
      const scheme = db.getSchemeById(schemeId);
      
      // Perform submission
      const newApp = {
        citizen_id: citizenUser.id,
        scheme_id: schemeId,
        status: 'applied'
      };
      
      db.saveApplication(newApp);
      showToast('Welfare Application', `Applied successfully to ${scheme.scheme_name}!`, 'success');
      
      // Simulate confirmation SMS
      setTimeout(() => {
        db.saveReminder({
          citizen_id: citizenUser.id,
          scheme_id: schemeId,
          notification_type: 'application',
          channel: 'sms'
        });
        
        triggerSimulatedSMS(
          'Gov-Welfare',
          `VWARS Alert: Laxmi Devi, your application for "${scheme.scheme_name}" has been received. Status: PENDING verification. Ward volunteer will audit shortly.`
        );
      }, 1000);

      // Refresh Dashboard Tab
      document.getElementById('tab-eligible-schemes').click();
    });
  });

  // 3. Mark Notification Read
  const readBtns = document.querySelectorAll('.mark-read-btn');
  readBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const notifId = btn.getAttribute('data-id');
      db.markNotificationAsRead(notifId);
      showToast('Alert Center', 'Notification marked as read.', 'info');
      
      // Refresh Dashboard Tab
      document.getElementById('tab-my-notifications').click();
      
      // Refresh notifications counter in header/drawer
      updateHeaderAuthStates();

      // Refresh sidebar notification badge count
      const notifications = db.getUserNotifications(citizenUser.id);
      const unreadCount = notifications.filter(n => n.status === 'unread').length;
      const badgeEl = document.querySelector('#tab-my-notifications .badge');
      if (badgeEl) {
        badgeEl.textContent = unreadCount;
        if (unreadCount > 0) {
          badgeEl.className = 'badge badge-danger ml-auto';
        } else {
          badgeEl.className = 'badge badge-info ml-auto';
        }
      }
    });
  });
  
  lucide.createIcons();
}

// 5. Schemes Catalog View
function initSchemesCatalogView() {
  const grid = document.getElementById('schemes-catalog-grid');
  const searchInput = document.getElementById('scheme-search-input');
  
  const schemes = db.getSchemes();

  function filterAndRender() {
    const query = searchInput.value.toLowerCase();
    const activeCat = state.selectedSchemeFilter;

    const filtered = schemes.filter(s => {
      const matchesSearch = s.scheme_name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query);
      const matchesCategory = activeCat === 'all' || s.eligibility_rules.categories.includes(activeCat);
      return matchesSearch && matchesCategory;
    });

    grid.innerHTML = views.renderSchemesGridItems(filtered);

    // Attach Details bindings
    grid.querySelectorAll('.view-scheme-details').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const scheme = db.getSchemeById(id);
        if (scheme) {
          showModal(
            scheme.scheme_name,
            `<div class="flex flex-col gap-3">
              <p><strong>Benefits:</strong> ${scheme.benefits}</p>
              <p><strong>Apply Deadline:</strong> <span class="text-danger font-semibold">${scheme.deadline}</span></p>
              <p><strong>Eligibility:</strong> ${scheme.eligibility_criteria}</p>
              <div class="p-3 bg-light rounded mt-2 border" style="background-color: var(--background-color);">
                <h5 class="font-bold text-sm mb-1">Step-by-Step Instructions:</h5>
                <p class="text-xs text-muted" style="line-height: 1.5;">${scheme.apply_instructions}</p>
              </div>
             </div>`
          );
        }
      });
    });
  }

  // Attach search listeners
  searchInput.addEventListener('input', filterAndRender);

  // Attach category button listeners
  const filterBtns = document.querySelectorAll('.filter-category-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline');
      });
      btn.classList.add('btn-primary');
      btn.classList.remove('btn-outline');
      
      state.selectedSchemeFilter = btn.getAttribute('data-category');
      filterAndRender();
    });
  });

  // Initial render
  filterAndRender();
}

// 6. Volunteer Dashboard View
function initVolunteerDashboardView() {
  const citizensTableBody = document.querySelector('#volunteer-citizens-table tbody');
  const searchInput = document.getElementById('vol-citizen-search');

  // Load Volunteer stats
  renderVolunteerStats();

  // Load Directory
  renderVolunteerCitizensTable();

  // Add Citizen Modal trigger
  document.getElementById('btn-add-citizen-modal').addEventListener('click', () => {
    showModal(
      'Add Citizen Record',
      `
        <form id="vol-add-citizen-form" class="flex flex-col gap-3">
          <div class="grid grid-2">
            <div class="form-group m-0">
              <label class="form-label text-xs">Full Name</label>
              <input type="text" id="add-name" class="form-control text-sm" placeholder="Full name" required>
            </div>
            <div class="form-group m-0">
              <label class="form-label text-xs">Mobile Number</label>
              <input type="tel" id="add-mobile" class="form-control text-sm" placeholder="10-digit number" required>
            </div>
          </div>

          <div class="grid grid-2">
            <div class="form-group m-0">
              <label class="form-label text-xs">Aadhaar Number</label>
              <input type="text" id="add-aadhaar" class="form-control text-sm" placeholder="12-digit Aadhaar" required>
            </div>
            <div class="form-group m-0">
              <label class="form-label text-xs">Village</label>
              <select id="add-village" class="form-control text-sm" required>
                <option value="Digital Gram">Digital Gram Panchayat</option>
                <option value="Agri Village">Agri Village Ward</option>
              </select>
            </div>
          </div>

          <div class="grid grid-3">
            <div class="form-group m-0">
              <label class="form-label text-xs">Age</label>
              <input type="number" id="add-age" class="form-control text-sm" required>
            </div>
            <div class="form-group m-0">
              <label class="form-label text-xs">Gender</label>
              <select id="add-gender" class="form-control text-sm" required>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="form-group m-0">
              <label class="form-label text-xs">Occupation</label>
              <input type="text" id="add-occupation" class="form-control text-sm" placeholder="e.g. Farmer" required>
            </div>
          </div>

          <div class="form-group m-0">
            <label class="form-label text-xs">Category</label>
            <select id="add-category" class="form-control text-sm" required>
              <option value="student">Student</option>
              <option value="farmer">Farmer</option>
              <option value="senior_citizen">Senior Citizen</option>
              <option value="widow">Widow</option>
              <option value="disabled">Disabled</option>
              <option value="general">General</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary w-full mt-2">Submit Record</button>
        </form>
      `
    );

    // Bind form submit inside modal
    document.getElementById('vol-add-citizen-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const citizenData = {
        name: document.getElementById('add-name').value,
        mobile: document.getElementById('add-mobile').value,
        aadhaar: document.getElementById('add-aadhaar').value,
        village: document.getElementById('add-village').value,
        age: document.getElementById('add-age').value,
        gender: document.getElementById('add-gender').value,
        occupation: document.getElementById('add-occupation').value,
        category: document.getElementById('add-category').value,
        password: 'citizen123' // Default password
      };

      const result = auth.registerCitizen(citizenData);
      if (result.success) {
        showToast('Volunteer Panel', `Created profile for ${citizenData.name}.`, 'success');
        hideModal();
        
        // Refresh volunteer dashboard views
        renderVolunteerStats();
        renderVolunteerCitizensTable();
      } else {
        showToast('Volunteer Error', result.message, 'danger');
      }
    });
  });

  // Volunteer Broadcast Form submit
  document.getElementById('volunteer-broadcast-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const target = document.getElementById('broad-target').value;
    const title = document.getElementById('broad-title').value;
    const msg = document.getElementById('broad-msg').value;

    // Collect targeted users from DB
    const users = db.getUsers();
    let targetUsers = [];

    if (target === 'all') {
      targetUsers = users.filter(u => u.role === 'citizen');
    } else {
      const citizens = db.getCitizens();
      const matchedCitizenIds = citizens.filter(c => c.category === target).map(c => c.id);
      targetUsers = users.filter(u => matchedCitizenIds.includes(u.id));
    }

    if (targetUsers.length === 0) {
      showToast('Broadcast Failed', 'No citizens matching selected category.', 'warning');
      return;
    }

    // Save notifications to DB
    if (target === 'all') {
      db.saveNotification({
        user_id: 'all',
        title: `📢 ${title}`,
        message: msg,
        type: 'all',
        delivery_method: 'in_app'
      });
    }

    targetUsers.forEach(u => {
      if (target !== 'all') {
        db.saveNotification({
          user_id: u.id,
          title: `📣 ${title}`,
          message: msg,
          type: target,
          delivery_method: 'sms'
        });
      }
      
      // Save reminder logs
      db.saveReminder({
        citizen_id: u.id,
        scheme_id: 'sch_9',
        notification_type: 'volunteer_alert',
        channel: 'sms'
      });
    });

    showToast('Broadcast Sent', `Alert sent to ${targetUsers.length} citizens.`, 'success');
    
    // Simulate SMS for the active citizen
    const activeCitizen = targetUsers.find(u => u.id === 'user_citizen');
    if (activeCitizen) {
      setTimeout(() => {
        triggerSimulatedSMS('Sachivalayam-Alert', msg);
      }, 1000);
    }

    document.getElementById('broad-title').value = '';
    document.getElementById('broad-msg').value = '';
    renderVolunteerStats();
  });

  // Search filter
  searchInput.addEventListener('input', renderVolunteerCitizensTable);

  // Load chart graphics
  const citizens = db.getCitizens();
  const statusCounts = { Verified: 0, Pending: 0, Rejected: 0 };
  citizens.forEach(c => {
    if (c.eligibility_status === 'verified') statusCounts.Verified++;
    else if (c.eligibility_status === 'pending') statusCounts.Pending++;
    else statusCounts.Rejected++;
  });
  
  charts.renderEligibilityStatusChart('vol-caseload-chart', statusCounts);
}

function renderVolunteerStats() {
  const citizens = db.getCitizens();
  const notifs = db.getNotifications().filter(n => n.user_id !== 'all').length;

  document.getElementById('vol-stat-citizens').textContent = citizens.length;
  document.getElementById('vol-stat-pending').textContent = citizens.filter(c => c.eligibility_status === 'pending').length;
  document.getElementById('vol-stat-alerts').textContent = notifs;
}

function renderVolunteerCitizensTable() {
  const citizensBody = document.querySelector('#volunteer-citizens-table tbody');
  if (!citizensBody) return;

  const query = document.getElementById('vol-citizen-search').value.toLowerCase();
  
  const users = db.getUsers().filter(u => u.role === 'citizen');
  const citizens = db.getCitizens();

  let rowsHTML = '';
  let count = 0;

  users.forEach(u => {
    const cit = citizens.find(c => c.id === u.id);
    if (!cit) return;

    const matchesSearch = u.name.toLowerCase().includes(query) || u.aadhaar.includes(query) || u.mobile.includes(query);
    if (!matchesSearch) return;

    count++;
    rowsHTML += `
      <tr>
        <td>
          <div class="font-bold">${u.name}</div>
          <div class="text-xs text-muted">Aadhaar: ${u.aadhaar}</div>
          <div class="text-xs text-muted">Mob: ${u.mobile}</div>
        </td>
        <td class="text-xs">
          Age: ${cit.age} yrs<br>
          Sex: ${cit.gender}
        </td>
        <td><span class="badge badge-role">${eligibility.formatCategoryName(cit.category)}</span></td>
        <td>
          <span class="badge ${cit.eligibility_status === 'verified' ? 'badge-success' : cit.eligibility_status === 'rejected' ? 'badge-danger' : 'badge-warning'}">
            ${cit.eligibility_status}
          </span>
        </td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-xs btn-outline vol-toggle-verify" data-id="${u.id}" title="Toggle Verification Status">Verify</button>
            <button class="btn btn-xs btn-outline-blue vol-edit-citizen" data-id="${u.id}">Edit</button>
          </div>
        </td>
      </tr>
    `;
  });

  if (count === 0) {
    citizensBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted p-4">No citizens match the directory filters.</td></tr>`;
  } else {
    citizensBody.innerHTML = rowsHTML;
    attachVolunteerTableActions();
  }
}

function attachVolunteerTableActions() {
  // Toggle verification status (verified <-> pending <-> rejected)
  document.querySelectorAll('.vol-toggle-verify').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const citizen = db.getCitizenById(id);
      if (citizen) {
        const statuses = ['pending', 'verified', 'rejected'];
        const currentIdx = statuses.indexOf(citizen.eligibility_status);
        const nextStatus = statuses[(currentIdx + 1) % statuses.length];
        
        citizen.eligibility_status = nextStatus;
        db.saveCitizen(citizen);
        showToast('Volunteer Actions', `Verification status set to ${nextStatus.toUpperCase()}.`, 'success');
        
        // Refresh views
        renderVolunteerStats();
        renderVolunteerCitizensTable();
      }
    });
  });

  // Edit details
  document.querySelectorAll('.vol-edit-citizen').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const user = db.getUserById(id);
      const citizen = db.getCitizenById(id);
      
      if (user && citizen) {
        showModal(
          'Edit Citizen Details',
          `
            <form id="vol-edit-citizen-form" class="flex flex-col gap-3">
              <input type="hidden" id="edit-id" value="${id}">
              <div class="form-group m-0">
                <label class="form-label text-xs">Full Name</label>
                <input type="text" id="edit-name" class="form-control text-sm" value="${user.name}" required>
              </div>
              <div class="grid grid-2">
                <div class="form-group m-0">
                  <label class="form-label text-xs">Age</label>
                  <input type="number" id="edit-age" class="form-control text-sm" value="${citizen.age}" required>
                </div>
                <div class="form-group m-0">
                  <label class="form-label text-xs">Occupation</label>
                  <input type="text" id="edit-occupation" class="form-control text-sm" value="${citizen.occupation}" required>
                </div>
              </div>
              <div class="form-group m-0">
                <label class="form-label text-xs">Category</label>
                <select id="edit-category" class="form-control text-sm" required>
                  <option value="student" ${citizen.category === 'student' ? 'selected' : ''}>Student</option>
                  <option value="farmer" ${citizen.category === 'farmer' ? 'selected' : ''}>Farmer</option>
                  <option value="senior_citizen" ${citizen.category === 'senior_citizen' ? 'selected' : ''}>Senior Citizen</option>
                  <option value="widow" ${citizen.category === 'widow' ? 'selected' : ''}>Widow</option>
                  <option value="disabled" ${citizen.category === 'disabled' ? 'selected' : ''}>Disabled</option>
                  <option value="general" ${citizen.category === 'general' ? 'selected' : ''}>General</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary w-full mt-2">Save Updates</button>
            </form>
          `
        );

        // Bind form submit
        document.getElementById('vol-edit-citizen-form').addEventListener('submit', (e) => {
          e.preventDefault();
          const targetId = document.getElementById('edit-id').value;
          
          const freshUser = db.getUserById(targetId);
          const freshCitizen = db.getCitizenById(targetId);
          
          freshUser.name = document.getElementById('edit-name').value;
          freshCitizen.age = parseInt(document.getElementById('edit-age').value);
          freshCitizen.occupation = document.getElementById('edit-occupation').value;
          freshCitizen.category = document.getElementById('edit-category').value;

          db.saveUser(freshUser);
          db.saveCitizen(freshCitizen);
          
          showToast('Volunteer actions', 'Citizen details updated successfully.', 'success');
          hideModal();
          
          renderVolunteerCitizensTable();
        });
      }
    });
  });
  
  lucide.createIcons();
}

// 7. Admin Dashboard View
function initAdminDashboardView() {
  // Render charts first
  renderAdminCharts();

  // Tab bindings
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline');
      });
      btn.classList.add('btn-primary');
      btn.classList.remove('btn-outline');

      const target = btn.getAttribute('data-target');
      const mount = document.getElementById('admin-tabs-mount');

      if (target === 'admin-panel-users') {
        mount.innerHTML = views.renderAdminUsersTab();
        attachAdminUsersActions();
      } else if (target === 'admin-panel-schemes') {
        mount.innerHTML = views.renderAdminSchemesTab();
        attachAdminSchemesActions();
      } else {
        mount.innerHTML = views.renderAdminBroadcastTab();
      }
      lucide.createIcons();
    });
  });

  // Modal create buttons
  document.getElementById('btn-add-scheme-modal').addEventListener('click', () => {
    showModal(
      'Configure New Welfare Scheme',
      `
        <form id="admin-add-scheme-form" class="flex flex-col gap-3">
          <div class="form-group m-0">
            <label class="form-label text-xs">Scheme Name</label>
            <input type="text" id="sch-name" class="form-control text-sm" placeholder="e.g. Student Scholarship" required>
          </div>
          <div class="form-group m-0">
            <label class="form-label text-xs">Description</label>
            <textarea id="sch-desc" class="form-control text-sm" rows="2" placeholder="Welfare objective..." required></textarea>
          </div>
          
          <div class="grid grid-2">
            <div class="form-group m-0">
              <label class="form-label text-xs">Target Category</label>
              <select id="sch-target-cat" class="form-control text-sm" required>
                <option value="student">Student</option>
                <option value="farmer">Farmer</option>
                <option value="senior_citizen">Senior Citizen</option>
                <option value="widow">Widow</option>
                <option value="disabled">Disabled</option>
                <option value="general">General</option>
              </select>
            </div>
            <div class="form-group m-0">
              <label class="form-label text-xs">Target Gender</label>
              <select id="sch-target-gender" class="form-control text-sm">
                <option value="all">All Genders</option>
                <option value="male">Male Only</option>
                <option value="female">Female Only</option>
              </select>
            </div>
          </div>

          <div class="grid grid-3">
            <div class="form-group m-0">
              <label class="form-label text-xs">Min Age Rule</label>
              <input type="number" id="sch-rule-min-age" class="form-control text-sm" placeholder="No Min">
            </div>
            <div class="form-group m-0">
              <label class="form-label text-xs">Max Age Rule</label>
              <input type="number" id="sch-rule-max-age" class="form-control text-sm" placeholder="No Max">
            </div>
            <div class="form-group m-0">
              <label class="form-label text-xs">Deadline</label>
              <input type="date" id="sch-deadline" class="form-control text-sm" required>
            </div>
          </div>

          <div class="form-group m-0">
            <label class="form-label text-xs">Welfare Benefits</label>
            <input type="text" id="sch-benefits" class="form-control text-sm" placeholder="e.g. ₹3,000 monthly" required>
          </div>

          <div class="form-group m-0">
            <label class="form-label text-xs">Apply Instructions</label>
            <textarea id="sch-instructions" class="form-control text-sm" rows="2" placeholder="Step-by-step..." required></textarea>
          </div>

          <button type="submit" class="btn btn-primary w-full mt-1">Configure Scheme</button>
        </form>
      `
    );

    document.getElementById('admin-add-scheme-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const minAge = document.getElementById('sch-rule-min-age').value;
      const maxAge = document.getElementById('sch-rule-max-age').value;
      const gender = document.getElementById('sch-target-gender').value;

      const newScheme = {
        scheme_name: document.getElementById('sch-name').value,
        description: document.getElementById('sch-desc').value,
        eligibility_criteria: `Category: ${document.getElementById('sch-target-cat').value.toUpperCase()}, Gender: ${gender.toUpperCase()}`,
        eligibility_rules: {
          categories: [document.getElementById('sch-target-cat').value],
          ...(minAge && { age_min: parseInt(minAge) }),
          ...(maxAge && { age_max: parseInt(maxAge) }),
          ...(gender !== 'all' && { genders: [gender] })
        },
        deadline: document.getElementById('sch-deadline').value,
        benefits: document.getElementById('sch-benefits').value,
        apply_instructions: document.getElementById('sch-instructions').value
      };

      db.saveScheme(newScheme);
      showToast('Admin Controller', `Configured welfare scheme "${newScheme.scheme_name}" successfully.`, 'success');
      hideModal();

      // Trigger redraw of tab if schemes tab active
      const activeBtn = document.querySelector('.admin-tab-btn.btn-primary');
      if (activeBtn) activeBtn.click();
      renderAdminCharts();
    });
  });

  // Add User Modal Trigger
  document.getElementById('btn-add-user-modal').addEventListener('click', () => {
    showModal(
      'Register Portal User',
      `
        <form id="admin-add-user-form" class="flex flex-col gap-3">
          <div class="form-group m-0">
            <label class="form-label text-xs">Full Name</label>
            <input type="text" id="usr-name" class="form-control text-sm" placeholder="Full Name" required>
          </div>
          <div class="grid grid-2">
            <div class="form-group m-0">
              <label class="form-label text-xs">Mobile Number</label>
              <input type="tel" id="usr-mobile" class="form-control text-sm" placeholder="10 digits" required>
            </div>
            <div class="form-group m-0">
              <label class="form-label text-xs">Aadhaar Card Number</label>
              <input type="text" id="usr-aadhaar" class="form-control text-sm" placeholder="12 digits" required>
            </div>
          </div>
          <div class="grid grid-2">
            <div class="form-group m-0">
              <label class="form-label text-xs">Login Email</label>
              <input type="email" id="usr-email" class="form-control text-sm" placeholder="username@village.gov" required>
            </div>
            <div class="form-group m-0">
              <label class="form-label text-xs">Assign Role</label>
              <select id="usr-role" class="form-control text-sm" required>
                <option value="volunteer">Volunteer (Sachivalayam Staff)</option>
                <option value="admin">Administrator (Mandal Head)</option>
              </select>
            </div>
          </div>
          <div class="form-group m-0">
            <label class="form-label text-xs">Account Password</label>
            <input type="password" id="usr-password" class="form-control text-sm" placeholder="••••••••" required>
          </div>
          <button type="submit" class="btn btn-primary w-full mt-2">Create Account</button>
        </form>
      `
    );

    document.getElementById('admin-add-user-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const newUser = {
        id: 'usr_' + Date.now(),
        name: document.getElementById('usr-name').value,
        mobile: document.getElementById('usr-mobile').value,
        aadhaar: document.getElementById('usr-aadhaar').value,
        village: 'Digital Gram',
        role: document.getElementById('usr-role').value,
        email: document.getElementById('usr-email').value,
        password: document.getElementById('usr-password').value
      };

      db.saveUser(newUser);
      showToast('Admin Controller', `User "${newUser.name}" successfully created.`, 'success');
      hideModal();

      const activeBtn = document.querySelector('.admin-tab-btn.btn-primary');
      if (activeBtn) activeBtn.click();
    });
  });

  // Attach actions for the default Users tab
  attachAdminUsersActions();
}

function renderAdminCharts() {
  const citizens = db.getCitizens();
  const schemes = db.getSchemes();
  const apps = db.getApplications();

  // 1. Category Breakdown Counts
  const catCounts = { 'Students': 0, 'Farmers': 0, 'Seniors': 0, 'Widows': 0, 'Disabled': 0, 'General': 0 };
  citizens.forEach(c => {
    if (c.category === 'student') catCounts.Students++;
    else if (c.category === 'farmer') catCounts.Farmers++;
    else if (c.category === 'senior_citizen') catCounts.Seniors++;
    else if (c.category === 'widow') catCounts.Widows++;
    else if (c.category === 'disabled') catCounts.Disabled++;
    else catCounts.General++;
  });
  charts.renderCategoryChart('admin-category-chart', catCounts);

  // 2. Scheme Enrollments Distribution
  const schemeDist = {};
  schemes.forEach(s => {
    const count = apps.filter(a => a.scheme_id === s.id && a.status === 'approved').length;
    schemeDist[s.scheme_name] = count;
  });
  charts.renderSchemeDistributionChart('admin-scheme-chart', schemeDist);
}

function triggerChartsRedraw() {
  // Only redraw if dashboards are currently active in view state
  if (state.activeView === 'admin-dashboard') {
    renderAdminCharts();
  } else if (state.activeView === 'volunteer-dashboard') {
    const citizens = db.getCitizens();
    const statusCounts = { Verified: 0, Pending: 0, Rejected: 0 };
    citizens.forEach(c => {
      if (c.eligibility_status === 'verified') statusCounts.Verified++;
      else if (c.eligibility_status === 'pending') statusCounts.Pending++;
      else statusCounts.Rejected++;
    });
    charts.renderEligibilityStatusChart('vol-caseload-chart', statusCounts);
  }
}

function attachAdminUsersActions() {
  // Delete User Account
  document.querySelectorAll('.admin-delete-user').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const user = db.getUserById(id);
      if (confirm(`Are you sure you want to delete user account "${user.name}"?`)) {
        db.deleteUser(id);
        showToast('Admin Controller', 'User account successfully deleted.', 'success');
        
        // Refresh tab view
        document.querySelector('.admin-tab-btn.btn-primary').click();
        renderAdminCharts();
      }
    });
  });

  // Edit User details (Role toggle)
  document.querySelectorAll('.admin-edit-user').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const user = db.getUserById(id);
      if (user) {
        showModal(
          `Edit User Role: ${user.name}`,
          `
            <form id="admin-edit-user-role" class="flex flex-col gap-3">
              <input type="hidden" id="edit-usr-id" value="${id}">
              <div class="form-group m-0">
                <label class="form-label text-xs">Account Role</label>
                <select id="edit-usr-role" class="form-control text-sm">
                  <option value="citizen" ${user.role === 'citizen' ? 'selected' : ''}>Citizen</option>
                  <option value="volunteer" ${user.role === 'volunteer' ? 'selected' : ''}>Volunteer</option>
                  <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary w-full mt-2">Save Role Changes</button>
            </form>
          `
        );

        document.getElementById('admin-edit-user-role').addEventListener('submit', (e) => {
          e.preventDefault();
          const targetId = document.getElementById('edit-usr-id').value;
          const freshUser = db.getUserById(targetId);
          
          freshUser.role = document.getElementById('edit-usr-role').value;
          db.saveUser(freshUser);

          showToast('Admin Actions', 'User role updated.', 'success');
          hideModal();
          document.querySelector('.admin-tab-btn.btn-primary').click();
        });
      }
    });
  });
  
  lucide.createIcons();
}

function attachAdminSchemesActions() {
  // Delete Scheme Configuration
  document.querySelectorAll('.admin-delete-scheme').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const scheme = db.getSchemeById(id);
      if (confirm(`Are you sure you want to delete scheme "${scheme.scheme_name}"?`)) {
        db.deleteScheme(id);
        showToast('Admin Controller', 'Scheme configuration deleted.', 'success');
        
        // Refresh schemes catalog view inside tab
        document.querySelector('.admin-tab-btn.btn-primary').click();
        renderAdminCharts();
      }
    });
  });

  // Edit Scheme details
  document.querySelectorAll('.admin-edit-scheme').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const scheme = db.getSchemeById(id);
      if (scheme) {
        showModal(
          `Edit Scheme Details`,
          `
            <form id="admin-edit-scheme-form" class="flex flex-col gap-3">
              <input type="hidden" id="edit-sch-id" value="${id}">
              <div class="form-group m-0">
                <label class="form-label text-xs">Scheme Name</label>
                <input type="text" id="edit-sch-name" class="form-control text-sm" value="${scheme.scheme_name}" required>
              </div>
              <div class="form-group m-0">
                <label class="form-label text-xs">Description</label>
                <textarea id="edit-sch-desc" class="form-control text-sm" rows="3" required>${scheme.description}</textarea>
              </div>
              <div class="grid grid-2">
                <div class="form-group m-0">
                  <label class="form-label text-xs">Benefits</label>
                  <input type="text" id="edit-sch-benefits" class="form-control text-sm" value="${scheme.benefits}" required>
                </div>
                <div class="form-group m-0">
                  <label class="form-label text-xs">Deadline</label>
                  <input type="date" id="edit-sch-deadline" class="form-control text-sm" value="${scheme.deadline}" required>
                </div>
              </div>
              <button type="submit" class="btn btn-primary w-full mt-2">Save Scheme</button>
            </form>
          `
        );

        document.getElementById('admin-edit-scheme-form').addEventListener('submit', (e) => {
          e.preventDefault();
          const targetId = document.getElementById('edit-sch-id').value;
          const freshScheme = db.getSchemeById(targetId);
          
          freshScheme.scheme_name = document.getElementById('edit-sch-name').value;
          freshScheme.description = document.getElementById('edit-sch-desc').value;
          freshScheme.benefits = document.getElementById('edit-sch-benefits').value;
          freshScheme.deadline = document.getElementById('edit-sch-deadline').value;

          db.saveScheme(freshScheme);
          showToast('Admin Controller', 'Scheme details updated.', 'success');
          hideModal();
          
          document.querySelector('.admin-tab-btn.btn-primary').click();
          renderAdminCharts();
        });
      }
    });
  });
  
  lucide.createIcons();
}

// 8. FAQ View
function initFAQView() {
  const triggers = document.querySelectorAll('.faq-trigger');
  triggers.forEach(tr => {
    tr.addEventListener('click', () => {
      const content = tr.nextElementSibling;
      const icon = tr.querySelector('i');
      
      content.classList.toggle('hidden');
      
      // Toggle Chevron rotation/icon state
      if (content.classList.contains('hidden')) {
        icon.setAttribute('data-lucide', 'chevron-down');
      } else {
        icon.setAttribute('data-lucide', 'chevron-up');
      }
      lucide.createIcons();
    });
  });
}

/* ==========================================================================
   ALERT SIMULATOR ENGINE (TOASTS & SMARTPHONE SCREEN)
   ========================================================================== */

function initAlertsView() {
  // Action buttons
  const triggers = document.querySelectorAll('.sim-trigger');
  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      const activeUser = auth.getCurrentUser();
      const targetId = activeUser ? activeUser.id : 'user_citizen';
      
      triggerSimulatedReminder(type, targetId);
    });
  });

  // Quick swap role accounts
  const quickLogins = document.querySelectorAll('.quick-login');
  quickLogins.forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-user');
      auth.logout();

      if (role === 'admin') auth.login('admin@village.gov', 'admin123');
      else if (role === 'volunteer') auth.login('volunteer@village.gov', 'volunteer123');
      else auth.login('7777777777', 'citizen123');

      showToast('Quick Login', `Swapped session to ${role.toUpperCase()} account.`, 'success');
      window.location.hash = `#dashboard`;
      updateHeaderAuthStates();
    });
  });
}

function triggerSimulatedReminder(type, citizenId) {
  const citizen = db.getUserById(citizenId);
  const name = citizen ? citizen.name : 'Resident';

  let alertTitle = '';
  let alertMsg = '';
  let schemeId = '';

  switch(type) {
    case 'pension':
      alertTitle = '👵 Pension Credit Notice';
      alertMsg = `VWARS Alert: Dear ${name}, your Old Age Pension amount of ₹3,000 for the month of June 2026 has been credited via DBT. Transaction ID: TXN893247. Please verify with your bank.`;
      schemeId = 'sch_1';
      break;
    case 'scholarship':
      alertTitle = '🎓 Scholarship Deadline Warning';
      alertMsg = `VWARS Alert: Dear Student, the closing date for the Student Scholarship scheme is June 30, 2026. Submit your pending documents online today.`;
      schemeId = 'sch_2';
      break;
    case 'health':
      alertTitle = '🏥 Mega Health Camp Alert';
      alertMsg = `VWARS Broadcast: Free Medical Checkup & General Consultation at Gram Panchayat Office on June 14, 2026 from 9AM. Diagnostic tests are completely free.`;
      schemeId = 'sch_5';
      break;
    case 'agriculture':
      alertTitle = '🌾 Farmer Subsidy Release';
      alertMsg = `VWARS Alert: Dear Farmer ${name}, Rythu Bharosa seasonal inputs subsidy of ₹5,500 has been sanctioned for release. Funds will transfer shortly.`;
      schemeId = 'sch_3';
      break;
    case 'aadhaar':
      alertTitle = '🪪 Aadhaar Verification Reminder';
      alertMsg = `VWARS Warning: Dear ${name}, your Aadhaar links are pending. Link Aadhaar card with your Ration Card before June 25 to continue subsidized food benefits.`;
      schemeId = 'sch_9';
      break;
    case 'income':
      alertTitle = '📄 Income Certificate Renewal Due';
      alertMsg = `VWARS Alert: Your annual Income Certificate expires on June 25, 2026. Apply at Meeseva counter with volunteer assistance immediately.`;
      schemeId = 'sch_5';
      break;
  }

  // 1. Save to Database
  db.saveNotification({
    user_id: citizenId,
    title: alertTitle,
    message: alertMsg,
    type: type,
    delivery_method: 'sms'
  });

  db.saveReminder({
    citizen_id: citizenId,
    scheme_id: schemeId,
    notification_type: type,
    channel: 'sms'
  });

  // 2. Play Audio Beep
  playNotificationSound();

  // 3. Show Toast Overlay
  showToast(alertTitle, alertMsg, 'warning');

  // 4. Slide-in Smartphone screen message
  setTimeout(() => {
    triggerSimulatedSMS('Gov-Welfare', alertMsg);
  }, 1200);

  // 5. If Citizen is logged in and viewing notification tab, refresh it
  if (auth.isLoggedIn() && state.activeView === 'citizen-dashboard' && state.activeCitizenTab === 'notifications') {
    document.getElementById('tab-my-notifications').click();
  }

  // 6. If viewing public alerts page, refresh the page view to show new item
  if (state.activeView === 'alerts') {
    router();
  }
}

// Play a synthetic notification beep tone using browser AudioContext API
function playNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime); // Pitch note
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.18); // Short duration beep
  } catch (err) {
    console.log("Audio Context blocked by browser autoplay rules.", err);
  }
}

// Renders toast popup on bottom-right of screen
window.showToast = function(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-header">
      <span>${title}</span>
      <button class="toast-close-btn btn-icon-sm" style="margin-top:-3px; margin-right:-5px;"><i data-lucide="x" class="w-3 h-3"></i></button>
    </div>
    <div class="toast-body">${message}</div>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  // Toast close button listener
  toast.querySelector('.toast-close-btn').addEventListener('click', () => {
    container.removeChild(toast);
  });

  // Auto remove after 6 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      container.removeChild(toast);
    }
  }, 6000);
}

// Floating Device Simulation Panel (Visual Smartphone view)
function triggerSimulatedSMS(sender, message) {
  const modal = document.getElementById('device-modal');
  const chatBody = document.getElementById('phone-chat-body');
  const senderField = document.getElementById('phone-sender-name');

  senderField.textContent = sender;
  
  // Format current timestamp
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  chatBody.innerHTML = `
    <div class="chat-bubble chat-bubble-received">
      <p class="m-0">${message}</p>
      <span class="chat-time">${timeStr}</span>
    </div>
  `;

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function hideDeviceSim() {
  document.getElementById('device-modal').classList.add('hidden');
}

/* ==========================================================================
   GLOBAL DIALOG CONTROLS
   ========================================================================== */

window.showModal = function(title, bodyHTML) {
  const modal = document.getElementById('global-modal');
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  modal.classList.remove('hidden');
  lucide.createIcons();
}

window.hideModal = function() {
  document.getElementById('global-modal').classList.add('hidden');
}
