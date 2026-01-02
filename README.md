# OpusAudit - Claude API Billing Monitor & Evidence Collector

A comprehensive web-based application for monitoring Claude API usage, tracking billing discrepancies, and automatically generating evidence packages for refund requests. Built on [Puter.js](https://puter.com) for seamless cloud integration.

🚀 **[Live Demo](https://ludoplex.github.io/claudeit/)**

## Features

### 🔍 Real-time Monitoring
- Track all Claude API requests with comprehensive metadata
- Monitor token usage, costs, latency, and response status
- Display streaming responses in real-time
- Auto-save logs to secure cloud storage

### 💰 Cost Tracking
- Accurate cost calculation based on official Claude pricing
- Support for multiple models (Sonnet 4, Haiku 3.5, Sonnet 3.7)
- Real-time spending statistics and dashboard
- Export detailed CSV reports

### 🎯 Automated Refund Analysis
- Detect refundable events automatically:
  - **5xx Server Errors**: Service availability failures
  - **Incomplete Streams**: Missing completion signals
  - **Zero Output**: Charged requests with no output
- Professional support packet generation
- Evidence-based dispute documentation

### 📊 Dashboard & Analytics
- Real-time statistics (requests, refundable events, costs)
- Visual request logs with status indicators
- Dedicated refundable events panel
- Interactive chat interface

### ☁️ Cloud Integration
- Puter.js authentication
- Persistent cloud storage (KV)
- Save support packets to cloud
- Cross-device synchronization

## Quick Start

### Using the Live Demo

1. Visit **[https://ludoplex.github.io/claudeit/](https://ludoplex.github.io/claudeit/)**
2. Click "Sign in with Puter"
3. Authenticate with your Puter account
4. Start chatting with Claude and monitor your requests!

### Self-Hosting

1. Clone the repository:
   ```bash
   git clone https://github.com/ludoplex/claudeit.git
   cd claudeit
   ```

2. Serve the files (any static server works):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

3. Open `http://localhost:8000` in your browser

### GitHub Pages Deployment

1. Fork this repository
2. Go to Settings → Pages
3. Set Source to "Deploy from a branch"
4. Select branch: `main`, folder: `/ (root)`
5. Save and wait for deployment
6. Access at `https://[username].github.io/claudeit/`

## Project Structure

```
/
├── index.html          # Main application UI
├── puter.js            # Core application logic & modules
├── tests.html          # Comprehensive test suite
├── PRD.md              # Product Requirements Document
├── README.md           # This file
└── LICENSE             # MIT License
```

## Architecture

### Tech Stack
- **Frontend**: HTML5, CSS (Tailwind), JavaScript (ES6+)
- **Backend**: Puter.js (cloud services)
- **Authentication**: Puter.js Auth
- **Storage**: Puter KV (key-value store)
- **AI**: Puter.js AI Chat API (Claude)
- **Deployment**: GitHub Pages

### Modules

#### AppState
Manages application state including user, logs, and metrics.

#### StorageManager
Handles persistent storage via Puter KV and local downloads.

#### AuthManager
Manages user authentication and session state.

#### ClaudeAPIManager
Interfaces with Claude API via Puter.js with streaming support.

#### RefundAnalyzer
Analyzes logs for refundable events and generates support packets.

#### ExportManager
Exports logs and support packets as CSV/TXT files.

## Usage

### Monitoring API Calls

1. Sign in with Puter
2. Select a Claude model from the dropdown
3. Type your message and send
4. View real-time response and log details

### Generating Support Packets

1. Make API requests (some may fail or be incomplete)
2. Check the "Refundable Events" panel
3. Click "Generate Support Packet"
4. Review the cover letter
5. Download or save to Puter cloud

### Exporting Logs

- Click "Export CSV" in the Request Logs panel to download all logs
- Or use the support packet feature for refundable events only

## Testing

Open `tests.html` in your browser to run the comprehensive test suite:

```bash
# Serve the project and navigate to:
http://localhost:8000/tests.html
```

Tests cover:
- AppState management
- Utility functions
- Storage operations
- Authentication flow
- API interactions
- Refund analysis
- Export functionality
- End-to-end workflows

## Configuration

Edit `puter.js` to customize:

```javascript
const CONFIG = {
    storageKey: 'opusaudit_logs',
    defaultModel: 'claude-sonnet-4-20250514',
    maxLogsDisplay: 50,
    minDisputeThreshold: 5.00,
    autoSaveInterval: 30000 // 30 seconds
};
```

### Pricing Updates

Update pricing in `puter.js`:

```javascript
const PRICING = {
    'model-name': { input: 0.00X, output: 0.00Y }
};
```

## Security & Privacy

- ✅ All data stored in your private Puter cloud space
- ✅ No server-side storage or logging
- ✅ Secure OAuth authentication
- ✅ No tracking or analytics
- ✅ GDPR compliant (you own your data)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests
5. Submit a pull request

## Roadmap

### Phase 2: Enhanced Features (Q1 2026)
- [ ] Advanced filtering and search
- [ ] Custom refund rules
- [ ] Multi-user collaboration
- [ ] Dashboard customization

### Phase 3: Analytics (Q2 2026)
- [ ] Usage trends and patterns
- [ ] Cost forecasting
- [ ] Model performance comparison
- [ ] Anomaly detection

### Phase 4: Enterprise (Q3 2026)
- [ ] Team management
- [ ] Budget alerts
- [ ] API key management
- [ ] Audit reports

## Documentation

- **[Product Requirements Document](PRD.md)** - Comprehensive PRD
- **[Puter.js Documentation](https://docs.puter.com)** - Puter platform docs
- **[Claude API Documentation](https://docs.anthropic.com)** - Claude API reference

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/ludoplex/claudeit/issues)
- **Discussions**: [Ask questions or share ideas](https://github.com/ludoplex/claudeit/discussions)

## Acknowledgments

- Built with [Puter.js](https://puter.com)
- Powered by [Claude API](https://anthropic.com)
- UI designed with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Heroicons](https://heroicons.com)

---

**Made with ❤️ for the Claude API community**

*Note: This tool is not affiliated with or endorsed by Anthropic. It's an independent monitoring tool to help users track their API usage and billing.*

