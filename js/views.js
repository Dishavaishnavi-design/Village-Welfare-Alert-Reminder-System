/* ==========================================================================
   VIEW TEMPLATES AND RENDERERS - VWARS
   ========================================================================== */

window.views = {
  // 1. HOME VIEW
  renderHome() {
    // Calculate live counts for stats
    const usersCount = window.db.getUsers().length;
    const schemesCount = window.db.getSchemes().length;
    const appsCount = window.db.getApplications().length;
    
    return `
      <!-- Hero Banner -->
      <section class="hero-section">
        <div class="container flex justify-between align-center md-flex-row gap-6">
          <div class="hero-content text-left">
            <span class="badge badge-info mb-3 text-white" style="background-color: rgba(255,255,255,0.2);">Digital Gram Panchayat Initiative</span>
            <h2 class="hero-title">Direct Welfare Delivery, Right to Your Fingertips</h2>
            <p class="hero-subtitle">VWARS bridges the gap between government benefits and citizens. Stay updated with pension credits, agricultural subsidies, health camps, and scholarship alerts.</p>
            <div class="flex gap-3">
              <a href="#schemes" class="btn btn-secondary"><i data-lucide="search" class="w-4 h-4"></i> Browse Schemes</a>
              ${!window.auth.isLoggedIn() ? `<a href="#register" class="btn btn-outline text-white" style="border-color: #ffffff;"><i data-lucide="user-plus" class="w-4 h-4"></i> Citizen Registration</a>` : `<a href="#citizen-dashboard" class="btn btn-outline text-white" style="border-color: #ffffff;">Go to Dashboard</a>`}
            </div>
          </div>
          <div class="hero-graphic mobile-only md-flex-row">
            <svg width="320" height="320" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="80" fill="rgba(255,255,255,0.08)"/>
              <path d="M100 30L40 75V150H160V75L100 30Z" fill="rgba(255,255,255,0.15)" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/>
              <rect x="85" y="110" width="30" height="40" fill="rgba(255,255,255,0.2)" stroke="#ffffff" stroke-width="2"/>
              <circle cx="100" cy="65" r="12" fill="#fd7e14"/>
              <line x1="100" y1="150" x2="100" y2="180" stroke="#ffffff" stroke-width="4"/>
              <line x1="60" y1="180" x2="140" y2="180" stroke="#ffffff" stroke-width="4"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- Stats Grid -->
      <section class="container hero-card-grid">
        <div class="grid grid-4">
          <div class="stat-card card-accent-green">
            <div class="stat-icon stat-icon-green text-success" style="background-color: var(--primary-light);">🏢</div>
            <div>
              <p class="stat-num">${schemesCount}</p>
              <p class="stat-label">Active Schemes</p>
            </div>
          </div>
          <div class="stat-card card-accent-blue">
            <div class="stat-icon stat-icon-blue text-secondary" style="background-color: var(--secondary-light);">👥</div>
            <div>
              <p class="stat-num">${usersCount + 14}</p>
              <p class="stat-label">Beneficiaries Registered</p>
            </div>
          </div>
          <div class="stat-card card-accent-orange">
            <div class="stat-icon stat-icon-orange text-warning" style="background-color: var(--warning-light);">🔔</div>
            <div>
              <p class="stat-num">98%</p>
              <p class="stat-label">Alerts Delivered</p>
            </div>
          </div>
          <div class="stat-card card-accent-green">
            <div class="stat-icon stat-icon-green text-success" style="background-color: var(--primary-light);">💳</div>
            <div>
              <p class="stat-num">${appsCount + 28}</p>
              <p class="stat-label">Applications Approved</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="container py-5">
        <div class="text-center mb-5">
          <span class="badge badge-success">Features</span>
          <h2 class="mt-2 text-2xl">Tailored Welfare Services</h2>
          <p class="text-muted text-sm max-w-md mx-auto" style="max-width: 500px; margin: 0 auto;">Designed to keep rural citizens connected to state and national development initiatives.</p>
        </div>
        <div class="grid grid-3">
          <div class="card card-accent-green">
            <div class="card-icon card-icon-green">🧮</div>
            <h3 class="text-lg">Auto Eligibility Checker</h3>
            <p class="text-muted text-sm">Input your profile information (age, gender, occupation, and category) to dynamically receive a matching list of eligible welfare schemes instantly.</p>
          </div>
          <div class="card card-accent-blue">
            <div class="card-icon card-icon-blue">🔔</div>
            <h3 class="text-lg">Real-Time Alerts System</h3>
            <p class="text-muted text-sm">Receive immediate updates for pension disbursement releases, scholarship closing deadlines, and Gram Panchayat health campaigns through our simulated alert interface.</p>
          </div>
          <div class="card card-accent-orange">
            <div class="card-icon card-icon-orange">🗺️</div>
            <h3 class="text-lg">Village Ward Coordination</h3>
            <p class="text-muted text-sm">Empower Village Volunteers to add, verify, and monitor households to ensure 100% saturation of eligible schemes at the doorstep.</p>
          </div>
        </div>
      </section>

      <!-- Benefits / Saturation Section -->
      <section class="py-5" style="background-color: var(--card-background); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
        <div class="container flex justify-between align-center md-flex-row gap-6">
          <div class="w-full text-left" style="flex: 1.2;">
            <span class="badge badge-info">Our Goal</span>
            <h2 class="mt-2 text-2xl">Maximizing Grassroots Welfare Saturation</h2>
            <p class="text-muted text-sm mb-4">The Village Welfare Portal addresses the communication gap that leaves many eligible rural citizens unaware of services designed specifically for them. We ensure transparency, reduce administrative friction, and provide direct feedback metrics for panchayat heads.</p>
            <ul class="flex flex-col gap-3">
              <li class="flex align-center gap-3"><span class="badge badge-success">✓</span> <strong class="text-sm">Direct Bank transfers notifications</strong></li>
              <li class="flex align-center gap-3"><span class="badge badge-success">✓</span> <strong class="text-sm">Proactive document renewal reminders (Aadhaar / Income)</strong></li>
              <li class="flex align-center gap-3"><span class="badge badge-success">✓</span> <strong class="text-sm">Role-based access controls for data security</strong></li>
            </ul>
          </div>
          <div class="w-full text-center" style="flex: 0.8;">
            <div class="p-4" style="background-color: var(--background-color); border-radius: var(--border-radius-lg); border: 1.5px solid var(--border-color);">
              <h4 class="text-lg mb-3">Check Eligibility Now</h4>
              <p class="text-muted text-sm mb-4">Register in 2 minutes to discover schemes you can apply for today.</p>
              <a href="#register" class="btn btn-primary w-full">Start Citizen Registration</a>
              <p class="text-xs text-muted mt-3">Already registered? <a href="#login" class="font-semibold">Login here</a></p>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="container py-5">
        <div class="text-center mb-5">
          <span class="badge badge-warning">Help Desk</span>
          <h2 class="mt-2 text-2xl">Contact Ward Assistance</h2>
          <p class="text-muted text-sm" style="max-width: 500px; margin: 0 auto;">Have questions regarding application statuses or schemes eligibility? Drop a message directly to the Ward Administrator.</p>
        </div>
        <div class="grid grid-2" style="max-width: 800px; margin: 0 auto;">
          <div class="p-4 flex flex-col gap-4 text-left" style="background-color: var(--card-background); border: 1px solid var(--border-color); border-radius: var(--border-radius-lg);">
            <div class="flex gap-3 align-center">
              <div class="stat-icon stat-icon-green">📍</div>
              <div>
                <h4 class="text-sm m-0">Sachivalayam Building</h4>
                <p class="text-xs text-muted">Digital Gram Panchayat, Ward No. 3</p>
              </div>
            </div>
            <div class="flex gap-3 align-center">
              <div class="stat-icon stat-icon-blue">📞</div>
              <div>
                <h4 class="text-sm m-0">Panchayat Helpdesk</h4>
                <p class="text-xs text-muted">Toll Free: 1800-425-4567</p>
              </div>
            </div>
            <div class="flex gap-3 align-center">
              <div class="stat-icon stat-icon-orange">📧</div>
              <div>
                <h4 class="text-sm m-0">Support Email</h4>
                <p class="text-xs text-muted">helpdesk-vwars@state.gov.in</p>
              </div>
            </div>
          </div>
          <form id="home-contact-form" class="p-4 text-left flex flex-col gap-3" style="background-color: var(--card-background); border: 1px solid var(--border-color); border-radius: var(--border-radius-lg);">
            <div class="form-group m-0">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" id="contact-name" placeholder="Your name" required>
            </div>
            <div class="form-group m-0">
              <label class="form-label">Mobile Number</label>
              <input type="tel" class="form-control" id="contact-mobile" placeholder="10-digit number" required>
            </div>
            <div class="form-group m-0">
              <label class="form-label">Message</label>
              <textarea class="form-control" id="contact-msg" rows="3" placeholder="Describe your query..." required></textarea>
            </div>
            <button type="submit" class="btn btn-primary w-full mt-2">Send Message</button>
          </form>
        </div>
      </section>
    `;
  },

  // 2. CITIZEN REGISTRATION VIEW
  renderRegister() {
    return `
      <section class="container py-5 flex justify-center">
        <div class="card w-full text-left" style="max-width: 550px;">
          <div class="text-center mb-4">
            <span class="badge badge-success">Sign Up</span>
            <h2 class="mt-2 text-2xl">Citizen Registration</h2>
            <p class="text-muted text-sm">Create an account to search eligible welfare schemes and receive deadline reminders.</p>
          </div>
          
          <form id="citizen-register-form" class="flex flex-col gap-4">
            <div class="grid grid-2">
              <div class="form-group m-0">
                <label class="form-label">Full Name</label>
                <input type="text" id="reg-name" class="form-control" placeholder="First and last name" required>
              </div>
              <div class="form-group m-0">
                <label class="form-label">Mobile Number</label>
                <input type="tel" id="reg-mobile" class="form-control" placeholder="10-digit mobile" required>
              </div>
            </div>

            <div class="grid grid-2">
              <div class="form-group m-0">
                <label class="form-label">Aadhaar Number (12 digits)</label>
                <input type="text" id="reg-aadhaar" class="form-control" placeholder="1234 5678 9012" required>
              </div>
              <div class="form-group m-0">
                <label class="form-label">Village / Ward</label>
                <select id="reg-village" class="form-control" required>
                  <option value="Digital Gram">Digital Gram Panchayat</option>
                  <option value="Agri Village">Agri Village Ward</option>
                  <option value="Hilly Region">Hilly Region Sector</option>
                </select>
              </div>
            </div>

            <div class="grid grid-3">
              <div class="form-group m-0">
                <label class="form-label">Age</label>
                <input type="number" id="reg-age" class="form-control" min="0" max="120" required>
              </div>
              <div class="form-group m-0">
                <label class="form-label">Gender</label>
                <select id="reg-gender" class="form-control" required>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group m-0">
                <label class="form-label">Occupation</label>
                <input type="text" id="reg-occupation" class="form-control" placeholder="e.g. Farmer, Student" required>
              </div>
            </div>

            <div class="form-group m-0">
              <label class="form-label">Citizen Category</label>
              <select id="reg-category" class="form-control" required>
                <option value="">-- Choose Category --</option>
                <option value="student">Student (Pursuing higher education)</option>
                <option value="farmer">Farmer (Land owner / Leaseholder)</option>
                <option value="senior_citizen">Senior Citizen (Age 60+)</option>
                <option value="widow">Widow (Single mother/widow)</option>
                <option value="disabled">Disabled (Divyangan, 40%+ disability)</option>
                <option value="general">General Citizen (Others)</option>
              </select>
            </div>

            <div class="form-group m-0">
              <label class="form-label">Set Login Password</label>
              <input type="password" id="reg-password" class="form-control" placeholder="Minimum 4 characters" required>
            </div>

            <div class="flex align-center gap-2 mt-2">
              <input type="checkbox" id="reg-terms" class="form-checkbox" required>
              <label for="reg-terms" class="text-xs text-muted">I declare that all the demographic information provided matches my official certificates.</label>
            </div>

            <button type="submit" class="btn btn-primary w-full mt-2">Register & Check Eligibility</button>
            <p class="text-center text-sm text-muted">Already registered? <a href="#login" class="font-semibold">Login here</a></p>
          </form>
        </div>
      </section>
    `;
  },

  // 3. LOGIN VIEW
  renderLogin() {
    return `
      <section class="container py-5 flex justify-center">
        <div class="card w-full text-left" style="max-width: 400px; margin-top: 2rem;">
          <div class="text-center mb-4">
            <span class="badge badge-info">Secure Access</span>
            <h2 class="mt-2 text-2xl">Portal Sign In</h2>
            <p class="text-muted text-sm">Enter credentials to access dashboards.</p>
          </div>

          <form id="portal-login-form" class="flex flex-col gap-4">
            <div class="form-group m-0">
              <label class="form-label">Mobile Number / Email / Aadhaar</label>
              <input type="text" id="login-key" class="form-control" placeholder="Enter mobile, email, or Aadhaar" required autocomplete="username">
            </div>

            <div class="form-group m-0">
              <label class="form-label">Password</label>
              <input type="password" id="login-password" class="form-control" placeholder="••••••••" required autocomplete="current-password">
            </div>

            <button type="submit" class="btn btn-primary w-full mt-2">Sign In</button>
            <p class="text-center text-sm text-muted">New citizen? <a href="#register" class="font-semibold">Create account</a></p>
          </form>
        </div>
      </section>
    `;
  },

  // 4. CITIZEN DASHBOARD VIEW
  renderCitizenDashboard(citizenUser) {
    const profile = citizenUser.profile;
    const notifications = window.db.getUserNotifications(citizenUser.id);
    const unreadCount = notifications.filter(n => n.status === 'unread').length;
    
    const applications = window.db.getCitizenApplications(citizenUser.id);
    const reminders = window.db.getCitizenReminders(citizenUser.id);

    // Compute schemes and eligibility status
    const schemes = window.db.getSchemes();
    const evaluatedSchemes = window.eligibility.evaluateAll(profile, schemes);
    const eligibleCount = evaluatedSchemes.filter(s => s.evaluation.eligible).length;

    return `
      <section class="container">
        <div class="dashboard-grid">
          <!-- Sidebar Info -->
          <div class="dashboard-sidebar">
            <div class="profile-card">
              <div class="profile-avatar">${citizenUser.name.charAt(0)}</div>
              <h3 class="text-lg mb-1">${citizenUser.name}</h3>
              <span class="badge ${profile.eligibility_status === 'verified' ? 'badge-success' : 'badge-warning'} mb-3">
                Profile: ${profile.eligibility_status}
              </span>
              
              <div class="text-left flex flex-col gap-2 mt-4 text-sm border-top pt-3">
                <p><strong>Mobile:</strong> ${citizenUser.mobile}</p>
                <p><strong>Aadhaar:</strong> XXXX XXXX ${citizenUser.aadhaar.substring(8)}</p>
                <p><strong>Age / Gender:</strong> ${profile.age} yrs / ${profile.gender}</p>
                <p><strong>Category:</strong> ${window.eligibility.formatCategoryName(profile.category)}</p>
                <p><strong>Occupation:</strong> ${profile.occupation}</p>
                <p><strong>Village:</strong> ${citizenUser.village}</p>
              </div>
            </div>

            <!-- Tab Buttons -->
            <div class="sidebar-menu">
              <button class="sidebar-link active w-full border-0 text-left bg-transparent cursor-pointer" id="tab-eligible-schemes">
                <span>🗂️</span> Eligible Schemes <span class="badge badge-success ml-auto" style="margin-left:auto;">${eligibleCount}</span>
              </button>
              <button class="sidebar-link w-full border-0 text-left bg-transparent cursor-pointer" id="tab-my-notifications">
                <span>🔔</span> Notifications <span class="badge ${unreadCount > 0 ? 'badge-danger' : 'badge-info'}" style="margin-left:auto;">${unreadCount}</span>
              </button>
              <button class="sidebar-link w-full border-0 text-left bg-transparent cursor-pointer" id="tab-my-applications">
                <span>📑</span> Applications History <span class="badge badge-role" style="margin-left:auto;">${applications.length}</span>
              </button>
              <button class="sidebar-link w-full border-0 text-left bg-transparent cursor-pointer" id="tab-reminder-logs">
                <span>⏰</span> Reminder History <span class="badge badge-role" style="margin-left:auto;">${reminders.length}</span>
              </button>
            </div>
          </div>

          <!-- Main Content Dashboard Area -->
          <div class="dashboard-content-area text-left" id="citizen-dashboard-tabs-content">
             <!-- Active tab injected here, defaults to eligible schemes -->
             ${this.renderCitizenEligibleSchemes(evaluatedSchemes, applications)}
          </div>
        </div>
      </section>
    `;
  },

  // Helper Citizen Sub-views
  renderCitizenEligibleSchemes(evaluatedSchemes, applications) {
    let listHTML = '';

    evaluatedSchemes.forEach(scheme => {
      const isApplied = applications.some(a => a.scheme_id === scheme.id);
      const appRecord = applications.find(a => a.scheme_id === scheme.id);
      
      const { eligible, reasons } = scheme.evaluation;
      
      listHTML += `
        <div class="card flex flex-col justify-between ${eligible ? 'card-accent-green' : 'card-accent-gray'}" style="${!eligible ? 'opacity: 0.65; border-top: 4px solid #94a3b8;' : ''}">
          <div>
            <div class="flex justify-between align-center mb-2">
              <h4 class="text-base font-bold mb-0">${scheme.scheme_name}</h4>
              <span class="badge ${eligible ? 'badge-success' : 'badge-danger'}">
                ${eligible ? 'Eligible' : 'Not Eligible'}
              </span>
            </div>
            <p class="text-sm text-muted mb-3">${scheme.description}</p>
            
            <div class="p-3 bg-light rounded text-xs mb-3" style="background-color: var(--background-color); border-radius: var(--border-radius-md);">
              <p class="mb-1"><strong>Benefit:</strong> ${scheme.benefits}</p>
              <p class="mb-1"><strong>Deadline:</strong> <span class="text-danger font-semibold">${scheme.deadline}</span></p>
              <p><strong>Rules Checked:</strong></p>
              <ul style="list-style-type: disc; padding-left: var(--spacing-4); margin-top: 4px;">
                ${reasons.map(r => `<li>${r}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="flex justify-between align-center mt-3 border-top pt-2">
            <button class="btn btn-xs btn-outline-blue view-scheme-details" data-id="${scheme.id}">Instructions</button>
            
            ${isApplied 
              ? `<span class="badge ${appRecord.status === 'approved' ? 'badge-success' : appRecord.status === 'rejected' ? 'badge-danger' : appRecord.status === 'warning'}">Application: ${appRecord.status}</span>`
              : (eligible 
                  ? `<button class="btn btn-sm btn-primary apply-scheme-btn" data-id="${scheme.id}">Apply Now</button>`
                  : `<button class="btn btn-sm btn-outline-gray" disabled>Cannot Apply</button>`
                )
            }
          </div>
        </div>
      `;
    });

    return `
      <div>
        <div class="flex justify-between align-center mb-4">
          <h3 class="text-xl m-0">Eligible Schemes Portfolio</h3>
          <span class="text-xs text-muted">Real-time calculator checks profile against ${evaluatedSchemes.length} schemes</span>
        </div>
        <div class="grid grid-2">
          ${listHTML}
        </div>
      </div>
    `;
  },

  renderCitizenNotifications(notifications) {
    let listHTML = '';

    if (notifications.length === 0) {
      listHTML = `<p class="text-muted p-5 text-center">No notifications or deadline alerts found.</p>`;
    } else {
      notifications.forEach(notif => {
        listHTML += `
          <div class="p-4 mb-3" style="background-color: var(--card-background); border: 1.5px solid var(--border-color); border-left: 5px solid ${notif.type === 'pension' ? 'var(--primary-color)' : notif.type === 'scholarship' ? 'var(--secondary-color)' : 'var(--warning-color)'}; border-radius: var(--border-radius-md);">
            <div class="flex justify-between align-center mb-2">
              <h4 class="text-base m-0 flex align-center gap-2">
                ${notif.title}
                ${notif.status === 'unread' ? '<span class="badge badge-danger">New</span>' : ''}
              </h4>
              <span class="text-xs text-muted">${new Date(notif.date).toLocaleDateString()}</span>
            </div>
            <p class="text-sm mb-3">${notif.message}</p>
            <div class="flex gap-2 justify-between align-center">
              <span class="badge badge-role text-xs">Delivered: ${notif.delivery_method.toUpperCase()}</span>
              ${notif.status === 'unread' 
                ? `<button class="btn btn-xs btn-outline mark-read-btn" data-id="${notif.id}">Mark as read</button>` 
                : '<span class="text-xs text-success">✓ Read</span>'}
            </div>
          </div>
        `;
      });
    }

    return `
      <div>
        <h3 class="text-xl mb-4">Notifications & Alerts Centre</h3>
        <div class="flex flex-col">
          ${listHTML}
        </div>
      </div>
    `;
  },

  renderCitizenApplications(applications) {
    let rows = '';

    if (applications.length === 0) {
      rows = `<tr><td colspan="4" class="text-center text-muted p-4">You have not applied to any welfare schemes yet.</td></tr>`;
    } else {
      applications.forEach(app => {
        const scheme = window.db.getSchemeById(app.scheme_id);
        rows += `
          <tr>
            <td><strong>${scheme ? scheme.scheme_name : 'Unknown Scheme'}</strong></td>
            <td>${app.apply_date}</td>
            <td>
              <span class="badge ${app.status === 'approved' ? 'badge-success' : app.status === 'rejected' ? 'badge-danger' : 'badge-warning'}">
                ${app.status}
              </span>
            </td>
            <td>${scheme ? scheme.benefits : '-'}</td>
          </tr>
        `;
      });
    }

    return `
      <div>
        <h3 class="text-xl mb-4">Welfare Applications History</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Scheme Name</th>
                <th>Applied Date</th>
                <th>Verification Status</th>
                <th>Benefits Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderCitizenReminders(reminders) {
    let rows = '';

    if (reminders.length === 0) {
      rows = `<tr><td colspan="4" class="text-center text-muted p-4">No reminder logs found in simulation database.</td></tr>`;
    } else {
      reminders.forEach(rem => {
        const scheme = window.db.getSchemeById(rem.scheme_id);
        rows += `
          <tr>
            <td><strong>${scheme ? scheme.scheme_name : 'General Broadcast'}</strong></td>
            <td><span class="badge badge-info">${rem.notification_type}</span></td>
            <td>${rem.date}</td>
            <td><span class="badge badge-role">📲 ${rem.channel.toUpperCase()}</span></td>
          </tr>
        `;
      });
    }

    return `
      <div>
        <h3 class="text-xl mb-4">Reminders & SMS Delivery Logs</h3>
        <p class="text-sm text-muted mb-3">Logs of simulated SMS messages, Emails and voice alerts sent to citizen phone number.</p>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Reference Scheme</th>
                <th>Alert Type</th>
                <th>Timestamp</th>
                <th>Channel</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 5. WELFARE SCHEMES PAGE
  renderSchemesCatalog() {
    return `
      <section class="container py-5 text-left">
        <div class="text-center mb-5">
          <span class="badge badge-success">Directory</span>
          <h2 class="mt-2 text-3xl">State Welfare Schemes Portal</h2>
          <p class="text-muted text-sm max-w-md mx-auto" style="max-width: 500px; margin: 0 auto;">Search, filter, and view detailed application criteria for Gram Panchayat services.</p>
        </div>

        <div class="grid grid-4" style="grid-template-columns: 260px 1fr; gap: var(--spacing-6);">
          <!-- Sidebar Filters -->
          <div class="flex flex-col gap-4">
            <div class="card p-4">
              <h4 class="text-sm font-bold uppercase mb-3">Search & Find</h4>
              <div class="search-container mb-3">
                <input type="text" id="scheme-search-input" class="search-input text-sm" placeholder="Search scheme name...">
                <i data-lucide="search" class="w-4 h-4 text-muted"></i>
              </div>

              <h4 class="text-sm font-bold uppercase mb-3">Target Category</h4>
              <div class="flex flex-col gap-2">
                <button class="btn btn-xs btn-primary filter-category-btn w-full text-left" data-category="all">All Category</button>
                <button class="btn btn-xs btn-outline filter-category-btn w-full text-left" data-category="student">Student Scholarships</button>
                <button class="btn btn-xs btn-outline filter-category-btn w-full text-left" data-category="farmer">Farmer Subsidies</button>
                <button class="btn btn-xs btn-outline filter-category-btn w-full text-left" data-category="senior_citizen">Senior Citizens</button>
                <button class="btn btn-xs btn-outline filter-category-btn w-full text-left" data-category="widow">Widow Pensions</button>
                <button class="btn btn-xs btn-outline filter-category-btn w-full text-left" data-category="disabled">Disabled Support</button>
              </div>
            </div>
          </div>

          <!-- Schemes Grid Area -->
          <div>
            <div id="schemes-catalog-grid" class="grid grid-2">
              <!-- Dynamically populated by JS filter logic -->
            </div>
          </div>
        </div>
      </section>
    `;
  },

  renderSchemesGridItems(schemesList) {
    let listHTML = '';

    if (schemesList.length === 0) {
      return `<div class="card p-5 text-center text-muted w-full" style="grid-column: span 2;">No welfare schemes found matching search criteria.</div>`;
    }

    schemesList.forEach(s => {
      listHTML += `
        <div class="card flex flex-col justify-between card-accent-blue">
          <div>
            <h4 class="text-base font-bold mb-2">${s.scheme_name}</h4>
            <p class="text-sm text-muted mb-3" style="min-height: 60px;">${s.description}</p>
            
            <div class="p-3 bg-light rounded text-xs mb-3" style="background-color: var(--background-color); border-radius: var(--border-radius-md); line-height: 1.4;">
              <p class="mb-1"><strong>Eligibility:</strong> ${s.eligibility_criteria}</p>
              <p class="mb-1"><strong>Benefits:</strong> ${s.benefits}</p>
              <p><strong>Apply Deadline:</strong> <span class="text-danger font-semibold">${s.deadline}</span></p>
            </div>
          </div>
          <div class="flex justify-between align-center mt-2 border-top pt-2">
            <button class="btn btn-sm btn-outline-blue view-scheme-details w-full" data-id="${s.id}">View Apply Instructions</button>
          </div>
        </div>
      `;
    });

    return listHTML;
  },

  // 6. VOLUNTEER DASHBOARD VIEW
  renderVolunteerDashboard() {
    return `
      <section class="container py-5 text-left">
        <div class="flex justify-between align-center mb-5 md-flex-row gap-3">
          <div>
            <span class="badge badge-success">Staff Panel</span>
            <h2 class="mt-2 text-2xl">Sachivalayam Volunteer Dashboard</h2>
            <p class="text-muted text-sm">Verify citizen records, monitor scheme saturation, and broadcast alerts.</p>
          </div>
          <button id="btn-add-citizen-modal" class="btn btn-primary"><i data-lucide="plus" class="w-4 h-4"></i> Add Citizen Record</button>
        </div>

        <div class="grid grid-3 mb-5">
          <div class="stat-card">
            <div class="stat-icon text-success" style="background-color: var(--primary-light);">👥</div>
            <div>
              <p class="stat-num" id="vol-stat-citizens">0</p>
              <p class="stat-label">Assigned Citizens</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon text-warning" style="background-color: var(--warning-light);">⌛</div>
            <div>
              <p class="stat-num" id="vol-stat-pending">0</p>
              <p class="stat-label">Pending Verification</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon text-info" style="background-color: var(--info-light);">📡</div>
            <div>
              <p class="stat-num" id="vol-stat-alerts">0</p>
              <p class="stat-label">Broadcast Alerts</p>
            </div>
          </div>
        </div>

        <div class="grid grid-3" style="grid-template-columns: 2fr 1fr; gap: var(--spacing-6);">
          <!-- Citizens Directory Table -->
          <div>
            <div class="flex justify-between align-center mb-3">
              <h3 class="text-lg m-0">Citizen Directory</h3>
              <div class="search-container text-xs">
                <input type="text" id="vol-citizen-search" class="search-input text-xs" style="width: 150px;" placeholder="Search citizen...">
                <i data-lucide="search" class="w-3 h-3 text-muted"></i>
              </div>
            </div>

            <div class="table-wrapper">
              <table class="table" id="volunteer-citizens-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Demographics</th>
                    <th>Category</th>
                    <th>Verification</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Filled dynamically by script -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- Side Broadcast & Analytics Panel -->
          <div class="flex flex-col gap-5">
            <!-- Alert Creator -->
            <div class="card card-accent-green">
              <h4 class="text-sm font-bold uppercase mb-3"><i data-lucide="megaphone" class="w-4 h-4"></i> Trigger Mobile Alert</h4>
              <form id="volunteer-broadcast-form" class="flex flex-col gap-3">
                <div class="form-group m-0">
                  <label class="form-label text-xs">Target Group</label>
                  <select id="broad-target" class="form-control text-sm" required>
                    <option value="all">All Citizens</option>
                    <option value="student">Students</option>
                    <option value="farmer">Farmers</option>
                    <option value="senior_citizen">Senior Citizens</option>
                    <option value="widow">Widows</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
                <div class="form-group m-0">
                  <label class="form-label text-xs">Alert Title</label>
                  <input type="text" id="broad-title" class="form-control text-sm" placeholder="e.g. Pension Released" required>
                </div>
                <div class="form-group m-0">
                  <label class="form-label text-xs">SMS / In-App Message</label>
                  <textarea id="broad-msg" class="form-control text-sm" rows="3" placeholder="Message content..." required></textarea>
                </div>
                
                <div class="form-group m-0">
                  <label class="form-label text-xs">Communication Channel</label>
                  <div class="flex gap-3 mt-1">
                    <label class="flex align-center gap-1 text-xs"><input type="checkbox" class="broad-channel" value="sms" checked> SMS</label>
                    <label class="flex align-center gap-1 text-xs"><input type="checkbox" class="broad-channel" value="email" checked> Email</label>
                    <label class="flex align-center gap-1 text-xs"><input type="checkbox" class="broad-channel" value="in_app" checked> In-App</label>
                  </div>
                </div>

                <button type="submit" class="btn btn-sm btn-primary w-full mt-1">Broadcast Alert</button>
              </form>
            </div>

            <!-- Case Caseload Chart -->
            <div class="card card-accent-blue">
              <h4 class="text-sm font-bold uppercase mb-3">Caseload Analytics</h4>
              <div class="chart-container">
                <canvas id="vol-caseload-chart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  // 7. ADMIN DASHBOARD VIEW
  renderAdminDashboard() {
    return `
      <section class="container py-5 text-left">
        <div class="flex justify-between align-center mb-5 md-flex-row gap-3">
          <div>
            <span class="badge badge-danger">Director Portal</span>
            <h2 class="mt-2 text-2xl">Mandal/Admin Analytics Panel</h2>
            <p class="text-muted text-sm">System administration control panel. Configure schemes, monitor saturation, manage users.</p>
          </div>
          <div class="flex gap-2">
            <button id="btn-add-scheme-modal" class="btn btn-outline-blue"><i data-lucide="plus" class="w-4 h-4"></i> New Scheme</button>
            <button id="btn-add-user-modal" class="btn btn-primary"><i data-lucide="user-plus" class="w-4 h-4"></i> New User</button>
          </div>
        </div>

        <!-- System Analytics Charts Row -->
        <div class="grid grid-2 mb-5">
          <div class="card card-accent-blue">
            <h4 class="text-sm font-bold uppercase mb-3">Enrolled Citizens by Category</h4>
            <div class="chart-container" style="height: 250px;">
              <canvas id="admin-category-chart"></canvas>
            </div>
          </div>
          <div class="card card-accent-green">
            <h4 class="text-sm font-bold uppercase mb-3">Registrations Distribution per Welfare Scheme</h4>
            <div class="chart-container" style="height: 250px;">
              <canvas id="admin-scheme-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- Nav tabs for admin details -->
        <div class="flex gap-2 mb-4 border-bottom pb-2">
          <button class="btn btn-sm btn-primary admin-tab-btn" data-target="admin-panel-users">User Directory</button>
          <button class="btn btn-sm btn-outline admin-tab-btn" data-target="admin-panel-schemes">Configure Schemes</button>
          <button class="btn btn-sm btn-outline admin-tab-btn" data-target="admin-panel-broadcast">System Broadcast Logs</button>
        </div>

        <div id="admin-tabs-mount">
          <!-- Users table defaults -->
          ${this.renderAdminUsersTab()}
        </div>
      </section>
    `;
  },

  renderAdminUsersTab() {
    const users = window.db.getUsers();
    let rows = '';

    users.forEach(u => {
      rows += `
        <tr>
          <td>
            <div class="font-bold">${u.name}</div>
            <div class="text-xs text-muted">Aadhaar: ${u.aadhaar}</div>
          </td>
          <td>${u.mobile}<br><span class="text-xs text-muted">${u.email}</span></td>
          <td>${u.village}</td>
          <td>
            <span class="badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'volunteer' ? 'badge-success' : 'badge-info'}">
              ${u.role}
            </span>
          </td>
          <td>
            <div class="flex gap-1">
              <button class="btn btn-xs btn-outline admin-edit-user" data-id="${u.id}"><i data-lucide="edit-2" class="w-3 h-3"></i></button>
              ${u.role !== 'admin' ? `<button class="btn btn-xs btn-outline-danger admin-delete-user" data-id="${u.id}"><i data-lucide="trash-2" class="w-3 h-3"></i></button>` : ''}
            </div>
          </td>
        </tr>
      `;
    });

    return `
      <div id="admin-panel-users">
        <h3 class="text-lg mb-3">User Accounts Administration</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Name & Identifiers</th>
                <th>Contact info</th>
                <th>Village</th>
                <th>Role Access</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderAdminSchemesTab() {
    const schemes = window.db.getSchemes();
    let rows = '';

    schemes.forEach(s => {
      rows += `
        <tr>
          <td><strong>${s.scheme_name}</strong></td>
          <td><p class="text-xs text-muted" style="max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${s.description}</p></td>
          <td><span class="text-xs font-semibold">${s.deadline}</span></td>
          <td>${s.benefits}</td>
          <td>
            <div class="flex gap-1">
              <button class="btn btn-xs btn-outline admin-edit-scheme" data-id="${s.id}"><i data-lucide="edit" class="w-3 h-3"></i> Edit</button>
              <button class="btn btn-xs btn-outline-danger admin-delete-scheme" data-id="${s.id}"><i data-lucide="trash" class="w-3 h-3"></i> Delete</button>
            </div>
          </td>
        </tr>
      `;
    });

    return `
      <div id="admin-panel-schemes">
        <h3 class="text-lg mb-3">Welfare Schemes Configuration</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Scheme Name</th>
                <th>Criteria description</th>
                <th>Deadline Date</th>
                <th>Benefits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderAdminBroadcastTab() {
    const alerts = window.db.getNotifications();
    let rows = '';

    alerts.forEach(a => {
      rows += `
        <tr>
          <td><strong>${a.title}</strong></td>
          <td><p class="text-xs text-muted" style="max-width: 400px;">${a.message}</p></td>
          <td><span class="badge badge-info">${a.type}</span></td>
          <td><span class="text-xs">${new Date(a.date).toLocaleDateString()}</span></td>
          <td><span class="badge badge-role">${a.delivery_method}</span></td>
        </tr>
      `;
    });

    return `
      <div id="admin-panel-broadcast">
        <h3 class="text-lg mb-3">Historical Mobile Broadcasts</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Message Content</th>
                <th>Alert Type</th>
                <th>Broadcast Date</th>
                <th>Delivery Mode</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 8. FAQ PAGE VIEW
  renderFAQ() {
    return `
      <section class="container py-5 text-left" style="max-width: 800px;">
        <div class="text-center mb-5">
          <span class="badge badge-info">Help Desk</span>
          <h2 class="mt-2 text-3xl font-bold">Frequently Asked Questions</h2>
          <p class="text-muted text-sm">Find quick answers about welfare delivery, volunteer verification, and dashboard notifications.</p>
        </div>

        <div class="faq-list">
          <div class="faq-item">
            <button class="faq-trigger">
              <span>What is the Village Welfare Alert & Reminder System (VWARS)?</span>
              <i data-lucide="chevron-down" class="w-4 h-4"></i>
            </button>
            <div class="faq-content hidden">
              <p class="text-sm text-muted">VWARS is a digital initiative designed to connect rural citizens directly with state welfare programs. It includes automated eligibility checkers, door-to-door verification workflows for volunteers, and direct SMS/Email/In-App notifications for critical deadlines and disbursements.</p>
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-trigger">
              <span>How does the Auto Eligibility Checker work?</span>
              <i data-lucide="chevron-down" class="w-4 h-4"></i>
            </button>
            <div class="faq-content hidden">
              <p class="text-sm text-muted">When citizens register, their age, category (e.g. Student, Farmer, Senior Citizen), and gender are matched against the criteria set by administrators for each scheme. The system then displays exactly which schemes they qualify for, including reasons and deadlines.</p>
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-trigger">
              <span>What is the role of a Village Volunteer?</span>
              <i data-lucide="chevron-down" class="w-4 h-4"></i>
            </button>
            <div class="faq-content hidden">
              <p class="text-sm text-muted">Village Volunteers (assigned to specific clusters of households) are responsible for verifying citizen credentials, updating their profiles in case of occupation/category changes, assisting with registration, and sending localized SMS alerts (e.g. health camp alerts or pension releases) to their cluster.</p>
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-trigger">
              <span>How do I get notified about pension credits or scholarship deadlines?</span>
              <i data-lucide="chevron-down" class="w-4 h-4"></i>
            </button>
            <div class="faq-content hidden">
              <p class="text-sm text-muted">Notifications are sent dynamically when administrators or volunteers release alerts. In this simulation, you can see live notifications pop up on your dashboard or trigger simulated SMS and Email cards using the "Alert & SMS Simulator" float widget on the right.</p>
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-trigger">
              <span>Is my Aadhaar card verified?</span>
              <i data-lucide="chevron-down" class="w-4 h-4"></i>
            </button>
            <div class="faq-content hidden">
              <p class="text-sm text-muted">Yes, when a citizen registers, their Aadhaar number is checked for correct format. A Village Volunteer will review the profile and mark it as 'Verified' in their dashboard, after which the citizen is cleared for immediate scheme application and payouts.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  // 9. ABOUT PAGE VIEW
  renderAbout() {
    return `
      <section class="container py-5 text-left">
        <div class="text-center mb-5">
          <span class="badge badge-success">Overview</span>
          <h2 class="mt-2 text-3xl font-bold">About VWARS</h2>
          <p class="text-muted text-sm" style="max-width: 500px; margin: 0 auto;">Learn about the project purpose, architecture roles, and operational workflow.</p>
        </div>

        <div class="grid grid-2 mb-5">
          <div class="p-4 flex flex-col justify-center">
            <h3 class="text-xl mb-3">Modernizing Rural Governance</h3>
            <p class="text-sm text-muted mb-3">The Village Welfare Alert & Reminder System (VWARS) was built to solve a crucial social governance problem: **information asymmetry** in rural areas. While governments announce beneficial schemes, villagers often miss out due to lack of local awareness, delayed notifications, or missed document renewal dates.</p>
            <p class="text-sm text-muted">By leveraging a local role-based workflow (Citizen, Volunteer, Administrator), VWARS creates a transparent, efficient delivery pipeline ensuring no eligible household is left out.</p>
          </div>
          <div class="p-4 flex justify-center align-center">
            <div class="card bg-light w-full" style="background-color: var(--card-background); border: 1.5px solid var(--border-color);">
              <h4 class="text-base mb-3">Target Stakeholders</h4>
              <ul class="flex flex-col gap-3 text-sm text-muted">
                <li>👤 <strong>Villagers (Citizens):</strong> Discover schemes, receive SMS deadline/pension release alerts, track applications history.</li>
                <li>🤝 <strong>Village Volunteers:</strong> Verify citizen records at household doorstep, verify document eligibility, trigger bulk SMS.</li>
                <li>👑 <strong>Administrators:</strong> Configure schemes rules, manage user databases, review mandal analytics reports.</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 class="text-xl text-center mb-4 mt-5">System Architecture</h3>
        <div class="card p-5 text-center mb-5" style="background-color: var(--card-background); border: 1.5px solid var(--border-color);">
          <div class="flex justify-between align-center flex-wrap md-flex-row gap-4">
            <div class="p-3 bg-light rounded flex-grow text-center" style="background-color: var(--background-color); border-radius: var(--border-radius-md); flex: 1;">
              <h4 class="text-sm font-bold m-0 mb-1">1. Citizen Profiles</h4>
              <p class="text-xs text-muted">Database containing age, gender, occupation, categories (e.g. farmer, widow).</p>
            </div>
            <div class="text-xl mobile-only md-flex-row">➡️</div>
            <div class="p-3 bg-light rounded flex-grow text-center" style="background-color: var(--background-color); border-radius: var(--border-radius-md); flex: 1;">
              <h4 class="text-sm font-bold m-0 mb-1">2. Auto Checker</h4>
              <p class="text-xs text-muted">Algorithms verify citizen parameters against criteria rules of all schemes.</p>
            </div>
            <div class="text-xl mobile-only md-flex-row">➡️</div>
            <div class="p-3 bg-light rounded flex-grow text-center" style="background-color: var(--background-color); border-radius: var(--border-radius-md); flex: 1;">
              <h4 class="text-sm font-bold m-0 mb-1">3. Active Notification</h4>
              <p class="text-xs text-muted">Volunteers verify status and send automated alerts via SMS / Email simulator.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  // 10. PUBLIC ALERTS & SIMULATOR PAGE VIEW
  renderAlertsPage(notifications) {
    let listHTML = '';

    if (notifications.length === 0) {
      listHTML = `<div class="card p-5 text-center text-muted">No recent bulletins or announcements.</div>`;
    } else {
      notifications.forEach(notif => {
        // Border color accent class based on notification type
        let borderStyle = 'border-left: 5px solid var(--border-color);';
        if (notif.type === 'pension') borderStyle = 'border-left: 5px solid var(--primary-color);';
        else if (notif.type === 'scholarship') borderStyle = 'border-left: 5px solid var(--secondary-color);';
        else if (notif.type === 'health') borderStyle = 'border-left: 5px solid var(--warning-color);';
        else if (notif.type === 'agriculture') borderStyle = 'border-left: 5px solid #20c997;';
        else if (notif.type === 'aadhaar' || notif.type === 'reminder') borderStyle = 'border-left: 5px solid var(--danger-color);';

        listHTML += `
          <div class="p-4 mb-3" style="background-color: var(--card-background); border: 1.5px solid var(--border-color); ${borderStyle} border-radius: var(--border-radius-md);">
            <div class="flex justify-between align-center mb-2">
              <h4 class="text-base m-0 flex align-center gap-2">
                ${notif.title}
                ${notif.status === 'unread' && notif.user_id !== 'all' ? '<span class="badge badge-danger">New</span>' : ''}
              </h4>
              <span class="text-xs text-muted">${new Date(notif.date).toLocaleDateString()}</span>
            </div>
            <p class="text-sm mb-3">${notif.message}</p>
            <div class="flex gap-2 justify-between align-center text-xs">
              <span class="badge badge-role text-xs">Channel: ${notif.delivery_method.toUpperCase()}</span>
              <span class="text-muted">Broadcast Feed</span>
            </div>
          </div>
        `;
      });
    }

    return `
      <section class="container py-5 text-left">
        <div class="text-center mb-5">
          <span class="badge badge-success">Portal Feed</span>
          <h2 class="mt-2 text-3xl font-bold">Alerts & Announcements Centre</h2>
          <p class="text-muted text-sm" style="max-width: 500px; margin: 0 auto;">Stay updated with official Gram Panchayat welfare announcements, pension disbursements, and direct reminders.</p>
        </div>

        <div class="alerts-grid">
          <!-- Left Column: Announcements Feed -->
          <div>
            <h3 class="text-xl mb-4"><i data-lucide="bell" class="inline-block w-5 h-5 mr-1" style="vertical-align: middle;"></i> Recent Bulletins & Alerts</h3>
            <div class="flex flex-col gap-3">
              ${listHTML}
            </div>
          </div>

          <!-- Right Column: Interactive Testing Console & Quick Session Swap -->
          <div class="flex flex-col gap-5">
            <!-- Interactive Simulator Card -->
            <div class="card card-accent-green" style="padding: var(--spacing-4);">
              <h4 class="text-base font-bold mb-2"><i data-lucide="terminal" class="inline-block w-4 h-4 mr-1" style="vertical-align: middle;"></i> Alert & SMS Simulator</h4>
              <p class="text-xs text-muted mb-3" style="line-height: 1.4;">Trigger simulated notifications to experience citizen alert features (SMS, Email, or In-App toasts) in real-time.</p>
              
              <div class="simulator-group" style="margin-bottom: var(--spacing-3); padding-bottom: var(--spacing-3); border-bottom: 1px solid var(--border-color);">
                <h5 class="text-xs font-bold uppercase mb-2" style="font-size: 0.75rem; letter-spacing: 0.5px; color: var(--text-muted);">Quick Scheme Alerts</h5>
                <div class="flex flex-col gap-2">
                  <button class="btn btn-sm btn-outline-blue sim-trigger" data-type="pension">👵 Pension Release Alert</button>
                  <button class="btn btn-sm btn-outline-blue sim-trigger" data-type="scholarship">🎓 Scholarship Deadline</button>
                  <button class="btn btn-sm btn-outline-blue sim-trigger" data-type="health">🏥 Health Camp Schedule</button>
                  <button class="btn btn-sm btn-outline-blue sim-trigger" data-type="agriculture">🌾 Farmer Subsidy Release</button>
                </div>
              </div>

              <div class="simulator-group" style="border: none; margin-bottom: 0; padding-bottom: 0;">
                <h5 class="text-xs font-bold uppercase mb-2" style="font-size: 0.75rem; letter-spacing: 0.5px; color: var(--text-muted);">Document Reminders</h5>
                <div class="flex flex-col gap-2">
                  <button class="btn btn-sm btn-outline-green sim-trigger" data-type="aadhaar">🪪 Aadhaar-Ration Link Reminder</button>
                  <button class="btn btn-sm btn-outline-green sim-trigger" data-type="income">📄 Income Certificate Renewal</button>
                </div>
              </div>
            </div>

            <!-- Quick Session Switcher Card -->
            <div class="card card-accent-blue" style="padding: var(--spacing-4);">
              <h4 class="text-base font-bold mb-2"><i data-lucide="users" class="inline-block w-4 h-4 mr-1" style="vertical-align: middle;"></i> Active Session Quick-Swap</h4>
              <p class="text-xs text-muted mb-3" style="line-height: 1.4;">Quickly switch between user roles to view the portal from different access perspectives.</p>
              <div class="flex flex-wrap gap-2">
                <button class="btn btn-xs btn-outline-gray quick-login" data-user="admin" style="font-size: 0.75rem;">Admin</button>
                <button class="btn btn-xs btn-outline-gray quick-login" data-user="volunteer" style="font-size: 0.75rem;">Volunteer</button>
                <button class="btn btn-xs btn-outline-gray quick-login" data-user="citizen" style="font-size: 0.75rem;">Citizen</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
};
