# ClaudeIt Implementations

This directory contains three distinct implementations of the ClaudeIt application:

## 1. Full Implementation (`index-full.html` + `app.js`)

**Features:**
- Complete audit logging with detailed metadata
- Comprehensive dashboard with statistics
- Full export capabilities (JSON and CSV)
- Support for all Claude models (including Opus 4.5) with accurate pricing
- Error logging and handling
- Test API connection interface
- 23 unit tests with 61% code coverage

**Best for:**
- Complete audit trails for refund documentation
- Detailed cost analysis
- Professional use cases
- Compliance and record-keeping

**File Size:** ~5.7KB zipped

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

**File Size:** ~3.8KB zipped

## 3. Enhanced Implementation (`index-enhanced.html`) **NEW**

**Features:**
- **API Gateway** - Interactive chat interface with streaming support
- **Jobs Queue** - Background job processing with disconnect survival
- **Incident Tracking** - Automatic detection of incomplete streams and errors
- **Request Details** - Deep inspection of requests/responses/headers/SSE events
- **Audit Dashboard** - Comprehensive statistics and disputable events tracking
- **Support Packet Generation** - Creates CSV and cover letters for Anthropic support
- **Multi-model Support** - All Claude models including **Opus 4.5**, Claude 4, 3.7, 3.5, 3, and legacy models
- **Job Mode** - Keeps upstream connection alive even if browser disconnects
- **Authentication** - Puter.js authentication integration
- **Dark Theme** - Professional dark UI optimized for extended use

**Best for:**
- Professional API gateway deployment
- Production monitoring and incident management
- Billing dispute documentation
- Team collaboration
- High-volume API usage tracking

**File Size:** ~19KB zipped

## Model Support

All implementations now support **Claude Opus 4.5** (claude-opus-4-5-20260128) along with:
- Claude 4: Opus 4, Sonnet 4
- Claude 3.7: Sonnet 3.7
- Claude 3.5: Sonnet 3.5 (2024-10-22, 2024-06-20), Haiku 3.5
- Claude 3: Opus 3, Sonnet 3, Haiku 3
- Legacy: Claude 2.1, 2.0, Instant 1.2

## Usage

### Option 1: Use in Browser
Open either `index-full.html`, `index-lite.html`, or `index-enhanced.html` directly in your browser.

### Option 2: Deploy to Puter.com
1. Visit https://puter.com
2. Upload the HTML and JS files for your preferred implementation
3. Open the HTML file in Puter

### Option 3: Deploy to Static Hosting
Deploy to any static hosting service (GitHub Pages, Netlify, Vercel, etc.)

## Downloading Implementations

All implementations are available as standalone zip files:
- `claudeit-full.zip` - Complete implementation
- `claudeit-lite.zip` - Lightweight implementation  
- `claudeit-enhanced.zip` - Advanced implementation with API Gateway **NEW**

Extract and use the HTML file directly in your browser.

## Which Implementation Should I Use?

**Use Enhanced Implementation if you need:**
- API Gateway functionality with streaming
- Jobs Queue for disconnect survival
- Incident tracking and billing dispute evidence
- Professional production deployment
- Multiple concurrent requests
- Team collaboration features

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

| Feature | Enhanced | Full | Lite |
|---------|----------|------|------|
| File Size | ~19KB | ~5.7KB | ~3.8KB |
| Models Supported | All models + Opus 4.5 | All 5 Claude models | Claude 3.5 Sonnet only |
| Export Formats | JSON + CSV + Support Packet | JSON + CSV | JSON only |
| Log Detail Level | Complete + SSE Events | Complete | Summary |
| Test Coverage | - | 23 tests | - |
| UI Complexity | Advanced (Multi-tab) | Comprehensive | Minimal |
| API Gateway | ✅ Yes | ❌ No | ❌ No |
| Jobs Queue | ✅ Yes | ❌ No | ❌ No |
| Incident Tracking | ✅ Yes | ❌ No | ❌ No |
| Authentication | ✅ Yes | ❌ No | ❌ No |
| Streaming Support | ✅ Yes | ❌ No | ❌ No |

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
