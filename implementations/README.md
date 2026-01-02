# ClaudeIt Implementations

This directory contains two distinct implementations of the ClaudeIt application:

## 1. Full Implementation (`index-full.html` + `app-full.js`)

**Features:**
- Complete audit logging with detailed metadata
- Comprehensive dashboard with statistics
- Full export capabilities (JSON and CSV)
- Detailed log viewer with expandable entries
- Support for all Claude models with accurate pricing
- Error logging and handling
- Test API connection interface
- 23 unit tests with 61% code coverage

**Best for:**
- Complete audit trails for refund documentation
- Detailed cost analysis
- Professional use cases
- Compliance and record-keeping

**File Size:** ~23KB combined

## 2. Lite Implementation (`index-lite.html` + `app-lite.js`)

**Features:**
- Minimal, fast interface
- Quick test functionality
- Basic logging (success/error)
- Simple JSON export
- Focused on speed and simplicity
- Single-model support (Claude 3.5 Sonnet)
- Compact log display

**Best for:**
- Quick API testing
- Lightweight monitoring
- Personal use
- Learning and experimentation

**File Size:** ~11KB combined

## Usage

### Option 1: Use in Browser
Open either `index-full.html` or `index-lite.html` directly in your browser.

### Option 2: Deploy to Puter.com
1. Visit https://puter.com
2. Upload the HTML and JS files for your preferred implementation
3. Open the HTML file in Puter

### Option 3: Deploy to Static Hosting
Deploy to any static hosting service (GitHub Pages, Netlify, Vercel, etc.)

## Downloading Implementations

Both implementations are available as standalone zip files:
- `claudeit-full.zip` - Complete implementation
- `claudeit-lite.zip` - Lightweight implementation

Extract and use the HTML file directly in your browser.

## Which Implementation Should I Use?

**Use Full Implementation if you need:**
- Complete audit trails for legal/compliance purposes
- Detailed cost breakdowns and analysis
- CSV export for spreadsheet analysis
- Support for multiple Claude models
- Professional documentation

**Use Lite Implementation if you want:**
- Quick API testing
- Minimal interface
- Fast load times
- Simple monitoring
- Learning tool

## Technical Differences

| Feature | Full | Lite |
|---------|------|------|
| File Size | ~23KB | ~11KB |
| Models Supported | All 5 Claude models | Claude 3.5 Sonnet only |
| Export Formats | JSON + CSV | JSON only |
| Log Detail Level | Complete | Summary |
| Test Coverage | 23 tests | - |
| UI Complexity | Comprehensive | Minimal |

## Dependencies

Both implementations use:
- Puter.js v2 (for storage)
- Tailwind CSS v4 (via CDN)
- No build process required
- Pure JavaScript (ES6+)

## Browser Compatibility

Both implementations work in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Privacy

Both implementations:
- Store data locally using Puter.js
- Never send data to third parties
- Keep API keys secure in browser storage
- Process everything client-side

## License

Both implementations are licensed under GPL-3.0 (see LICENSE file in root directory)
