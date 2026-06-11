/* ==========================================================================
   AUTHENTICATION & SESSION MANAGER
   ========================================================================== */

const SESSION_KEY = 'vw_active_session';

window.auth = {
  // Check if a user is logged in
  isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) !== null;
  },

  // Get current logged-in user details
  getCurrentUser() {
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;
    
    const baseUser = JSON.parse(sessionData);
    const users = window.db.getUsers();
    
    // Refresh user details from DB to get up-to-date role/info
    const freshUser = users.find(u => u.id === baseUser.id);
    if (!freshUser) {
      this.logout();
      return null;
    }

    // If citizen role, attach demographic information from Citizens table
    if (freshUser.role === 'citizen') {
      const citizenData = window.db.getCitizenById(freshUser.id);
      if (citizenData) {
        return { ...freshUser, profile: citizenData };
      }
    }
    
    return freshUser;
  },

  // Login verification
  login(loginKey, password) {
    const users = window.db.getUsers();
    
    // Accept email, mobile, or Aadhaar as login key
    const user = users.find(u => 
      ((u.email && u.email.toLowerCase() === loginKey.toLowerCase()) || 
       u.mobile === loginKey || 
       u.aadhaar === loginKey) && 
      u.password === password
    );

    if (!user) {
      return { success: false, message: 'Invalid credentials. Please verify your username and password.' };
    }

    // Save user basic session details
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      id: user.id,
      name: user.name,
      role: user.role
    }));

    return { success: true, user };
  },

  // Logout current user
  logout() {
    sessionStorage.removeItem(SESSION_KEY);
    return true;
  },

  // Citizen Registration
  registerCitizen(formData) {
    const { name, mobile, aadhaar, village, age, gender, occupation, category, password } = formData;

    // 1. Validations
    if (!name || name.trim().length < 3) {
      return { success: false, message: 'Name must be at least 3 characters long.' };
    }

    // Mobile validation (10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number starting with 6-9.' };
    }

    // Aadhaar validation (12 digits, demo validation)
    const cleanAadhaar = aadhaar.replace(/\s+/g, '');
    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(cleanAadhaar)) {
      return { success: false, message: 'Please enter a valid 12-digit Aadhaar Number.' };
    }

    // Age validation
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 120) {
      return { success: false, message: 'Please enter a valid age between 0 and 120.' };
    }

    // Password validation
    if (!password || password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }

    // 2. Check duplicates (Mobile or Aadhaar)
    const users = window.db.getUsers();
    const isDuplicate = users.some(u => u.mobile === mobile || u.aadhaar === cleanAadhaar);
    if (isDuplicate) {
      return { success: false, message: 'An account with this Mobile Number or Aadhaar already exists.' };
    }

    // 3. Create User record
    const userId = 'usr_' + Date.now();
    const newUser = {
      id: userId,
      name,
      mobile,
      aadhaar: cleanAadhaar,
      village,
      role: 'citizen',
      email: `${mobile}@village.gov`, // auto generated login email
      password
    };

    // 4. Create Citizen profile record
    const newCitizen = {
      id: userId,
      age: parsedAge,
      gender,
      category,
      occupation,
      eligibility_status: 'pending' // default status for newly registered
    };

    // Save to DB
    window.db.saveUser(newUser);
    window.db.saveCitizen(newCitizen);

    // Auto log in after registration
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      id: newUser.id,
      name: newUser.name,
      role: newUser.role
    }));

    return { success: true, user: newUser };
  },

  // Role verification helper
  checkRole(allowedRoles = []) {
    const user = this.getCurrentUser();
    if (!user) return false;
    return allowedRoles.includes(user.role);
  }
};
