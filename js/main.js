/**
 * Main Experience Controller for Project Eclipse
 * Orchestrates the entire interactive experience
 */

class ExperienceController {
  constructor() {
    // Controllers
    this.animations = new AnimationController();
    this.audio = new AudioController();
    
    // State
    this.currentState = null;
    this.previousState = null;
    this.isTransitioning = false;
    this.transitionTimeout = null;
    
    // DOM Elements
    this.elements = {
      app: document.getElementById('app'),
      startScreen: document.getElementById('start-screen'),
      speechBubble: document.getElementById('speech-bubble'),
      speechText: document.getElementById('speech-text'),
      yesButton: document.getElementById('yes-button'),
      continueButton: document.getElementById('continue-button'),
      curtain: document.getElementById('curtain'),
      loveLetter: document.getElementById('love-letter'),
      letterText: document.getElementById('letter-text'),
      letterSignature: document.getElementById('letter-signature'),
      letterPhotos: document.getElementById('letter-photos'),
      videoGallery: document.getElementById('video-gallery'),
      memoriesSection: document.getElementById('memories-section'),
      photoBurst: document.getElementById('photo-burst'),
      scenes: {}
    };

    // Cache scene elements
    this.cacheScenes();
    
    // Bind methods
    this.handleStart = this.handleStart.bind(this);
    this.handleYesClick = this.handleYesClick.bind(this);
    this.handleContinueClick = this.handleContinueClick.bind(this);
  }

  /**
   * Cache all scene elements
   */
  cacheScenes() {
    const sceneIds = [
      'scene-void',
      'scene-character', 
      'scene-door',
      'scene-transition',
      'scene-paradise',
      'scene-celebration'
    ];

    sceneIds.forEach(id => {
      this.elements.scenes[id] = document.getElementById(id);
    });
  }

  /**
   * Initialize the experience
   */
  init() {
    // Set up event listeners
    this.elements.startScreen.addEventListener('click', this.handleStart);
    this.elements.startScreen.addEventListener('touchstart', this.handleStart, { passive: true });
    
    this.elements.yesButton.addEventListener('click', this.handleYesClick);
    this.elements.continueButton.addEventListener('click', this.handleContinueClick);

    // Apply custom accent color if set
    this.applyCustomColors();

    // Preload assets
    this.preloadAssets();

    console.log('🌟 Project Eclipse initialized');
  }

  /**
   * Apply custom accent color if set in PERSONAL config
   */
  applyCustomColors() {
    if (window.PERSONAL && window.PERSONAL.favoriteColor) {
      const color = window.PERSONAL.favoriteColor;
      document.documentElement.style.setProperty('--accent-color', color);
      
      // Update button gradient
      if (this.elements.yesButton) {
        this.elements.yesButton.style.background = `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`;
      }
    }
  }

  /**
   * Preload animations and prepare audio
   */
  async preloadAssets() {
    // Attempt to preload Lottie animations
    // These will fail gracefully if files don't exist
    try {
      await Promise.all([
        this.animations.preload('void-glow', 'scene-void', 'void-glow'),
        this.animations.preload('character-emerge', 'character-animation', 'character-emerge'),
        this.animations.preload('door-sequence', 'door-animation', 'door-sequence'),
        this.animations.preload('butterflies', 'butterflies-animation', 'butterflies'),
        this.animations.preload('celebration', 'celebration-butterflies', 'butterflies')
      ]);
    } catch (error) {
      console.warn('Some animations not available, using CSS fallbacks');
    }
  }

  /**
   * Handle start screen click
   */
  handleStart(e) {
    e.preventDefault();
    
    // Remove listeners
    this.elements.startScreen.removeEventListener('click', this.handleStart);
    this.elements.startScreen.removeEventListener('touchstart', this.handleStart);

    // Initialize audio (requires user interaction)
    this.audio.init();

    // Start playing ordinary.mp3 - this will play throughout the entire experience
    this.audio.playOrdinary(0.4);

    // Fade out start screen
    this.elements.startScreen.classList.add('fade-out');
    
    // Show app and start experience
    setTimeout(() => {
      this.elements.startScreen.style.display = 'none';
      this.elements.app.classList.remove('hidden');
      this.start();
    }, 1000);
  }

  /**
   * Start the experience
   */
  start() {
    console.log('🎬 Experience starting...');
    // Reset used memories so each playthrough gets fresh memories
    window.usedMemories = [];
    this.transitionTo(STATES.INTRO_VOID);
  }

