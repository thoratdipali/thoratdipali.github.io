/**
 * Enhanced Lightbox with Zoom, Swipe Navigation & Thumbnails
 * Professional photo viewing experience
 */

'use strict';

const EnhancedLightbox = {
  overlay: null,
  img: null,
  caption: null,
  closeBtn: null,
  currentIndex: 0,
  photos: [],
  scale: 1,
  translateX: 0,
  translateY: 0,
  isDragging: false,
  startX: 0,
  startY: 0,
  lastTouchDistance: 0,
  
  init() {
    this.overlay = document.getElementById('lightboxOverlay');
    this.img = document.getElementById('lightboxImg');
    this.caption = document.getElementById('lightboxCaption');
    this.closeBtn = document.getElementById('lightboxClose');
    
    if (!this.overlay) return;
    
    // Get all photos from the story
    this.photos = Array.from(document.querySelectorAll('.slide-photo')).map((photo, index) => ({
      src: photo.src,
      alt: photo.alt,
      caption: this.getPhotoCaption(photo),
      index: index
    }));
    
    // Add navigation controls
    this.addNavigationControls();
    
    // Add zoom controls
    this.addZoomControls();
    
    // Add thumbnail strip
    this.addThumbnailStrip();
    
    // Set up event listeners
    this.setupEventListeners();
    
    console.log('🔍 Enhanced lightbox initialized with', this.photos.length, 'photos');
  },
  
  getPhotoCaption(photoElement) {
    const slide = photoElement.closest('.story-slide');
    if (!slide) return '';
    const titleEl = slide.querySelector('.chapter-title');
    return titleEl ? titleEl.textContent : '';
  },
  
  addNavigationControls() {
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.id = 'lightboxPrev';
    prevBtn.className = 'lightbox-nav lightbox-prev';
    prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    prevBtn.setAttribute('aria-label', 'Previous photo');
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.id = 'lightboxNext';
    nextBtn.className = 'lightbox-nav lightbox-next';
    nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    nextBtn.setAttribute('aria-label', 'Next photo');
    
    this.overlay.appendChild(prevBtn);
    this.overlay.appendChild(nextBtn);
  },
  
  addZoomControls() {
    const zoomControls = document.createElement('div');
    zoomControls.className = 'lightbox-zoom-controls';
    zoomControls.innerHTML = `
      <button class="lightbox-zoom-btn" id="zoomIn" aria-label="Zoom in">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <button class="lightbox-zoom-btn" id="zoomOut" aria-label="Zoom out">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="M21 21l-4.35-4.35M8 11h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <button class="lightbox-zoom-btn" id="zoomReset" aria-label="Reset zoom">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="M21 21l-4.35-4.35M11 11h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <span class="lightbox-zoom-level" id="zoomLevel">100%</span>
    `;
    
    this.overlay.appendChild(zoomControls);
  },
  
  addThumbnailStrip() {
    const strip = document.createElement('div');
    strip.className = 'lightbox-thumbnails';
    strip.id = 'lightboxThumbnails';
    
    this.photos.forEach((photo, index) => {
      const thumb = document.createElement('button');
      thumb.className = 'lightbox-thumb';
      thumb.style.backgroundImage = `url('${photo.src}')`;
      thumb.setAttribute('aria-label', `View photo ${index + 1}`);
      thumb.dataset.index = index;
      strip.appendChild(thumb);
    });
    
    this.overlay.appendChild(strip);
  },
  
  setupEventListeners() {
    // Click on photo frames to open lightbox
    document.addEventListener('click', (e) => {
      const frame = e.target.closest('.slide-photo-frame');
      if (!frame) return;
      
      const photo = frame.querySelector('.slide-photo');
      if (!photo || photo.classList.contains('photo-placeholder')) return;
      
      const index = this.photos.findIndex(p => p.src === photo.src);
      if (index !== -1) {
        this.open(index);
      }
    });
    
    // Close button
    if (this.closeBtn) {
      this.closeBtn.onclick = () => this.close();
    }
    
    // Click overlay background to close
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    
    // Navigation buttons
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    if (prevBtn) prevBtn.onclick = () => this.navigate(-1);
    if (nextBtn) nextBtn.onclick = () => this.navigate(1);
    
    // Zoom controls
    document.getElementById('zoomIn')?.addEventListener('click', () => this.zoom(0.3));
    document.getElementById('zoomOut')?.addEventListener('click', () => this.zoom(-0.3));
    document.getElementById('zoomReset')?.addEventListener('click', () => this.resetZoom());
    
    // Thumbnail clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('lightbox-thumb')) {
        const index = parseInt(e.target.dataset.index);
        this.showPhoto(index);
      }
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (!this.overlay.classList.contains('open')) return;
      
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.navigate(-1);
      if (e.key === 'ArrowRight') this.navigate(1);
      if (e.key === '+' || e.key === '=') this.zoom(0.3);
      if (e.key === '-' || e.key === '_') this.zoom(-0.3);
      if (e.key === '0') this.resetZoom();
    });
    
    // Mouse wheel zoom
    this.img.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      this.zoom(delta);
    }, { passive: false });
    
    // Touch gestures
    this.setupTouchGestures();
    
    // Mouse drag to pan (when zoomed)
    this.setupMouseDrag();
  },
  
  setupTouchGestures() {
    let startX = 0;
    let startSwipeX = 0;
    
    this.img.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startSwipeX = e.touches[0].clientX;
        this.startX = this.translateX;
        this.startY = this.translateY;
      } else if (e.touches.length === 2) {
        // Pinch to zoom
        this.lastTouchDistance = this.getTouchDistance(e.touches);
      }
    }, { passive: true });
    
    this.img.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && this.scale > 1) {
        // Pan when zoomed
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startX;
        this.translateX = this.startX + deltaX;
        this.translateY = this.startY + deltaY;
        this.updateTransform();
      } else if (e.touches.length === 2) {
        // Pinch zoom
        e.preventDefault();
        const distance = this.getTouchDistance(e.touches);
        const delta = (distance - this.lastTouchDistance) * 0.01;
        this.zoom(delta);
        this.lastTouchDistance = distance;
      }
    }, { passive: false });
    
    this.img.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const endX = e.changedTouches[0].clientX;
        const swipeDistance = endX - startSwipeX;
        
        // If zoomed, don't navigate on swipe
        if (this.scale > 1) return;
        
        // Swipe threshold: 80px
        if (Math.abs(swipeDistance) > 80) {
          if (swipeDistance > 0) {
            this.navigate(-1); // Swipe right = previous
          } else {
            this.navigate(1); // Swipe left = next
          }
        }
      }
    }, { passive: true });
  },
  
  setupMouseDrag() {
    this.img.addEventListener('mousedown', (e) => {
      if (this.scale <= 1) return;
      
      this.isDragging = true;
      this.startX = e.clientX - this.translateX;
      this.startY = e.clientY - this.translateY;
      this.img.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      
      this.translateX = e.clientX - this.startX;
      this.translateY = e.clientY - this.startY;
      this.updateTransform();
    });
    
    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.img.style.cursor = this.scale > 1 ? 'grab' : 'zoom-out';
      }
    });
  },
  
  getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  },
  
  open(index = 0) {
    this.currentIndex = index;
    this.showPhoto(index);
    this.overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Update URL hash for deep linking
    window.location.hash = `photo-${index + 1}`;
    
    console.log('📷 Opened lightbox at photo', index + 1);
  },
  
  close() {
    this.overlay.classList.remove('open');
    document.body.style.overflow = '';
    this.resetZoom();
    
    // Clear hash
    history.replaceState(null, null, ' ');
    
    console.log('✖️ Closed lightbox');
  },
  
  showPhoto(index) {
    if (index < 0 || index >= this.photos.length) return;
    
    this.currentIndex = index;
    const photo = this.photos[index];
    
    // Update image
    this.img.src = photo.src;
    this.img.alt = photo.alt;
    
    // Update caption
    if (this.caption) {
      this.caption.textContent = `${index + 1} / ${this.photos.length} — ${photo.caption}`;
    }
    
    // Update thumbnails
    document.querySelectorAll('.lightbox-thumb').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
    
    // Update navigation button states
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === this.photos.length - 1;
    
    // Reset zoom
    this.resetZoom();
  },
  
  navigate(direction) {
    const newIndex = this.currentIndex + direction;
    if (newIndex >= 0 && newIndex < this.photos.length) {
      this.showPhoto(newIndex);
    }
  },
  
  zoom(delta) {
    const oldScale = this.scale;
    this.scale = Math.max(1, Math.min(4, this.scale + delta));
    
    // Adjust translation to zoom towards center
    const scaleDiff = this.scale - oldScale;
    this.translateX -= (this.img.offsetWidth * scaleDiff) / 2;
    this.translateY -= (this.img.offsetHeight * scaleDiff) / 2;
    
    this.updateTransform();
    this.updateZoomUI();
  },
  
  resetZoom() {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.updateTransform();
    this.updateZoomUI();
  },
  
  updateTransform() {
    this.img.style.transform = `scale(${this.scale}) translate(${this.translateX / this.scale}px, ${this.translateY / this.scale}px)`;
    this.img.style.cursor = this.scale > 1 ? 'grab' : 'zoom-out';
  },
  
  updateZoomUI() {
    const zoomLevel = document.getElementById('zoomLevel');
    if (zoomLevel) {
      zoomLevel.textContent = Math.round(this.scale * 100) + '%';
    }
    
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    if (zoomIn) zoomIn.disabled = this.scale >= 4;
    if (zoomOut) zoomOut.disabled = this.scale <= 1;
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => EnhancedLightbox.init());
} else {
  EnhancedLightbox.init();
}

// Export for external use
window.EnhancedLightbox = EnhancedLightbox;
