# Project Eclipse 🌙

An interactive Valentine's Day web experience built with vanilla JavaScript, CSS animations, and optional Lottie animations.

---

## ❤️ PERSONALIZATION GUIDE (Start Here!)

Open `js/stateManager.js` and edit the `PERSONAL` object at the top:

```javascript
const PERSONAL = {
  // Her nickname - what do you call her?
  nickname: "my love",           // → Change to: "babe", "angel", her name, etc.
  
  // How you sign the letter
  yourName: "Forever yours",     // → Change to: "Love, [your name]" or similar
  
  // When did you meet/start dating?
  startDate: "2023-06-15",       // → Change to your actual date (YYYY-MM-DD)
  
  // Your memories together (add as many as you want!)
  memories: [
    "that first nervous coffee date",
    "dancing in the rain that summer night",
    // → Add YOUR real memories here
  ],
  
  // Your photos together
  photos: ["photo1.jpg", "beach.jpg"]  // → Add your photos to assets/photos/
};
```

### Adding Your Photos

1. Put your photos in `assets/photos/`
2. Add the filenames to the `photos` array above
3. Photos appear in the love letter + burst when she clicks YES

### Writing Your Love Letter

Find `LOVE_LETTER_CONTENT` in `js/stateManager.js` and rewrite it in your own words:

```javascript
const LOVE_LETTER_CONTENT = `To ${PERSONAL.nickname},

[Write from your heart here...]

`;
```

---

## Quick Start

### Option 1: Local Server (Recommended)

```bash
# Using Python
python3 -m http.server 8000

# Or using Node.js (if you have npx)
npx serve .

# Or using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

### Option 2: Direct Open
Simply open `index.html` in a modern browser. Note: Some features (audio, animations) may require a local server due to browser security policies.

## Project Structure

```
love/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All styles and CSS animations
├── js/
│   ├── main.js             # Main experience controller
│   ├── stateManager.js     # State machine configuration
│   ├── animationController.js  # Lottie & CSS animation handling
│   └── audioController.js  # Audio playback handling
├── assets/
│   ├── animations/         # Lottie JSON files (optional)
│   ├── audio/              # Background music & sounds
│   │   ├── ambient.mp3     # Background ambient music
│   │   └── celebration.mp3 # Celebration sound effect
│   └── images/             # Static images (if needed)
├── plan.md                 # Original planning document
└── README.md               # This file
```

## Adding Audio

Place your audio files in `assets/audio/`:
- `ambient.mp3` - Soft, looping background music for the experience
- `celebration.mp3` - Uplifting sound for the celebration scene

Recommended: Use royalty-free music from:
- [Pixabay Music](https://pixabay.com/music/)
- [Free Music Archive](https://freemusicarchive.org/)
- [Uppbeat](https://uppbeat.io/)

## Adding Lottie Animations (Optional)

The experience works with CSS fallback animations, but you can enhance it with Lottie:

1. Download or create Lottie JSON files
2. Place them in `assets/animations/` with these names:
   - `void-glow.json` - Glowing light effect for intro
   - `character-emerge.json` - Character appearing
   - `door-sequence.json` - Door with light leaking
   - `butterflies.json` - Butterfly particles

Find free Lottie animations at:
- [LottieFiles](https://lottiefiles.com/)
- [IconScout](https://iconscout.com/lottie-animations)

## Customization

### Changing Messages

Edit the text in `js/stateManager.js`:

```javascript
[STATES.MESSAGE_1]: {
  text: "Your custom message here",
  // ...
}
```

### Changing Timing

Adjust `duration` values in `js/stateManager.js` (in milliseconds):

```javascript
[STATES.INTRO_VOID]: {
  duration: 3500,  // Increase for longer scenes
  // ...
}
```

### Changing Colors

Edit CSS variables in `css/styles.css`:
- Button gradient colors
- Background gradients
- Speech bubble styling

## Browser Support

- ✅ Chrome (recommended)
- ✅ Safari (iOS & macOS)
- ✅ Firefox
- ✅ Edge

## Mobile

The experience is mobile-first and optimized for:
- Touch interactions
- Dynamic viewport height (100dvh)
- Responsive text sizing

## Troubleshooting

### Audio not playing?
- Audio requires user interaction to start (tap the start screen)
- Make sure audio files exist in `assets/audio/`
- Check browser console for errors

### Animations not showing?
- CSS fallback animations are always active
- For Lottie, ensure JSON files are valid and in correct location
- Check browser console for loading errors

### Experience stuck?
- Check browser console for JavaScript errors
- Try refreshing the page
- Open in a different browser

## Development

To modify the experience:

1. **States**: Edit `js/stateManager.js` to add/modify scenes
2. **Styling**: Edit `css/styles.css` for visual changes
3. **Logic**: Edit `js/main.js` for behavior changes
4. **Animations**: Edit `js/animationController.js` for animation handling

---

## 🚀 Deployment to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if you haven't already):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy** (from the project directory):
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project? **No** (first time)
   - Project name: `project-eclipse` (or your choice)
   - Directory: `.` (current directory)
   - Override settings? **No**

5. **For production deployment**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub + Vercel Dashboard

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a static site
   - Click "Deploy"

3. **Done!** Your site will be live at `your-project.vercel.app`

### Option 3: Drag & Drop (Quick Test)

1. Go to [vercel.com](https://vercel.com)
2. Sign in
3. Click "Add New..." → "Project"
4. Drag and drop your project folder
5. Deploy!

---

### Important Notes for Deployment

✅ **File Size Limits**: 
- Vercel has a 100MB limit per file
- Your videos might be large — consider compressing them
- Total project size should be under 1GB

✅ **Custom Domain** (Optional):
- After deployment, go to Project Settings → Domains
- Add your custom domain (e.g., `valentine.yourname.com`)
- Follow DNS setup instructions

✅ **Environment Variables** (if needed later):
- Project Settings → Environment Variables
- Not needed for this static site, but good to know

✅ **Preview Deployments**:
- Every push to GitHub creates a preview URL
- Production URL stays stable
- Perfect for testing before going live!

---

## License

Made with ❤️ for someone special.
