/* ==========================================================================
   DATABASE LAYER - LOCALSTORAGE RELATIONAL MODEL
   ========================================================================== */

const DB_KEYS = {
  USERS: 'vw_users',
  CITIZENS: 'vw_citizens',
  SCHEMES: 'vw_schemes',
  NOTIFICATIONS: 'vw_notifications',
  APPLICATIONS: 'vw_applications',
  REMINDERS: 'vw_reminders'
};

// Seed Data
const DEFAULT_SCHEMES = [
  {
    id: 'sch_1',
    scheme_name: 'Old Age Pension Scheme',
    description: 'Monthly pension support of ₹3,000 for elderly village citizens to ensure financial dignity.',
    eligibility_criteria: 'Age 60 years or above, categorized as Senior Citizen.',
    eligibility_rules: { age_min: 60, categories: ['senior_citizen'] },
    deadline: '2026-12-31',
    benefits: '₹3,000 per month direct bank transfer.',
    apply_instructions: 'Submit age proof, residence certificate, and Aadhaar card at the local Sachivalayam.'
  },
  {
    id: 'sch_2',
    scheme_name: 'Post-Matric Student Scholarship',
    description: 'Financial assistance to students from low-income families pursuing higher education.',
    eligibility_criteria: 'Age 25 years or below, categorized as Student, studying in recognized institutes.',
    eligibility_rules: { age_max: 25, categories: ['student'] },
    deadline: '2026-06-30',
    benefits: '100% tuition fee reimbursement + ₹10,000 yearly hostel allowance.',
    apply_instructions: 'Apply online on the scholarship portal. Upload income certificate, caste certificate, and mark sheets.'
  },
  {
    id: 'sch_3',
    scheme_name: 'YSR Farmer Subsidy Scheme',
    description: 'Financial assistance and input subsidies for farmers to purchase seeds, fertilizers, and equipment.',
    eligibility_criteria: 'Categorized as Farmer, owning agricultural land in the village boundary.',
    eligibility_rules: { categories: ['farmer'] },
    deadline: '2026-08-15',
    benefits: '₹13,500 annual support in three installments.',
    apply_instructions: 'Register land records (Pattadar Passbook) with the Village Agriculture Assistant (VAA).'
  },
  {
    id: 'sch_4',
    scheme_name: 'Widow Pension Support',
    description: 'Welfare pension program to support widows and single women living in rural areas.',
    eligibility_criteria: 'Female gender, categorized as Widow, age 18 years or above.',
    eligibility_rules: { age_min: 18, genders: ['female'], categories: ['widow'] },
    deadline: '2026-11-30',
    benefits: '₹3,000 monthly pension and health insurance coverage.',
    apply_instructions: 'Submit husband\'s death certificate, self-declaration form, and bank account statement at the Sachivalayam.'
  },
  {
    id: 'sch_5',
    scheme_name: 'Dr. YSR Aarogyasri Health Insurance',
    description: 'Universal health insurance cover for lower and middle-income families for tertiary care treatment.',
    eligibility_criteria: 'Open to all categories, rural household index card holders.',
    eligibility_rules: { categories: ['student', 'farmer', 'senior_citizen', 'widow', 'disabled', 'general'] },
    deadline: '2026-12-31',
    benefits: 'Free cashless inpatient healthcare up to ₹5 Lakhs per year in network hospitals.',
    apply_instructions: 'Get the Aarogyasri card generated through the local Volunteer. Bring ration card and Aadhaar card.'
  },
  {
    id: 'sch_6',
    scheme_name: 'Free Skill Development Training',
    description: 'Technical and vocational training program for rural youth to build employability skills.',
    eligibility_criteria: 'Age between 18 and 35 years. Categorized as Student or General.',
    eligibility_rules: { age_min: 18, age_max: 35, categories: ['student', 'general'] },
    deadline: '2026-07-20',
    benefits: '3-month certified training in IT, Retail, or Electronics, including free lodging and placements.',
    apply_instructions: 'Fill up the Skill Registry form. Volunteer verification required.'
  },
  {
    id: 'sch_7',
    scheme_name: 'Gram Panchayat Housing Assistance',
    description: 'Financial support for constructing permanent (pucca) houses for homeless rural families.',
    eligibility_criteria: 'Low-income family. Categorized as Senior Citizen, Widow, Farmer, Disabled, or General.',
    eligibility_rules: { categories: ['senior_citizen', 'widow', 'farmer', 'disabled', 'general'] },
    deadline: '2026-09-10',
    benefits: '₹1.80 Lakhs subsidy for house construction in 4 stages.',
    apply_instructions: 'Apply through your ward volunteer. Land ownership document (patta) must be submitted.'
  },
  {
    id: 'sch_8',
    scheme_name: 'Divyangan Disability Support Pension',
    description: 'Pension and assistance for citizens with physical disabilities to enable self-reliance.',
    eligibility_criteria: 'Minimum 40% disability certified by SADAREM. Categorized as Disabled.',
    eligibility_rules: { categories: ['disabled'] },
    deadline: '2026-12-31',
    benefits: '₹3,000 monthly pension and free assistive aids (wheelchairs, hearing aids).',
    apply_instructions: 'Provide SADAREM disability certificate, Aadhaar card, and photo showing disability.'
  },
  {
    id: 'sch_9',
    scheme_name: 'Smart Ration Card Benefits',
    description: 'Distribution of subsidized essential commodities (rice, wheat, sugar, oil, pulses) to village households.',
    eligibility_criteria: 'Open to all categories, subject to economic verification status.',
    eligibility_rules: { categories: ['student', 'farmer', 'senior_citizen', 'widow', 'disabled', 'general'] },
    deadline: '2026-10-31',
    benefits: 'Subsidized food grains: Rice at ₹1/kg, sugar at ₹13.50/kg, wheat at ₹2/kg.',
    apply_instructions: 'Apply online for a new Ration Card or link Aadhaar with existing cards through the Volunteer.'
  },
  {
    id: 'sch_10',
    scheme_name: 'Agricultural Equipment Subsidy Scheme',
    description: 'Subsidy on buying tractors, seed drills, harvesters, and irrigation pumps.',
    eligibility_criteria: 'Categorized as Farmer, possessing a valid Rythu Bharosa Card.',
    eligibility_rules: { categories: ['farmer'] },
    deadline: '2026-08-30',
    benefits: '40% to 50% subsidy on purchases of modern farm implements.',
    apply_instructions: 'Submit quotation of equipment, land passbook, and bank details on the Rythu Seva portal.'
  }
];

