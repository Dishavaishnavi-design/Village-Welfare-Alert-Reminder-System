/**
 * Elegance Boutique - Interactive JavaScript
 * Modern, Vanilla JS (No External Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initStickyHeader();
  initMobileMenu();
  initActiveNavLinkOnScroll();
  initScrollReveal();
  initGalleryFiltering();
  initGalleryLightbox();
  initFaqAccordion();
  initEnquiryFormValidation();
  initProductEnquiryTriggers();
  initBackToTop();
  initDynamicYear();
});

/* ==========================================================================
   1. STICKY HEADER WITH SHADOW ON SCROLL
   ========================================================================== */
function initStickyHeader() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ==========================================================================
   2. MOBILE HAMBURGER MENU
   ========================================================================== */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburgerBtn || !navMenu) return;

  function toggleMenu() {
    const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Prevent body scroll when menu is open on mobile
    if (!isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function closeMenu() {
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', toggleMenu);

  // Close menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !hamburgerBtn.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   3. ACTIVE NAVIGATION LINK HIGHLIGHT ON SCROLL
   ========================================================================== */
function initActiveNavLinkOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   4. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   5. GALLERY CATEGORY FILTERING
   ========================================================================== */
function initGalleryFiltering() {
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const triggerBtns = document.querySelectorAll('.filter-btn-trigger');

  if (!galleryItems.length) return;

  function filterCategory(category) {
    const targetFilter = category.toLowerCase();

    // Update active button
    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-filter') === targetFilter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Filter items
    galleryItems.forEach(item => {
      const itemCat = item.getAttribute('data-category');
      if (targetFilter === 'all' || itemCat === targetFilter) {
        item.classList.remove('hide');
        item.style.display = 'block';
      } else {
        item.classList.add('hide');
        item.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterCategory(filter);
    });
  });

  // Category trigger links from collections section
  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cat = btn.getAttribute('data-category');
      if (cat) {
        let mappedCat = 'all';
        if (cat === 'Sarees') mappedCat = 'saree';
        else if (cat === 'Blouses') mappedCat = 'blouse';
        else if (cat === 'Lehengas') mappedCat = 'lehenga';

        filterCategory(mappedCat);

        // Smooth scroll to gallery
        const gallerySection = document.getElementById('gallery');
        if (gallerySection) {
          gallerySection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* ==========================================================================
   6. GALLERY LIGHTBOX MODAL
   ========================================================================== */
function initGalleryLightbox() {
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

  if (!lightboxModal || !galleryItems.length) return;

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const currentItem = galleryItems[currentIndex];
    const imgObj = currentItem.querySelector('.gallery-img');
    const captionObj = currentItem.querySelector('.gallery-caption');

    if (imgObj) {
      lightboxImg.src = imgObj.src;
      lightboxImg.alt = imgObj.alt || 'Boutique Gallery Image';
    }
    if (captionObj) {
      lightboxCaption.textContent = captionObj.textContent;
    }

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  // Close on backdrop click
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* ==========================================================================
   7. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  if (!faqQuestions.length) return;

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const faqItem = btn.parentElement;
      const isOpen = faqItem.classList.contains('active');

      // Close all active items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const qBtn = item.querySelector('.faq-question');
        if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked item
      if (!isOpen) {
        faqItem.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   8. ENQUIRY FORM VALIDATION & DEMO SUBMISSION
   ========================================================================== */
function initEnquiryFormValidation() {
  const enquiryForm = document.getElementById('enquiryForm');
  const successAlert = document.getElementById('formSuccessMessage');

  if (!enquiryForm) return;

  // Set minimum date to today
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  const fields = {
    fullName: {
      input: document.getElementById('fullName'),
      error: document.getElementById('fullNameError'),
      validate: (val) => val.trim().length >= 2 ? '' : 'Please enter your full name (at least 2 characters).'
    },
    phoneNumber: {
      input: document.getElementById('phoneNumber'),
      error: document.getElementById('phoneNumberError'),
      validate: (val) => {
        const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]{7,15}$/;
        return phoneRegex.test(val.trim()) ? '' : 'Please enter a valid phone number.';
      }
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val.trim()) ? '' : 'Please enter a valid email address.';
      }
    },
    category: {
      input: document.getElementById('category'),
      error: document.getElementById('categoryError'),
      validate: (val) => val !== '' ? '' : 'Please select a category.'
    },
    preferredDate: {
      input: document.getElementById('preferredDate'),
      error: document.getElementById('preferredDateError'),
      validate: (val) => val !== '' ? '' : 'Please select your preferred visit date.'
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('messageError'),
      validate: (val) => val.trim().length >= 5 ? '' : 'Please enter your message (at least 5 characters).'
    }
  };

  // Real-time blur validation
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    if (field.input) {
      field.input.addEventListener('blur', () => {
        const errorMsg = field.validate(field.input.value);
        if (errorMsg) {
          field.input.classList.add('invalid');
          if (field.error) field.error.textContent = errorMsg;
        } else {
          field.input.classList.remove('invalid');
          if (field.error) field.error.textContent = '';
        }
      });

      field.input.addEventListener('input', () => {
        if (field.input.classList.contains('invalid')) {
          const errorMsg = field.validate(field.input.value);
          if (!errorMsg) {
            field.input.classList.remove('invalid');
            if (field.error) field.error.textContent = '';
          }
        }
      });
    }
  });

  // Submit Handler
  enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    Object.keys(fields).forEach(key => {
      const field = fields[key];
      if (field.input) {
        const errorMsg = field.validate(field.input.value);
        if (errorMsg) {
          field.input.classList.add('invalid');
          if (field.error) field.error.textContent = errorMsg;
          isValid = false;
        } else {
          field.input.classList.remove('invalid');
          if (field.error) field.error.textContent = '';
        }
      }
    });

    if (isValid) {
      // Show success notification banner
      if (successAlert) {
        successAlert.classList.remove('hidden');
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Reset Form fields
      enquiryForm.reset();

      // Automatically hide banner after 8 seconds
      setTimeout(() => {
        if (successAlert) successAlert.classList.add('hidden');
      }, 8000);
    }
  });
}

/* ==========================================================================
   9. PRODUCT "ENQUIRE NOW" TRIGGER HELPER
   ========================================================================== */
function initProductEnquiryTriggers() {
  const enquiryTriggers = document.querySelectorAll('.enquiry-trigger');
  const categorySelect = document.getElementById('category');
  const messageInput = document.getElementById('message');
  const enquirySection = document.getElementById('enquiry');

  if (!enquiryTriggers.length) return;

  enquiryTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const productName = btn.getAttribute('data-product');
      const categoryName = btn.getAttribute('data-category');

      // Pre-fill Category dropdown
      if (categorySelect && categoryName) {
        for (let option of categorySelect.options) {
          if (option.value.toLowerCase() === categoryName.toLowerCase()) {
            option.selected = true;
            break;
          }
        }
      }

      // Pre-fill Message text
      if (messageInput && productName) {
        messageInput.value = `Hello Elegance Boutique, I am interested in inquiring about the "${productName}". Please let me know the availability, price range, and stitching options.`;
      }

      // Smooth scroll to enquiry section
      if (enquirySection) {
        enquirySection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   10. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   11. DYNAMIC YEAR IN FOOTER
   ========================================================================== */
function initDynamicYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
