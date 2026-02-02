/**
 * Audio Controller for Project Eclipse
 * Handles background music and sound effects
 */

class AudioController {
  constructor() {
    this.ordinary = document.getElementById('ordinary-audio');
    this.ambient = document.getElementById('ambient-audio');
    this.celebration = document.getElementById('celebration-audio');
    this.isEnabled = true;
    this.hasInteracted = false;
    this.pendingAudio = null;
  }

  /**
   * Initialize audio (must be called after user interaction)
   */
  init() {
    this.hasInteracted = true;
    
    // Play any pending audio
    if (this.pendingAudio) {
      this.play(this.pendingAudio);
      this.pendingAudio = null;
    }
  }

  /**
   * Play ordinary background music (main soundtrack)
   */
  playOrdinary(volume = 0.4) {
    if (!this.ordinary) return;
    
    if (!this.hasInteracted) {
      this.pendingAudio = 'ordinary';
      return;
    }

    this.ordinary.volume = volume;
    this.ordinary.play().catch(err => {
      console.warn('Ordinary audio playback failed:', err);
    });
  }

  /**
   * Stop ordinary music with fade out
   */
  stopOrdinary(fadeMs = 1000) {
    if (!this.ordinary) return;

    const startVolume = this.ordinary.volume;
    const steps = 20;
    const stepTime = fadeMs / steps;
    const volumeStep = startVolume / steps;

    const fadeInterval = setInterval(() => {
      if (this.ordinary.volume > volumeStep) {
        this.ordinary.volume -= volumeStep;
      } else {
        this.ordinary.volume = 0;
        this.ordinary.pause();
        this.ordinary.currentTime = 0;
        clearInterval(fadeInterval);
      }
    }, stepTime);
  }

  /**
   * Play ambient background music
   */
  playAmbient(volume = 0.25) {
    if (!this.ambient) return;
    
    if (!this.hasInteracted) {
      this.pendingAudio = 'ambient';
      return;
    }

    this.ambient.volume = volume;
    this.ambient.play().catch(err => {
      console.warn('Audio playback failed:', err);
    });
  }

  /**
   * Stop ambient music with fade out
   */
  stopAmbient(fadeMs = 1000) {
    if (!this.ambient) return;

    const startVolume = this.ambient.volume;
    const steps = 20;
    const stepTime = fadeMs / steps;
    const volumeStep = startVolume / steps;

    const fadeInterval = setInterval(() => {
      if (this.ambient.volume > volumeStep) {
        this.ambient.volume -= volumeStep;
      } else {
        this.ambient.volume = 0;
        this.ambient.pause();
        this.ambient.currentTime = 0;
        clearInterval(fadeInterval);
      }
    }, stepTime);
  }

  /**
   * Play celebration sound
   */
  playCelebration(volume = 0.5) {
    if (!this.celebration) return;
    
    if (!this.hasInteracted) {
      this.pendingAudio = 'celebration';
      return;
    }

    // Lower ordinary volume but keep it playing (fade to 20% volume)
    if (this.ordinary && !this.ordinary.paused) {
      this.fadeVolume(this.ordinary, 0.2, 500);
    }
    
    // Fade out ambient if playing
    this.stopAmbient(500);

    setTimeout(() => {
      this.celebration.volume = volume;
      this.celebration.play().catch(err => {
        console.warn('Celebration audio failed:', err);
      });
    }, 500);
  }

  /**
   * Fade audio volume to target level
   */
  fadeVolume(audio, targetVolume, duration = 1000) {
    if (!audio) return;

    const startVolume = audio.volume;
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = (startVolume - targetVolume) / steps;

    const fadeInterval = setInterval(() => {
      if ((volumeStep > 0 && audio.volume > targetVolume) || 
          (volumeStep < 0 && audio.volume < targetVolume)) {
        audio.volume -= volumeStep;
      } else {
        audio.volume = targetVolume;
        clearInterval(fadeInterval);
      }
    }, stepTime);
  }

  /**
   * Play named audio
   */
  play(name) {
    switch(name) {
      case 'ordinary':
        this.playOrdinary();
        break;
      case 'ambient':
        this.playAmbient();
        break;
      case 'celebration':
        this.playCelebration();
        break;
      default:
        console.warn(`Unknown audio: ${name}`);
    }
  }

  /**
   * Pause all audio
   */
  pauseAll() {
    if (this.ordinary) this.ordinary.pause();
    if (this.ambient) this.ambient.pause();
    if (this.celebration) this.celebration.pause();
  }

  /**
   * Resume audio if it was playing
   */
  resume() {
    if (this.ordinary && this.ordinary.currentTime > 0) {
      this.ordinary.play().catch(() => {});
    }
    if (this.ambient && this.ambient.currentTime > 0) {
      this.ambient.play().catch(() => {});
    }
  }

  /**
   * Set master volume
   */
  setVolume(volume) {
    if (this.ordinary) this.ordinary.volume = volume * 0.8;
    if (this.ambient) this.ambient.volume = volume * 0.5;
    if (this.celebration) this.celebration.volume = volume;
  }

  /**
   * Mute/unmute
   */
  toggleMute() {
    this.isEnabled = !this.isEnabled;
    if (this.ordinary) this.ordinary.muted = !this.isEnabled;
    if (this.ambient) this.ambient.muted = !this.isEnabled;
    if (this.celebration) this.celebration.muted = !this.isEnabled;
    return this.isEnabled;
  }
}

// Export for use
window.AudioController = AudioController;