const DEFAULT_USERS = [
  {
    id: 'user_admin',
    name: 'Panchayat Secretary (Admin)',
    mobile: '9999999999',
    aadhaar: '123412341234',
    village: 'Digital Gram',
    role: 'admin',
    email: 'admin@village.gov',
    password: 'admin123'
  },
  {
    id: 'user_volunteer',
    name: 'Ramu K (Volunteer)',
    mobile: '8888888888',
    aadhaar: '567856785678',
    village: 'Digital Gram',
    role: 'volunteer',
    email: 'volunteer@village.gov',
    password: 'volunteer123'
  },
  {
    id: 'user_citizen',
    name: 'Laxmi Devi (Citizen)',
    mobile: '7777777777',
    aadhaar: '901290129012',
    village: 'Digital Gram',
    role: 'citizen',
    email: 'citizen@village.gov',
    password: 'citizen123'
  }
];

const DEFAULT_CITIZENS = [
  {
    id: 'user_citizen', // references user table
    age: 62,
    gender: 'female',
    category: 'senior_citizen',
    occupation: 'Agriculture Laborer',
    eligibility_status: 'verified'
  }
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'not_1',
    user_id: 'all',
    title: '📢 Mega Health Camp Schedule',
    message: 'A Free Medical Diagnostics & Treatment Camp is scheduled at the Gram Panchayat Building on Sunday, June 14, 2026 from 9:00 AM to 5:00 PM. Specialists in Cardiology, Pediatrics, and General Medicine will be present. Free medicines will be distributed.',
    date: '2026-06-10T09:30:00.000Z',
    status: 'unread',
    type: 'health',
    delivery_method: 'in_app'
  },
  {
    id: 'not_2',
    user_id: 'user_citizen',
    title: '👵 Old Age Pension Credited',
    message: 'Your monthly Old Age Pension benefit of ₹3,000 for the month of June 2026 has been successfully credited directly to your registered bank account (Aadhaar linked state bank).',
    date: '2026-06-11T08:00:00.000Z',
    status: 'unread',
    type: 'pension',
    delivery_method: 'sms'
  },
  {
    id: 'not_3',
    user_id: 'all',
    title: '🎓 Student Scholarship Deadline approaching',
    message: 'Students registered for the Post-Matric Scholarship Scheme are reminded that the application window closes on June 30, 2026. Please complete your registration and submit documents to the volunteer immediately.',
    date: '2026-06-08T10:15:00.000Z',
    status: 'read',
    type: 'scholarship',
    delivery_method: 'in_app'
  },
  {
    id: 'not_4',
    user_id: 'user_citizen',
    title: '🪪 Income Certificate Renewal Due',
    message: 'Your Income Certificate is expiring on June 25, 2026. Please apply for a fresh income certificate immediately to avoid disruptions in active welfare benefits.',
    date: '2026-06-10T16:00:00.000Z',
    status: 'unread',
    type: 'reminder',
    delivery_method: 'email'
  }
];