  /**
   * Transition to a new state
   */
  transitionTo(newState) {
    if (this.isTransitioning && newState !== STATES.END) {
      console.warn('Already transitioning, queuing:', newState);
      return;
    }

    const config = STATE_CONFIG[newState];
    if (!config) {
      console.error('Invalid state:', newState);
      return;
    }

    console.log(`📍 Transitioning to: ${newState}`);
    
    this.isTransitioning = true;
    this.previousState = this.currentState;
    this.currentState = newState;

    // Clear any pending transitions
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
      this.transitionTimeout = null;
    }

    // Execute state transition
    this.executeState(config, newState);
  }

  /**
   * Execute a state's configuration
   */
  executeState(config, stateName) {
    // 1. Hide text and buttons first
    this.hideText();
    this.hideButtons();

    // 2. Handle scene transition
    if (config.scene) {
      this.showScene(config.scene);
    }

    // 3. Handle flash transition
    if (config.flash) {
      CSSEffects.triggerFlash('scene-transition');
    }

    // 4. Handle audio
    if (config.audio) {
      this.audio.play(config.audio);
    }

    // 5. Handle animation
    if (config.animation) {
      this.playStateAnimation(config.animation, config.loop);
    }

    // 6. Handle curtain
    if (config.curtain) {
      this.closeCurtain();
    }

    // 7. Handle text (with delay for scene to settle)
    const textContent = config.getText ? config.getText() : config.text;
    if (textContent) {
      setTimeout(() => {
        this.showText(textContent);
      }, 800);
    }

    // 8. Handle buttons (after text)
    if (config.showButton) {
      setTimeout(() => {
        this.showButton(config.showButton);
      }, config.text ? 1500 : 500);
    }

    // 9. Handle special celebration effects
    if (stateName === STATES.CELEBRATION) {
      this.triggerCelebration();
    }

    // 10. Handle love letter reveal
    if (config.showLetter) {
      this.showLoveLetter();
    }

    // 11. Schedule auto-advance if duration set
    this.isTransitioning = false;
    
    if (config.duration && config.next && !config.waitForClick) {
      this.transitionTimeout = setTimeout(() => {
        this.transitionTo(config.next);
      }, config.duration);
    }
  }

  /**
   * Show a scene (hide all others)
   */
  showScene(sceneId) {
    Object.entries(this.elements.scenes).forEach(([id, element]) => {
      if (element) {
        if (id === sceneId) {
          element.classList.add('active');
        } else {
          element.classList.remove('active');
        }
      }
    });
  }

  /**
   * Play animation for current state
   */
  playStateAnimation(animationName, loop = false) {
    // Try Lottie first
    if (this.animations.isLoaded(animationName)) {
      this.animations.play(animationName, loop);
      return;
    }

    // Fall back to CSS effects
    switch(animationName) {
      case 'butterflies':
      case 'celebration':
        CSSEffects.createButterflies('butterflies-animation', 12);
        if (animationName === 'celebration') {
          CSSEffects.createButterflies('celebration-butterflies', 15);
        }
        break;
    }
  }

  /**
   * Show speech bubble with text (with typewriter effect)
   */
  showText(text) {
    this.elements.speechText.textContent = '';
    this.elements.speechBubble.classList.add('visible');
    
    // Typewriter effect
    let i = 0;
    const speed = 35; // ms per character
    
    const typeWriter = () => {
      if (i < text.length) {
        this.elements.speechText.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    };
    
    // Start typing after bubble fades in
    setTimeout(typeWriter, 400);
  }

  /**
   * Hide speech bubble
   */
  hideText() {
    this.elements.speechBubble.classList.remove('visible');
  }

  /**
   * Show a button
   */
  showButton(buttonType) {
    this.hideButtons();
    
    switch(buttonType) {
      case 'yes':
        this.elements.yesButton.classList.remove('hidden');
        setTimeout(() => {
          this.elements.yesButton.classList.add('visible');
        }, 100);
        break;
      case 'continue':
        this.elements.continueButton.classList.remove('hidden');
        setTimeout(() => {
          this.elements.continueButton.classList.add('visible');
        }, 100);
        break;
    }
  }

  /**
   * Hide all buttons
   */
  hideButtons() {
    this.elements.yesButton.classList.add('hidden');
    this.elements.yesButton.classList.remove('visible');
    this.elements.continueButton.classList.add('hidden');
    this.elements.continueButton.classList.remove('visible');
  }

  /**
   * Handle YES button click
   */
  handleYesClick() {
    console.log('💖 YES clicked!');
    this.hideButtons();
    this.hideText();
    
    // Trigger photo burst if photos available
    this.triggerPhotoBurst();
    
    const config = STATE_CONFIG[this.currentState];
    if (config && config.next) {
      this.transitionTo(config.next);
    }
  }

  /**
   * Handle continue button click
   */
  handleContinueClick() {
    console.log('➡️ Continue clicked');
    this.hideButtons();
    
    const config = STATE_CONFIG[this.currentState];
    if (config && config.next) {
      this.transitionTo(config.next);
    }
  }

  /**
   * Trigger celebration effects
   */
  triggerCelebration() {
    // Create hearts
    const heartsContainer = document.querySelector('.hearts-container');
    if (heartsContainer) {
      CSSEffects.createHearts(heartsContainer, 20);
      
      // Keep spawning hearts
      const heartInterval = setInterval(() => {
        if (this.currentState !== STATES.CELEBRATION) {
          clearInterval(heartInterval);
          return;
        }
        CSSEffects.createHearts(heartsContainer, 5);
      }, 1500);
    }

    // Butterflies
    CSSEffects.createButterflies('celebration-butterflies', 20);
  }

  /**
   * Close the curtain
   */
  closeCurtain() {
    this.elements.curtain.classList.add('closing');
  }

  /**
   * Show the love letter
   */
  showLoveLetter() {
    const letter = this.elements.loveLetter;
    const textEl = this.elements.letterText;
    const sigEl = this.elements.letterSignature;
    const photosEl = this.elements.letterPhotos;
    const videoGalleryEl = this.elements.videoGallery;
    const memoriesSectionEl = this.elements.memoriesSection;

    if (!letter) return;

    // Set content
    if (textEl && window.LOVE_LETTER_CONTENT) {
      textEl.textContent = window.LOVE_LETTER_CONTENT;
    }

    // Set signature
    if (sigEl && window.PERSONAL) {
      sigEl.textContent = window.PERSONAL.yourName;
    }

    // Add videos if available
    if (videoGalleryEl && window.PERSONAL && window.PERSONAL.videos && window.PERSONAL.videos.length > 0) {
      window.PERSONAL.videos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        
        const videoEl = document.createElement('video');
        videoEl.src = `assets/videos/${video}`;
        videoEl.controls = true;
        videoEl.playsInline = true;
        videoEl.preload = 'metadata';
        videoEl.setAttribute('playsinline', '');
        videoEl.setAttribute('webkit-playsinline', '');
        
        videoItem.appendChild(videoEl);
        videoGalleryEl.appendChild(videoItem);
      });
    } else if (memoriesSectionEl) {
      // Hide memories section if no videos
      memoriesSectionEl.style.display = 'none';
    }

    // Add photos if available
    if (photosEl && window.PERSONAL && window.PERSONAL.photos.length > 0) {
      window.PERSONAL.photos.forEach(photo => {
        const img = document.createElement('img');
        img.src = `assets/photos/${photo}`;
        img.className = 'letter-photo';
        img.alt = 'Our memory';
        photosEl.appendChild(img);
      });
    }

    // Show letter
    letter.classList.remove('hidden');
    setTimeout(() => {
      letter.classList.add('visible');
    }, 100);
  }

  /**
   * Trigger photo burst effect (when YES is clicked)
   */
  triggerPhotoBurst() {
    if (!window.PERSONAL || window.PERSONAL.photos.length === 0) return;

    const container = this.elements.photoBurst;
    if (!container) return;

    container.classList.remove('hidden');
    container.classList.add('active');

    // Scatter photos randomly
    window.PERSONAL.photos.forEach((photo, index) => {
      setTimeout(() => {
        const img = document.createElement('img');
        img.src = `assets/photos/${photo}`;
        img.className = 'burst-photo';
        img.style.left = `${Math.random() * 80 + 10}%`;
        img.style.top = `${Math.random() * 60 + 20}%`;
        img.style.animationDelay = `${Math.random() * 0.5}s`;
        container.appendChild(img);

        // Remove after animation
        setTimeout(() => img.remove(), 4500);
      }, index * 200);
    });
  }

  /**
   * Reset experience (for replay)
   */
  reset() {
    // Clear state
    this.currentState = null;
    this.previousState = null;
    
    // Clear timeouts
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
    }

    // Reset used memories
    window.usedMemories = [];

    // Reset UI
    this.hideText();
    this.hideButtons();
    this.elements.curtain.classList.remove('closing');
    
    // Reset scenes
    Object.values(this.elements.scenes).forEach(scene => {
      if (scene) scene.classList.remove('active');
    });

    // Reset audio
    this.audio.pauseAll();

    // Show start screen
    this.elements.app.classList.add('hidden');
    this.elements.startScreen.style.display = 'flex';
    this.elements.startScreen.classList.remove('fade-out');
    
    // Re-attach start listener
    this.elements.startScreen.addEventListener('click', this.handleStart);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.experience = new ExperienceController();
  window.experience.init();
});

// Handle visibility change (pause/resume)
document.addEventListener('visibilitychange', () => {
  if (window.experience) {
    if (document.hidden) {
      window.experience.audio.pauseAll();
    } else {
      window.experience.audio.resume();
    }
  }
});
