/**
 * Animation Controller for Project Eclipse
 * Handles Lottie animations and CSS-based fallbacks
 */

class AnimationController {
  constructor() {
    this.instances = {};
    this.loaded = {};
    this.useLottie = typeof lottie !== 'undefined';
  }

  /**
   * Preload a Lottie animation
   */
  async preload(name, containerId, path) {
    if (!this.useLottie) {
      console.warn('Lottie not available, using CSS fallbacks');
      return null;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container ${containerId} not found`);
      return null;
    }

    try {
      const response = await fetch(`assets/animations/${path}.json`);
      if (!response.ok) {
        console.warn(`Animation ${path} not found, using CSS fallback`);
        this.loaded[name] = false;
        return null;
      }

      const animationData = await response.json();
      
      this.instances[name] = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: animationData
      });

      this.loaded[name] = true;
      return this.instances[name];
    } catch (error) {
      console.warn(`Failed to load animation ${path}:`, error);
      this.loaded[name] = false;
      return null;
    }
  }

  /**
   * Load animation without preloading (for dynamic loading)
   */
  load(name, container, path, options = {}) {
    if (!this.useLottie) return null;

    const containerEl = typeof container === 'string' 
      ? document.getElementById(container) 
      : container;

    if (!containerEl) return null;

    this.instances[name] = lottie.loadAnimation({
      container: containerEl,
      renderer: 'svg',
      loop: options.loop || false,
      autoplay: options.autoplay || false,
      path: `assets/animations/${path}.json`
    });

    return this.instances[name];
  }

  /**
   * Play an animation
   */
  play(name, loop = false) {
    const anim = this.instances[name];
    if (anim) {
      anim.loop = loop;
      anim.goToAndPlay(0, true);
      return true;
    }
    return false;
  }

  /**
   * Stop an animation
   */
  stop(name) {
    const anim = this.instances[name];
    if (anim) {
      anim.stop();
      return true;
    }
    return false;
  }

  /**
   * Pause an animation
   */
  pause(name) {
    const anim = this.instances[name];
    if (anim) {
      anim.pause();
      return true;
    }
    return false;
  }

  /**
   * Set animation direction
   */
  setDirection(name, direction) {
    const anim = this.instances[name];
    if (anim) {
      anim.setDirection(direction);
    }
  }

  /**
   * Set animation speed
   */
  setSpeed(name, speed) {
    const anim = this.instances[name];
    if (anim) {
      anim.setSpeed(speed);
    }
  }

  /**
   * Listen for animation complete
   */
  onComplete(name, callback) {
    const anim = this.instances[name];
    if (anim) {
      anim.addEventListener('complete', callback);
    }
  }

  /**
   * Remove complete listener
   */
  offComplete(name, callback) {
    const anim = this.instances[name];
    if (anim) {
      anim.removeEventListener('complete', callback);
    }
  }

  /**
   * Destroy an animation instance
   */
  destroy(name) {
    const anim = this.instances[name];
    if (anim) {
      anim.destroy();
      delete this.instances[name];
      delete this.loaded[name];
    }
  }

  /**
   * Destroy all animation instances
   */
  destroyAll() {
    Object.keys(this.instances).forEach(name => this.destroy(name));
  }

  /**
   * Check if an animation is loaded
   */
  isLoaded(name) {
    return this.loaded[name] === true;
  }
}

// CSS-based animation effects (fallbacks when Lottie not available)
const CSSEffects = {
  /**
   * Create floating butterflies with CSS
   */
  createButterflies(container, count = 8) {
    const containerEl = typeof container === 'string' 
      ? document.getElementById(container) 
      : container;
    
    if (!containerEl) return;

    // Clear existing
    containerEl.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const butterfly = document.createElement('div');
      butterfly.className = 'butterfly';
      butterfly.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 2}s;
        transform: scale(${0.5 + Math.random() * 0.5});
      `;
      
      // Add floating animation
      butterfly.style.animation = `
        flutter-left 0.3s ease-in-out infinite alternate,
        float-butterfly ${3 + Math.random() * 4}s ease-in-out infinite
      `;
      
      containerEl.appendChild(butterfly);
    }

    // Add keyframes for floating if not exists
    if (!document.getElementById('butterfly-keyframes')) {
      const style = document.createElement('style');
      style.id = 'butterfly-keyframes';
      style.textContent = `
        @keyframes float-butterfly {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -15px) rotate(5deg); }
          50% { transform: translate(-5px, -25px) rotate(-3deg); }
          75% { transform: translate(-15px, -10px) rotate(3deg); }
        }
      `;
      document.head.appendChild(style);
    }
  },

  /**
   * Create floating hearts
   */
  createHearts(container, count = 15) {
    const containerEl = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!containerEl) return;

    const hearts = ['❤️', '💕', '💗', '💖', '💝'];
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = `${10 + Math.random() * 80}%`;
        heart.style.fontSize = `${16 + Math.random() * 24}px`;
        heart.style.animationDuration = `${3 + Math.random() * 2}s`;
        containerEl.appendChild(heart);

        // Remove after animation
        setTimeout(() => heart.remove(), 5000);
      }, i * 300);
    }
  },

  /**
   * Trigger white flash transition
   */
  triggerFlash(element) {
    const el = typeof element === 'string' 
      ? document.getElementById(element) 
      : element;
    
    if (el) {
      el.classList.add('flash-active');
      setTimeout(() => el.classList.remove('flash-active'), 2000);
    }
  }
};

// Export for use
window.AnimationController = AnimationController;
window.CSSEffects = CSSEffects;