const DEFAULT_APPLICATIONS = [
  {
    id: 'app_1',
    citizen_id: 'user_citizen',
    scheme_id: 'sch_1',
    apply_date: '2026-05-15',
    status: 'approved'
  },
  {
    id: 'app_2',
    citizen_id: 'user_citizen',
    scheme_id: 'sch_5',
    apply_date: '2026-05-20',
    status: 'approved'
  }
];

const DEFAULT_REMINDERS = [
  {
    id: 'rem_1',
    citizen_id: 'user_citizen',
    scheme_id: 'sch_1',
    notification_type: 'pension',
    date: '2026-06-11 08:00',
    channel: 'sms'
  },
  {
    id: 'rem_2',
    citizen_id: 'user_citizen',
    scheme_id: 'sch_5',
    notification_type: 'health',
    date: '2026-06-10 09:30',
    channel: 'sms'
  }
];

let localDbCache = {};
let useLocalStorageFallback = false;

window.db = {
  // Load database or initialize if empty
  async init() {
    try {
      const response = await fetch('/api/db');
      const data = await response.json();
      
      if (!data || Object.keys(data).length === 0) {
        // Create initial default DB
        localDbCache = {
          [DB_KEYS.USERS]: DEFAULT_USERS,
          [DB_KEYS.CITIZENS]: DEFAULT_CITIZENS,
          [DB_KEYS.SCHEMES]: DEFAULT_SCHEMES,
          [DB_KEYS.NOTIFICATIONS]: DEFAULT_NOTIFICATIONS,
          [DB_KEYS.APPLICATIONS]: DEFAULT_APPLICATIONS,
          [DB_KEYS.REMINDERS]: DEFAULT_REMINDERS
        };
        await this.syncAsync();
      } else {
        localDbCache = data;
        this.ensureDefaults();
      }
      console.log("Database initialized from server:", localDbCache);
    } catch (e) {
      console.warn("Failed to fetch database from server, using localStorage fallback:", e);
      useLocalStorageFallback = true;
      this.initLocalStorageFallback();
    }
  },

  ensureDefaults() {
    let updated = false;
    
    const verifyDefaults = (key, defaults) => {
      if (!Array.isArray(localDbCache[key])) {
        localDbCache[key] = defaults;
        updated = true;
      } else {
        defaults.forEach(defItem => {
          if (!localDbCache[key].some(item => item.id === defItem.id)) {
            localDbCache[key].push(defItem);
            updated = true;
          }
        });
      }
    };

    verifyDefaults(DB_KEYS.USERS, DEFAULT_USERS);
    verifyDefaults(DB_KEYS.CITIZENS, DEFAULT_CITIZENS);
    verifyDefaults(DB_KEYS.SCHEMES, DEFAULT_SCHEMES);
    verifyDefaults(DB_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    verifyDefaults(DB_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS);
    verifyDefaults(DB_KEYS.REMINDERS, DEFAULT_REMINDERS);

    if (updated) {
      this.sync();
    }
  },

  initLocalStorageFallback() {
    const ensureDefaults = (key, defaults) => {
      const stored = localStorage.getItem(key);
      if (!stored) {
        localStorage.setItem(key, JSON.stringify(defaults));
      } else {
        try {
          const current = JSON.parse(stored);
          if (Array.isArray(current)) {
            let updated = false;
            defaults.forEach(defItem => {
              if (!current.some(item => item.id === defItem.id)) {
                current.push(defItem);
                updated = true;
              }
            });
            if (updated) {
              localStorage.setItem(key, JSON.stringify(current));
            }
          }
        } catch (e) {
          localStorage.setItem(key, JSON.stringify(defaults));
        }
      }
    };

    ensureDefaults(DB_KEYS.USERS, DEFAULT_USERS);
    ensureDefaults(DB_KEYS.CITIZENS, DEFAULT_CITIZENS);
    ensureDefaults(DB_KEYS.SCHEMES, DEFAULT_SCHEMES);
    ensureDefaults(DB_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    ensureDefaults(DB_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS);
    ensureDefaults(DB_KEYS.REMINDERS, DEFAULT_REMINDERS);

    console.log("Database Layer Initialized with LocalStorage Fallback.");
  },

  // Read utilities
  get(key) {
    if (useLocalStorageFallback) {
      return JSON.parse(localStorage.getItem(key)) || [];
    }
    return localDbCache[key] || [];
  },

  // Write utilities
  set(key, data) {
    if (useLocalStorageFallback) {
      localStorage.setItem(key, JSON.stringify(data));
      return;
    }
    localDbCache[key] = data;
    this.sync();
  },

  // Asynchronous sync to server
  sync() {
    fetch('/api/db', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(localDbCache)
    }).catch(e => console.error("Database sync failed:", e));
  },

  // Synchronous/blocking-like sync during init
  async syncAsync() {
    await fetch('/api/db', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(localDbCache)
    });
  },

  // Users CRUD
  getUsers() {
    return this.get(DB_KEYS.USERS);
  },
  
  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  },

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
  },

  saveUser(user) {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex > -1) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.push(user);
    }
    this.set(DB_KEYS.USERS, users);
    return user;
  },

  deleteUser(id) {
    let users = this.getUsers();
    users = users.filter(u => u.id !== id);
    this.set(DB_KEYS.USERS, users);
    
    // Also delete associated citizen profile if role was citizen
    let citizens = this.getCitizens();
    citizens = citizens.filter(c => c.id !== id);
    this.set(DB_KEYS.CITIZENS, citizens);

    // Also delete associated applications
    let applications = this.getApplications();
    applications = applications.filter(a => a.citizen_id !== id);
    this.set(DB_KEYS.APPLICATIONS, applications);
  },

  // Citizens CRUD
  getCitizens() {
    return this.get(DB_KEYS.CITIZENS);
  },

  getCitizenById(id) {
    return this.getCitizens().find(c => c.id === id);
  },

  saveCitizen(citizen) {
    const citizens = this.getCitizens();
    const existingIndex = citizens.findIndex(c => c.id === citizen.id);
    if (existingIndex > -1) {
      citizens[existingIndex] = { ...citizens[existingIndex], ...citizen };
    } else {
      citizens.push(citizen);
    }
    this.set(DB_KEYS.CITIZENS, citizens);
    return citizen;
  },

  // Schemes CRUD
  getSchemes() {
    return this.get(DB_KEYS.SCHEMES);
  },

  getSchemeById(id) {
    return this.getSchemes().find(s => s.id === id);
  },

  saveScheme(scheme) {
    const schemes = this.getSchemes();
    const existingIndex = schemes.findIndex(s => s.id === scheme.id);
    if (existingIndex > -1) {
      schemes[existingIndex] = { ...schemes[existingIndex], ...scheme };
    } else {
      if (!scheme.id) scheme.id = 'sch_' + Date.now();
      schemes.push(scheme);
    }
    this.set(DB_KEYS.SCHEMES, schemes);
    return scheme;
  },

  deleteScheme(id) {
    let schemes = this.getSchemes();
    schemes = schemes.filter(s => s.id !== id);
    this.set(DB_KEYS.SCHEMES, schemes);
  },

  // Notifications CRUD
  getNotifications() {
    return this.get(DB_KEYS.NOTIFICATIONS);
  },

  getUserNotifications(userId) {
    return this.getNotifications().filter(n => n.user_id === 'all' || n.user_id === userId);
  },

  saveNotification(notification) {
    const notifications = this.getNotifications();
    if (!notification.id) notification.id = 'not_' + Date.now();
    if (!notification.date) notification.date = new Date().toISOString();
    if (!notification.status) notification.status = 'unread'; // Default to unread
    notifications.unshift(notification); // add to beginning
    this.set(DB_KEYS.NOTIFICATIONS, notifications);
    return notification;
  },

  markNotificationAsRead(notifId) {
    const notifications = this.getNotifications();
    const notif = notifications.find(n => n.id === notifId);
    if (notif) {
      notif.status = 'read';
      this.set(DB_KEYS.NOTIFICATIONS, notifications);
    }
  },

  // Applications CRUD
  getApplications() {
    return this.get(DB_KEYS.APPLICATIONS);
  },

  getCitizenApplications(citizenId) {
    return this.getApplications().filter(a => a.citizen_id === citizenId);
  },

  saveApplication(application) {
    const applications = this.getApplications();
    const existingIndex = applications.findIndex(a => a.citizen_id === application.citizen_id && a.scheme_id === application.scheme_id);
    if (existingIndex > -1) {
      applications[existingIndex] = { ...applications[existingIndex], ...application };
    } else {
      if (!application.id) application.id = 'app_' + Date.now();
      if (!application.apply_date) application.apply_date = new Date().toISOString().split('T')[0];
      applications.push(application);
    }
    this.set(DB_KEYS.APPLICATIONS, applications);
    return application;
  },

  // Reminders History CRUD
  getReminders() {
    return this.get(DB_KEYS.REMINDERS);
  },

  getCitizenReminders(citizenId) {
    return this.getReminders().filter(r => r.citizen_id === citizenId);
  },

  saveReminder(reminder) {
    const reminders = this.getReminders();
    if (!reminder.id) reminder.id = 'rem_' + Date.now();
    if (!reminder.date) {
      const now = new Date();
      reminder.date = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    }
    reminders.unshift(reminder);
    this.set(DB_KEYS.REMINDERS, reminders);
    return reminder;
  }
};
