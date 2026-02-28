// ========================================
// ATHLETEBEYOND.IO — Main JavaScript
// Interactivity, Forms, Animations, CMS-Ready
// ========================================

// ===== DOCUMENT READY =====
document.addEventListener('DOMContentLoaded', function() {
  initSmoothScrolling();
  initMobileMenu();
  initFormHandling();
  initFiltering();
  initCarousel();
  initLazyLoading();
  initAnimations();
  initBEYONDSeries();
  initProductInteractivity();
  initScrollReveal();
});

// ===== 1. SMOOTH SCROLLING =====
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===== 2. MOBILE MENU =====
function initMobileMenu() {
  const navList = document.querySelector('.nav-list');
  const nav = document.querySelector('.nav');
  
  // Create hamburger button if not exists
  if (!document.querySelector('.hamburger')) {
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '☰';
    hamburger.setAttribute('aria-label', 'Toggle menu');
    
    nav.insertBefore(hamburger, navList);
    
    // Add styles for hamburger
    const style = document.createElement('style');
    style.textContent = `
      .hamburger {
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #181818;
        padding: 0.5rem;
      }
      
      @media (max-width: 768px) {
        .hamburger {
          display: block;
        }
        
        .nav-list {
          position: absolute;
          top: 60px;
          left: 0;
          right: 0;
          background: #fafafd;
          flex-direction: column;
          border-top: 1px solid #e5e5e5;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          gap: 0;
          padding: 0;
        }
        
        .nav-list.active {
          max-height: 500px;
          padding: 1rem 0;
        }
        
        .nav-list li {
          padding: 0.75rem 1.5rem;
          border-bottom: 1px solid #e5e5e5;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      navList.classList.toggle('active');
      this.textContent = navList.classList.contains('active') ? '✕' : '☰';
    });
    
    // Close menu when link clicked
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('active');
        hamburger.textContent = '☰';
      });
    });
  }
}

// ===== 3. FORM HANDLING =====
function initFormHandling() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Collect form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Basic validation
      if (!validateForm(data)) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }
      
      // Log form data (ready for CMS integration)
      console.log('Form Submission:', {
        type: 'form_submission',
        data: data,
        timestamp: new Date().toISOString(),
        // CMS Hook: Replace console.log with actual API call
        // Example: sendToCMS(data)
      });
      
      // Show success message
      showNotification('Thank you! We\'ll get back to you soon.', 'success');
      
      // Reset form
      this.reset();
      
      // CMS Integration Point:
      // Uncomment below to integrate with your CMS
      // sendFormDataToCMS(data);
    });
  });
}

function validateForm(data) {
  for (let key in data) {
    if (!data[key] || data[key].trim() === '') {
      return false;
    }
  }
  return true;
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#0e4639' : '#e74c3c'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== 4. FILTERING (BEYOND & SPORTS) =====
function initFiltering() {
  // Filter buttons for BEYOND series
  const filterButtons = document.querySelectorAll('[onclick^="filterSeries"]');
  
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get filter value from onclick attribute
        const match = this.getAttribute('onclick').match(/'([^']*)'/);
        const filterValue = match ? match[1] : 'all';
        
        filterSeriesContent(filterValue);
        
        // Update active button
        document.querySelectorAll('[onclick^="filterSeries"]').forEach(btn => {
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-secondary');
        });
        this.classList.remove('btn-secondary');
        this.classList.add('btn-primary');
      });
    });
  }
  
  // Filter buttons for Sports (Athlete cards)
  const sportsFilterButtons = document.querySelectorAll('.section[style*="background-color: #f0ede8"] .btn-primary, .section[style*="background-color: #f0ede8"] .btn-secondary');
  
  sportsFilterButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const filterText = this.textContent.toLowerCase().trim();
      filterAthletes(filterText);
      
      // Update active button
      document.querySelectorAll('.section[style*="background-color: #f0ede8"] .btn').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
      });
      this.classList.remove('btn-secondary');
      this.classList.add('btn-primary');
    });
  });
}

function filterSeriesContent(series) {
  const sections = document.querySelectorAll('[id^="series-"]');
  
  sections.forEach(section => {
    if (series === 'all') {
      section.style.display = 'block';
    } else {
      section.style.display = section.id.includes(series) ? 'block' : 'none';
    }
  });
}

function filterAthletes(filter) {
  const athleteCards = document.querySelectorAll('.athlete-card');
  
  athleteCards.forEach(card => {
    const text = card.textContent.toLowerCase();
    const sportElement = card.querySelector('.athlete-sport');
    
    if (filter === 'all athletes' || !sportElement) {
      card.style.display = 'block';
    } else if (sportElement && text.includes(filter)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// ===== 5. CAROUSEL / HORIZONTAL SCROLL =====
function initCarousel() {
  const scrollContainers = document.querySelectorAll('.scroll-container');
  
  scrollContainers.forEach(container => {
    // Touch/swipe support for mobile
    let startX = 0;
    let scrollLeft = 0;
    
    container.addEventListener('mousedown', (e) => {
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.style.cursor = 'grabbing';
    });
    
    container.addEventListener('mouseleave', () => {
      container.style.cursor = 'grab';
    });
    
    container.addEventListener('mouseup', () => {
      container.style.cursor = 'grab';
    });
    
    container.addEventListener('mousemove', (e) => {
      if (startX === 0) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    });
    
    // Touch events for mobile
    container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });
    
    container.addEventListener('touchmove', (e) => {
      if (startX === 0) return;
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    });
  });
}

// ===== 6. LAZY LOADING IMAGES =====
function initLazyLoading() {
  const images = document.querySelectorAll('img[src^="https://via.placeholder"]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        // Add fade-in animation
        img.style.animation = 'fadeIn 0.5s ease';
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
  
  // Add fade-in animation to stylesheet if not exists
  if (!document.querySelector('style[data-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-animations', 'true');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
      
      @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ===== 7. SCROLL ANIMATIONS =====
function initScrollReveal() {
  const cards = document.querySelectorAll('.card, .athlete-card, .product-card, .partner-card');
  
  const cardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'slideUp 0.6s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  cards.forEach(card => cardObserver.observe(card));
}

// ===== 8. BEYOND SERIES FUNCTIONALITY =====
function initBEYONDSeries() {
  // Track active series
  const seriesFilter = document.querySelector('.series-filter');
  
  if (seriesFilter) {
    const buttons = seriesFilter.querySelectorAll('button');
    buttons[0].classList.add('btn-primary'); // Set first as active
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update button styles
        buttons.forEach(btn => {
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-secondary');
        });
        this.classList.remove('btn-secondary');
        this.classList.add('btn-primary');
      });
    });
  }
}

// ===== 9. PRODUCT INTERACTIVITY =====
function initProductInteractivity() {
  // Size selector
  const sizeButtons = document.querySelectorAll('.size-selector button');
  
  sizeButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Update active size
      this.parentElement.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('active');
      });
      this.classList.add('active');
    });
  });
  
  // Add to cart buttons (CMS Hook)
  const cartButtons = document.querySelectorAll('[style*="width: 100%"].btn-primary');
  
  cartButtons.forEach(button => {
    if (button.textContent.includes('Cart')) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const productCard = this.closest('.product-card') || this.closest('.card');
        const productName = productCard?.querySelector('.product-name, .card-title')?.textContent || 'Product';
        const price = productCard?.querySelector('.product-price')?.textContent || 'N/A';
        const size = productCard?.querySelector('.size-selector .active')?.textContent || 'N/A';
        
        console.log('Cart Item Added:', {
          product: productName,
          price: price,
          size: size,
          timestamp: new Date().toISOString(),
          // CMS Hook: sendToCart(productData)
        });
        
        showNotification(`${productName} added to cart!`, 'success');
        
        // Change button text temporarily
        const originalText = this.textContent;
        this.textContent = '✓ Added';
        setTimeout(() => {
          this.textContent = originalText;
        }, 2000);
      });
    }
  });
}

// ===== 10. UTILITY FUNCTIONS =====

// CMS Integration Hook - Ready for your backend
function sendFormDataToCMS(data) {
  const payload = {
    type: 'form_submission',
    data: data,
    timestamp: new Date().toISOString()
  };
  
  // Example API endpoint (replace with your CMS endpoint)
  // fetch('https://your-cms-api.com/submissions', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload)
  // })
  // .then(res => res.json())
  // .then(data => console.log('CMS Response:', data))
  // .catch(err => console.error('CMS Error:', err));
}

// Track page views (Analytics Hook)
function trackPageView() {
  const pageData = {
    page: document.title,
    url: window.location.pathname,
    timestamp: new Date().toISOString()
  };
  
  console.log('Page View Tracked:', pageData);
  
  // Ready for: Google Analytics, Mixpanel, Segment, etc.
  // Example: gtag('event', 'page_view', pageData);
}

// Initialize page tracking
trackPageView();

// ===== 11. PERFORMANCE OPTIMIZATION =====

// Debounce function for resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
  console.log('Window resized');
  // Re-initialize responsive elements if needed
}, 250));

// ===== 12. ACCESSIBILITY IMPROVEMENTS =====

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
  // Escape key closes mobile menu
  if (e.key === 'Escape') {
    const navList = document.querySelector('.nav-list');
    const hamburger = document.querySelector('.hamburger');
    if (navList && navList.classList.contains('active')) {
      navList.classList.remove('active');
      if (hamburger) hamburger.textContent = '☰';
    }
  }
});

// ===== 13. READY FOR CMS INTEGRATION =====

// CMS Data Structure (Example)
const CMSHooks = {
  // Fetch athletes from CMS
  fetchAthletes: async function() {
    // const athletes = await fetch('/api/athletes').then(r => r.json());
    console.log('CMS Hook: fetchAthletes() - Ready for integration');
  },
  
  // Fetch stories for BEYOND
  fetchBEYONDStories: async function() {
    // const stories = await fetch('/api/beyond-stories').then(r => r.json());
    console.log('CMS Hook: fetchBEYONDStories() - Ready for integration');
  },
  
  // Fetch products
  fetchProducts: async function() {
    // const products = await fetch('/api/products').then(r => r.json());
    console.log('CMS Hook: fetchProducts() - Ready for integration');
  },
  
  // Submit form data
  submitForm: async function(data) {
    // await fetch('/api/submissions', { method: 'POST', body: JSON.stringify(data) });
    console.log('CMS Hook: submitForm() - Ready for integration');
  }
};

// Export for use in other modules
window.AthleteBeyond = {
  CMSHooks: CMSHooks,
  trackPageView: trackPageView,
  showNotification: showNotification
};

console.log('AthleteBeyond.io - JavaScript initialized ✓');