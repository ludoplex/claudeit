# ClaudeIt

A single-file Puter.js application for Claude API monitoring and billing dispute evidence collection.

## Features

- **API Gateway** - Interactive chat interface with streaming support
- **Jobs Queue** - Background job processing with disconnect survival
- **Incident Tracking** - Automatic detection of incomplete streams and errors
- **Request Details** - Deep inspection of requests/responses/headers/SSE events
- **Audit Dashboard** - Comprehensive statistics and disputable events tracking
- **Support Packet Generation** - Creates CSV and cover letters for Anthropic support
- **Multi-model Support** - All Claude models including Opus 4.5, Claude 4, 3.7, 3.5, 3, and legacy models
- **Job Mode** - Keeps upstream connection alive even if browser disconnects
- **Authentication** - Puter.js authentication integration
- **Dark Theme** - Professional dark UI optimized for extended use

## Model Support

Supports **Claude Opus 4.5** (claude-opus-4-5-20260128) along with:
- Claude 4: Opus 4, Sonnet 4
- Claude 3.7: Sonnet 3.7
- Claude 3.5: Sonnet 3.5 (2024-10-22, 2024-06-20), Haiku 3.5
- Claude 3: Opus 3, Sonnet 3, Haiku 3
- Legacy: Claude 2.1, 2.0, Instant 1.2

## Usage

### Option 1: Use in Browser
Open `index.html` directly in your browser.

### Option 2: Deploy to Puter.com
1. Visit https://puter.com
2. Upload `index.html`
3. Open the HTML file in Puter

### Option 3: Deploy to Static Hosting
Deploy to any static hosting service (GitHub Pages, Netlify, Vercel, etc.)

## Dependencies

- Puter.js v2 (loaded via CDN)
- Tailwind CSS v4 (loaded via CDN)
- No build process required
- Pure JavaScript (ES6+)
- Single HTML file - no external JS files needed

## Browser Compatibility

Works in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Privacy

- Stores data locally using Puter.js
- Never sends data to third parties
- Keeps API keys secure in browser storage
- Processes everything client-side

## License

Licensed under GPL-3.0 (see LICENSE file in root directory)
