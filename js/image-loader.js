/**
 * Professional Image Loader with Loading States & Error Handling
 * Ensures all photos display perfectly with proper aspect ratios
 */

'use strict';

/**
 * Enhanced image loading with loading states
 */
function initImageLoader() {
  const allImages = document.querySelectorAll('.slide-photo, img[src*="photo"]');
  
  allImages.forEach(img => {
    const frame = img.closest('.slide-photo-frame');
    if (!frame) return;
    
    // Add loading state
    if (!img.complete) {
      frame.classList.add('loading');
    }
    
    // Handle successful load
    img.addEventListener('load', function() {
      handleImageLoad(img, frame);
    });
    
    // Handle error
    img.addEventListener('error', function() {
      handleImageError(img, frame);
    });
    
    // If already loaded (cached)
    if (img.complete && img.naturalHeight !== 0) {
      handleImageLoad(img, frame);
    }
  });
}

/**
 * Handle successful image load
 */
function handleImageLoad(img, frame) {
  // Remove loading state
  frame.classList.remove('loading');
  
  // Add loaded class for fade-in effect
  img.classList.add('loaded');
  
  // Set background image for blur effect
  const imgSrc = img.currentSrc || img.src;
  if (imgSrc && frame) {
    frame.style.setProperty('--photo-bg', `url('${imgSrc}')`);
  }
  
  // Log success for debugging
  console.log('✅ Image loaded:', img.alt || img.src);
}

/**
 * Handle image loading error gracefully
 */
function handleImageError(img, frame) {
  // Remove loading state
  frame.classList.remove('loading');
  
  // Add error state
  frame.classList.add('error');
  
  // Mark image as placeholder
  img.classList.add('photo-placeholder');
  
  // Show error overlay (if not already showing)
  const overlay = frame.querySelector('.photo-placeholder-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
  }
  
  // Update alt text
  img.alt = 'Photo temporarily unavailable';
  
  // Log error for debugging
  console.warn('⚠️ Image failed to load:', img.src);
  
  // Optional: Try to reload after delay (one retry only)
  if (!img.dataset.retried) {
    img.dataset.retried = 'true';
    setTimeout(() => {
      console.log('🔄 Retrying image load:', img.src);
      const originalSrc = img.src;
      img.src = '';
      img.src = originalSrc;
    }, 2000);
  }
}

/**
 * Preload critical images (first 3 chapters)
 */
function preloadCriticalImages() {
  const criticalImages = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'];
  
  criticalImages.forEach((filename, index) => {
    const img = new Image();
    img.src = `img/${filename}`;
    
    img.onload = () => {
      console.log(`✅ Preloaded: ${filename}`);
    };
    
    img.onerror = () => {
      console.warn(`⚠️ Failed to preload: ${filename}`);
    };
  });
}

/**
 * Lazy load images for better performance
 */
function initLazyLoading() {
  // Only lazy load if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    console.log('IntersectionObserver not supported, loading all images immediately');
    return;
  }
  
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // If image has data-src, use it
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        
        // Stop observing this image
        observer.unobserve(img);
      }
    });
  }, {
    // Load images 300px before they enter viewport
    rootMargin: '300px'
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
}

/**
 * Ensure images maintain aspect ratio on resize
 */
function handleResize() {
  const frames = document.querySelectorAll('.slide-photo-frame');
  
  frames.forEach(frame => {
    const img = frame.querySelector('img');
    if (!img || !img.complete) return;
    
    // Recalculate if needed
    const frameAspect = frame.offsetWidth / frame.offsetHeight;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    
    // Images are using object-fit: contain, so they'll adapt automatically
    // Just ensure the background blur is still set
    if (img.classList.contains('loaded')) {
      const imgSrc = img.currentSrc || img.src;
      if (imgSrc) {
        frame.style.setProperty('--photo-bg', `url('${imgSrc}')`);
      }
    }
  });
}

/**
 * Add optimized resize handler
 */
let resizeTimeout;
function optimizedResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(handleResize, 150);
}

/**
 * Initialize all image enhancements
 */
function initImageEnhancements() {
  // Preload critical images first
  preloadCriticalImages();
  
  // Set up image loaders
  initImageLoader();
  
  // Set up lazy loading for non-critical images
  initLazyLoading();
  
  // Handle window resize
  window.addEventListener('resize', optimizedResize);
  
  console.log('🎨 Image enhancement system initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initImageEnhancements);
} else {
  initImageEnhancements();
}

// Export for use in other scripts if needed
window.imageLoader = {
  init: initImageEnhancements,
  preload: preloadCriticalImages,
  handleLoad: handleImageLoad,
  handleError: handleImageError
};
