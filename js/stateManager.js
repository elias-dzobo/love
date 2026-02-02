/**
 * State Manager for Project Eclipse
 * Defines all states and their configurations
 */

const STATES = {
  INTRO_VOID: 'INTRO_VOID',
  CHARACTER_APPEAR: 'CHARACTER_APPEAR',
  MESSAGE_1: 'MESSAGE_1',
  INVITATION: 'INVITATION',
  WALK_TO_DOOR: 'WALK_TO_DOOR',
  DOOR_REVEAL: 'DOOR_REVEAL',
  DOOR_OPEN: 'DOOR_OPEN',
  TRANSITION: 'TRANSITION',
  PARADISE_REVEAL: 'PARADISE_REVEAL',
  MEMORY_1: 'MEMORY_1',
  MEMORY_2: 'MEMORY_2',
  MEMORY_3: 'MEMORY_3',
  MEMORY_4: 'MEMORY_4',
  QUESTION: 'QUESTION',
  CELEBRATION: 'CELEBRATION',
  CURTAIN_CLOSE: 'CURTAIN_CLOSE',
  LOVE_LETTER: 'LOVE_LETTER',
  END: 'END'
};

/**
 * Configuration for each state
 * - scene: which scene element to show
 * - animation: Lottie animation to play (if any)
 * - loop: whether animation loops
 * - duration: auto-advance after ms (null = wait for trigger)
 * - text: speech bubble text (if any)
 * - showButton: which button to show ('yes', 'continue', or null)
 * - waitForClick: wait for user interaction before advancing
 * - next: the next state to transition to
 * - onEnter: custom function to run on entering state
 * - onExit: custom function to run on exiting state
 */
/**
 * ═══════════════════════════════════════════════════════════════
 * 💕 PERSONALIZATION SETTINGS - Edit these to make it yours!
 * ═══════════════════════════════════════════════════════════════
 */
const PERSONAL = {
  // ─────────────────────────────────────────────────────────────
  // BASICS
  // ─────────────────────────────────────────────────────────────
  
  // Her nickname - what do you actually call her?
  // Examples: "baby", "my love", "sunshine", her actual name, etc.
  nickname: "my love",
  
  // How you sign the letter at the end
  // Examples: "Forever yours, Mike", "With all my love", "Your [nickname]"
  yourName: "Forever yours",
  
  // ─────────────────────────────────────────────────────────────
  // YOUR STORY
  // ─────────────────────────────────────────────────────────────
  
  // When did you meet or start dating? (for the "X days" counter)
  // Format: "YYYY-MM-DD"
  startDate: "2018-10-01",  // ~2665 days of being together
  
  // Specific memories to reference - these show up in the experience
  // These are YOUR real memories together - they'll randomly appear during the experience
  memories: [
    "all those days we sat at the fire exit talking for hours as if time didn't mean anything",
    "all the times we snuck out to spend time with each other in the early mornings",
    "the day we were supposed to meet up in the morning and I overslept",
    "having lunch together",
    "all the fun we had together in uni",
    "being joined at the hip, always together",
    "being at your place, watching shows",
    "talking so much into the night",
    "staying on Zoom during COVID for hours, talking and watching movies",
    "coming to your place at 6am and spending the entire day together",
    "making breakfast together",
    "making lunch together",
    "going to the gym together",
    "getting dinner together",
    "all the fun we had at our house",
    "I can't wait for us to have all of those things and more again in a few months"
  ],
  
  // ─────────────────────────────────────────────────────────────
  // PHOTOS (highly recommended!)
  // ─────────────────────────────────────────────────────────────
  
  // Your photos together - these appear in the love letter and 
  // burst across the screen when she clicks YES
  photos: [],
  
  // Your videos together - these play during the experience
  videos: [
    "30545B3E-09A9-41CA-AD6B-53E9AED2B287.MP4",
    "3E89E03B-D69C-4A5D-A4FC-C14DA5A22A41.MP4",
    "5277A85D-2085-4224-B923-24790EA1B08E.MP4",
    "5D9831ED-63E9-405F-9817-FCAE5315ED96.MOV",
    "816FA417-6D61-4388-94A8-2E8154BC62C0.MOV",
    "9D4906A3-658A-40D3-B922-979BA47B60DB.MP4"
  ],
  
  // ─────────────────────────────────────────────────────────────
  // AUDIO (optional but powerful)
  // ─────────────────────────────────────────────────────────────
  
  // Want to use YOUR voice or YOUR song?
  // 
  // FOR YOUR VOICE:
  // 1. Record yourself reading the messages on your phone
  // 2. Save as .mp3 files in assets/audio/
  // 3. (Advanced) Edit main.js to play them at specific states
  //
  // FOR YOUR SONG:
  // 1. Find a song that means something to you both
  // 2. Save it as assets/audio/ambient.mp3
  // 3. It will play throughout the experience
  //
  // Tip: Use a soft instrumental version or acoustic cover
  //      so it doesn't overpower the experience
  
  // ─────────────────────────────────────────────────────────────
  // EXTRAS
  // ─────────────────────────────────────────────────────────────
  
  // Inside joke - something only she would understand (optional)
  // This could show up as a small easter egg
  insideJoke: null,
  
  // Her favorite color (affects button/accent colors if set)
  // Options: null (default pink), or a hex color like "#7C3AED" (purple)
  favoriteColor: null
};

