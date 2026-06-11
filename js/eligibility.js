window.eligibility = {
  /**
   * Check if a citizen is eligible for a specific scheme.
   * @param {Object} citizenProfile - Citizen record { age, gender, category, occupation }
   * @param {Object} schemeRules - Scheme eligibility config { age_min, age_max, genders, categories }
   * @returns {Object} { eligible: boolean, reasons: Array<string>, failedCriteria: Array<string> }
   */
  check(citizenProfile, schemeRules) {
    const reasons = [];
    const failedCriteria = [];
    let eligible = true;

    if (!citizenProfile || !schemeRules) {
      return { eligible: false, reasons: ['Missing profile or eligibility criteria'], failedCriteria: ['general'] };
    }

    const { age, gender, category } = citizenProfile;

    // 1. Age Verification
    if (schemeRules.age_min !== undefined) {
      if (age < schemeRules.age_min) {
        eligible = false;
        failedCriteria.push('age');
        reasons.push(`Minimum age required is ${schemeRules.age_min} years (Current: ${age} years).`);
      } else {
        reasons.push(`Age limit verified (Current: ${age} >= Min: ${schemeRules.age_min}).`);
      }
    }

    if (schemeRules.age_max !== undefined) {
      if (age > schemeRules.age_max) {
        eligible = false;
        failedCriteria.push('age');
        reasons.push(`Maximum age allowed is ${schemeRules.age_max} years (Current: ${age} years).`);
      } else {
        reasons.push(`Age limit verified (Current: ${age} <= Max: ${schemeRules.age_max}).`);
      }
    }

    // 2. Gender Verification
    if (schemeRules.genders && schemeRules.genders.length > 0) {
      const citizenGender = String(gender).toLowerCase();
      const allowedGenders = schemeRules.genders.map(g => String(g).toLowerCase());
      
      if (!allowedGenders.includes(citizenGender)) {
        eligible = false;
        failedCriteria.push('gender');
        reasons.push(`Scheme restricted to ${schemeRules.genders.join(', ')} (Citizen: ${gender}).`);
      } else {
        reasons.push(`Gender verification successful.`);
      }
    }

    // 3. Category Verification
    if (schemeRules.categories && schemeRules.categories.length > 0) {
      const citizenCategory = String(category).toLowerCase();
      const allowedCategories = schemeRules.categories.map(c => String(c).toLowerCase());

      if (!allowedCategories.includes(citizenCategory)) {
        eligible = false;
        failedCriteria.push('category');
        
        // Format category name for human readable print
        const formattedAllowed = schemeRules.categories.map(c => this.formatCategoryName(c));
        reasons.push(`Requires Citizen Category: ${formattedAllowed.join(' or ')} (Current: ${this.formatCategoryName(category)}).`);
      } else {
        reasons.push(`Citizen Category matches eligibility criteria.`);
      }
    }

    return {
      eligible,
      reasons,
      failedCriteria
    };
  },

  /**
   * Helper to format technical category keys for the UI
   */
  formatCategoryName(categoryKey) {
    const categoriesMap = {
      student: 'Student',
      farmer: 'Farmer',
      senior_citizen: 'Senior Citizen',
      widow: 'Widow',
      disabled: 'Disabled (Divyangan)',
      general: 'General Citizen'
    };
    return categoriesMap[categoryKey.toLowerCase()] || categoryKey;
  },

  /**
   * Evaluates all schemes in the database for a single citizen and returns eligible ones.
   */
  evaluateAll(citizenProfile, schemes) {
    return schemes.map(scheme => {
      const evaluation = this.check(citizenProfile, scheme.eligibility_rules);
      return {
        ...scheme,
        evaluation
      };
    });
  }
};
