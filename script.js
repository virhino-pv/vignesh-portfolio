/**
 * ==============================================================================
 * VIGNESH G — PERSONAL PORTFOLIO JAVASCRIPT
 * Identity: Vignesh G, Founder of VIRHINO | Freelancer | Digital Creator
 * Features:
 *   - Mobile Menu Toggle & Keyboard Accessibility
 *   - Sticky Header & Active ScrollSpy Navigation
 *   - Dynamic Portfolio Category Filtering
 *   - Service Card "Discuss a project" Form Auto-Prefill
 *   - Form Validation & Prefilled Mailto Handoff
 *   - One-Click Email Clipboard Copy with Feedback
 *   - Dynamic Current Year & Back-to-Top Handler
 *   - Accessible Scroll-Reveal Animations (respects prefers-reduced-motion)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------------------------------
  // 1. Mobile Navigation Drawer Toggle & Trap
  // ----------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

  const toggleMobileMenu = (forceState = null) => {
    const isCurrentlyExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    const shouldOpen = forceState !== null ? forceState : !isCurrentlyExpanded;

    mobileToggle.setAttribute('aria-expanded', shouldOpen);
    mobileDrawer.setAttribute('aria-hidden', !shouldOpen);
    mobileDrawer.classList.toggle('is-open', shouldOpen);

    // Prevent background page scrolling when menu is active
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => toggleMobileMenu());

    // Close menu when clicking any navigation link
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        toggleMobileMenu(false);
        mobileToggle.focus();
      }
    });

    // Close when clicking outside of the drawer if open
    document.addEventListener('click', (e) => {
      if (
        mobileDrawer.classList.contains('is-open') &&
        !mobileDrawer.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        toggleMobileMenu(false);
      }
    });
  }


  // ----------------------------------------------------------------------------
  // 2. Sticky Header Enhancement on Scroll
  // ----------------------------------------------------------------------------
  const header = document.getElementById('header');

  const handleHeaderScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();


  // ----------------------------------------------------------------------------
  // 3. ScrollSpy: Highlight Active Navigation Links
  // ----------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id], header[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const updateActiveNavLink = () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 160;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      desktopNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });


  // ----------------------------------------------------------------------------
  // 4. Portfolio Category Filtering
  // ----------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state on buttons
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const selectedFilter = btn.getAttribute('data-filter');

      // Filter grid cards
      portfolioCards.forEach(card => {
        const cardCategories = (card.getAttribute('data-category') || '').split(' ');

        if (selectedFilter === 'all' || cardCategories.includes(selectedFilter)) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });


  // ----------------------------------------------------------------------------
  // 5. "Discuss a project" Service Auto-Prefill & Scroll
  // ----------------------------------------------------------------------------
  const serviceCtas = document.querySelectorAll('.service-cta');
  const serviceSelect = document.getElementById('userService');

  serviceCtas.forEach(cta => {
    cta.addEventListener('click', (e) => {
      const targetService = cta.getAttribute('data-prefill');
      if (targetService && serviceSelect) {
        // Set matching option
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value === targetService) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }

        // Highlight the select briefly to orient user
        serviceSelect.classList.remove('is-invalid');
        serviceSelect.style.borderColor = 'var(--gold-primary)';
        setTimeout(() => {
          serviceSelect.style.borderColor = '';
        }, 2000);
      }
    });
  });


  // ----------------------------------------------------------------------------
  // 6. Interactive Contact Form Validation & Mailto Handoff
  // ----------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const userNameInput = document.getElementById('userName');
  const userEmailInput = document.getElementById('userEmail');
  const userMessageInput = document.getElementById('userMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const serviceError = document.getElementById('serviceError');
  const messageError = document.getElementById('messageError');
  const formSuccessToast = document.getElementById('formSuccessToast');

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validateField = (input, errorEl, condition) => {
    if (!condition) {
      input.classList.add('is-invalid');
      errorEl.classList.add('visible');
      return false;
    } else {
      input.classList.remove('is-invalid');
      errorEl.classList.remove('visible');
      return true;
    }
  };

  if (contactForm) {
    // Clear validation error on user typing
    userNameInput.addEventListener('input', () => validateField(userNameInput, nameError, userNameInput.value.trim().length >= 2));
    userEmailInput.addEventListener('input', () => validateField(userEmailInput, emailError, isValidEmail(userEmailInput.value)));
    serviceSelect.addEventListener('change', () => validateField(serviceSelect, serviceError, serviceSelect.value !== ''));
    userMessageInput.addEventListener('input', () => validateField(userMessageInput, messageError, userMessageInput.value.trim().length >= 10));

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(userNameInput, nameError, userNameInput.value.trim().length >= 2);
      const isEmailValid = validateField(userEmailInput, emailError, isValidEmail(userEmailInput.value));
      const isServiceValid = validateField(serviceSelect, serviceError, serviceSelect.value !== '');
      const isMessageValid = validateField(userMessageInput, messageError, userMessageInput.value.trim().length >= 10);

      if (!isNameValid || !isEmailValid || !isServiceValid || !isMessageValid) {
        // Scroll first invalid field into view
        const firstInvalid = contactForm.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Update email subject dynamically based on chosen service & name
      const web3Subject = document.getElementById('web3Subject');
      if (web3Subject) {
        web3Subject.value = `[Inquiry - ${serviceSelect.value}] from ${userNameInput.value.trim()}`;
      }

      const submitBtn = document.getElementById('submitFormBtn');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '<span>Send Message</span>';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending Message...</span><svg class="btn-icon spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path></svg>`;
      }

      const formData = new FormData(contactForm);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(async (response) => {
        const result = await response.json();
        if (response.status === 200 && result.success) {
          if (formSuccessToast) {
            formSuccessToast.style.display = 'block';
            formSuccessToast.textContent = "✓ Thank you! Your message has been sent successfully to Vignesh G. I'll get back to you shortly!";
            formSuccessToast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          contactForm.reset();
        } else {
          // If Web3Forms returns an error message
          throw new Error(result.message || 'Submission failed');
        }
      })
      .catch((error) => {
        console.error('Web3Forms submission error:', error);
        // Fallback: Launch mailto prefill if API network request fails
        const recipient = 'virhino.vp@gmail.com';
        const subject = `[Project Inquiry - ${serviceSelect.value}] from ${userNameInput.value.trim()}`;
        const bodyLines = [
          `Hi Vignesh,`,
          ``,
          `My name is ${userNameInput.value.trim()}.`,
          `I am reaching out regarding: ${serviceSelect.value}`,
          `My email: ${userEmailInput.value.trim()}`,
          ``,
          `Project Details:`,
          `${userMessageInput.value.trim()}`
        ];
        window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

        if (formSuccessToast) {
          formSuccessToast.style.display = 'block';
          formSuccessToast.textContent = "✓ Opening your email client to send your message directly to virhino.vp@gmail.com...";
          formSuccessToast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      });
    });
  }


  // ----------------------------------------------------------------------------
  // 7. Quick Copy Email to Clipboard
  // ----------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyBadge = document.getElementById('copyBadge');
  const emailToCopy = 'virhino.vp@gmail.com';

  if (copyEmailBtn && copyBadge) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback for older browsers
          const tempInput = document.createElement('input');
          tempInput.value = emailToCopy;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        const originalText = copyBadge.textContent;
        copyBadge.textContent = 'Copied! ✓';
        copyBadge.style.background = 'var(--gold-primary)';
        copyBadge.style.color = '#0b0d11';

        setTimeout(() => {
          copyBadge.textContent = originalText;
          copyBadge.style.background = '';
          copyBadge.style.color = '';
        }, 2200);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    });
  }


  // ----------------------------------------------------------------------------
  // 8. Dynamic Copyright Year & Back to Top Handler
  // ----------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // ----------------------------------------------------------------------------
  // 9. Accessible Scroll-Reveal Animations
  // ----------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll(
      '.service-card, .portfolio-card, .pillar-card, .skill-category-card, .education-card, .process-card, .contact-item-card'
    );

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      revealObserver.observe(el);
    });
  }

});