// Calculate days together
function getDaysTogether() {
  const start = new Date(PERSONAL.startDate);
  const now = new Date();
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return diff;
}

const STATE_CONFIG = {
  [STATES.INTRO_VOID]: {
    scene: 'scene-void',
    animation: null,
    loop: true,
    duration: 3500,
    text: null,
    showButton: null,
    waitForClick: false,
    next: STATES.CHARACTER_APPEAR
    // Note: ordinary.mp3 plays throughout the entire experience
  },

  [STATES.CHARACTER_APPEAR]: {
    scene: 'scene-character',
    animation: 'character-emerge',
    loop: false,
    duration: 2500,
    text: null,
    showButton: null,
    waitForClick: false,
    next: STATES.MESSAGE_1
  },

  [STATES.MESSAGE_1]: {
    scene: 'scene-character',
    animation: null,
    loop: false,
    duration: null,
    text: `Hey ${PERSONAL.nickname}… I made something for you.`,
    showButton: 'continue',
    waitForClick: true,
    next: STATES.INVITATION
  },

  [STATES.INVITATION]: {
    scene: 'scene-character',
    animation: null,
    loop: false,
    duration: null,
    text: "Close your eyes for a moment. I want to take you somewhere.",
    showButton: 'continue',
    waitForClick: true,
    next: STATES.DOOR_REVEAL
  },

  [STATES.DOOR_REVEAL]: {
    scene: 'scene-door',
    animation: 'door-appear',
    loop: false,
    duration: 2000,
    text: null,
    showButton: null,
    waitForClick: false,
    next: STATES.DOOR_OPEN
  },

  [STATES.DOOR_OPEN]: {
    scene: 'scene-door',
    animation: 'door-open',
    loop: false,
    duration: 2500,
    text: null,
    showButton: null,
    waitForClick: false,
    next: STATES.TRANSITION
  },

  [STATES.TRANSITION]: {
    scene: 'scene-transition',
    animation: null,
    loop: false,
    duration: 2000,
    text: null,
    showButton: null,
    waitForClick: false,
    next: STATES.PARADISE_REVEAL,
    flash: true
  },

  [STATES.PARADISE_REVEAL]: {
    scene: 'scene-paradise',
    animation: 'butterflies',
    loop: true,
    duration: 2500,
    text: null,
    showButton: null,
    waitForClick: false,
    next: STATES.MEMORY_1
  },

  [STATES.MEMORY_1]: {
    scene: 'scene-paradise',
    animation: null,
    loop: true,
    duration: null,
    text: null,
    getText: () => {
      if (!window.usedMemories) window.usedMemories = [];
      const available = PERSONAL.memories.filter(m => !window.usedMemories.includes(m));
      const memory = available.length > 0 
        ? available[Math.floor(Math.random() * available.length)]
        : PERSONAL.memories[Math.floor(Math.random() * PERSONAL.memories.length)];
      window.usedMemories.push(memory);
      return `I keep thinking about ${memory}…`;
    },
    showButton: 'continue',
    waitForClick: true,
    next: STATES.MEMORY_2
  },

  [STATES.MEMORY_2]: {
    scene: 'scene-paradise',
    animation: null,
    loop: true,
    duration: null,
    text: null,
    getText: () => {
      if (!window.usedMemories) window.usedMemories = [];
      const available = PERSONAL.memories.filter(m => !window.usedMemories.includes(m));
      const memory = available.length > 0 
        ? available[Math.floor(Math.random() * available.length)]
        : PERSONAL.memories[Math.floor(Math.random() * PERSONAL.memories.length)];
      window.usedMemories.push(memory);
      return `I keep thinking about ${memory}…`;
    },
    showButton: 'continue',
    waitForClick: true,
    next: STATES.MEMORY_3
  },

  [STATES.MEMORY_3]: {
    scene: 'scene-paradise',
    animation: null,
    loop: true,
    duration: null,
    text: null,
    getText: () => {
      if (!window.usedMemories) window.usedMemories = [];
      const available = PERSONAL.memories.filter(m => !window.usedMemories.includes(m));
      const memory = available.length > 0 
        ? available[Math.floor(Math.random() * available.length)]
        : PERSONAL.memories[Math.floor(Math.random() * PERSONAL.memories.length)];
      window.usedMemories.push(memory);
      return `I keep thinking about ${memory}…`;
    },
    showButton: 'continue',
    waitForClick: true,
    next: STATES.MEMORY_4
  },

  [STATES.MEMORY_4]: {
    scene: 'scene-paradise',
    animation: null,
    loop: true,
    duration: null,
    text: null,
    getText: () => {
      if (!window.usedMemories) window.usedMemories = [];
      const available = PERSONAL.memories.filter(m => !window.usedMemories.includes(m));
      const memory = available.length > 0 
        ? available[Math.floor(Math.random() * available.length)]
        : PERSONAL.memories[Math.floor(Math.random() * PERSONAL.memories.length)];
      window.usedMemories.push(memory);
      return `I keep thinking about ${memory}…`;
    },
    showButton: 'continue',
    waitForClick: true,
    next: STATES.QUESTION
  },

  [STATES.QUESTION]: {
    scene: 'scene-paradise',
    animation: null,
    loop: true,
    duration: null,
    text: null,
    getText: () => {
      const days = getDaysTogether();
      return `${days} days of being together...\n\nAnd even more days of me loving you.\n\nBe my Valentine, Beautiful?`;
    },
    showButton: 'yes',
    waitForClick: true,
    next: STATES.CELEBRATION
  },

  [STATES.CELEBRATION]: {
    scene: 'scene-celebration',
    animation: 'celebration',
    loop: true,
    duration: 5000,
    text: null,
    showButton: null,
    waitForClick: false,
    next: STATES.CURTAIN_CLOSE,
    audio: 'celebration'
  },

  [STATES.CURTAIN_CLOSE]: {
    scene: 'scene-celebration',
    animation: null,
    loop: false,
    duration: 3000,
    text: null,
    showButton: null,
    waitForClick: false,
    next: STATES.LOVE_LETTER,
    curtain: true
  },

  [STATES.LOVE_LETTER]: {
    scene: null,
    animation: null,
    loop: false,
    duration: null,
    text: null,
    showButton: null,
    waitForClick: false,
    next: STATES.END,
    showLetter: true
  },

  [STATES.END]: {
    scene: null,
    animation: null,
    loop: false,
    duration: null,
    text: null,
    showButton: null,
    waitForClick: false,
    next: null
  }
};

/**
 * The love letter content
 */
const LOVE_LETTER_CONTENT = `Perhaps the most ambiguous question today is "what is love"?

Some describe it as a feeling, a notion, a reason...

To me, love is everything and anything about a person.

Love is you — on any day, at any time.

Love is when I wake up in the morning and realise I have you.

Love is the yearning I have whenever we are apart.

Love is me holding your hands on days when life is acting up.

Love is sharing all your moments of joy and happiness.

Love is doing life with you.

Love is you and me, together, forever.

I love you.

I'm in love with every fiber of your being.

I miss you so much.

I'm definitely looking forward to spending life with you.`;

// Make it available globally
window.LOVE_LETTER_CONTENT = LOVE_LETTER_CONTENT;
window.PERSONAL = PERSONAL;
window.getDaysTogether = getDaysTogether;

// Messages can be customized here
const MESSAGES = {
  greeting: "Hey… I hope you're doing okay. I've missed you.",
  invitation: "I have something special to show you. Close your eyes and come with me.",
  declaration: "We've shared so many memories… grown together… and I love every version of you — past, present, and future.",
  question: "Will you be my Valentine?"
};
