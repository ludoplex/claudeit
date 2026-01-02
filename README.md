# ClaudeIt - Claude API Billing Monitor

![CI](https://github.com/ludoplex/claudeit/workflows/CI/badge.svg)

ClaudeIt is a comprehensive audit logging and billing monitor for the Anthropic Claude API. It helps you track API usage, costs, and maintain detailed logs that can be used for refund claims per Anthropic's Terms of Service.

## Primary Implementation: Enhanced Gateway

The main implementation is now the **Enhanced Gateway** - a professional-grade API monitoring and billing dispute evidence collector.

### 🌐 Live Demo

**Try it now:** [https://ludoplex.github.io/claudeit/](https://ludoplex.github.io/claudeit/)

Or launch directly:
- **[Enhanced Gateway](https://ludoplex.github.io/claudeit/app.html)** (Recommended) - Full-featured application
- [Full Implementation](https://ludoplex.github.io/claudeit/implementations/index-full.html) - Complete audit logging
- [Lite Implementation](https://ludoplex.github.io/claudeit/implementations/index-lite.html) - Minimal interface

### 🚀 Enhanced Gateway Features (app.html)

**Single-file, zero-dependency application** (97KB, runs entirely in browser):

- **🔌 API Gateway** - Interactive chat interface with streaming support for real-time responses
- **📋 Jobs Queue** - Background job processing that survives browser disconnects  
- **🚨 Incident Tracking** - Automatic detection of incomplete streams, errors, and disputable events
- **📊 Multi-tab Interface**:
  - Gateway (interactive chat)
  - Request Details (deep inspection of requests/responses/headers/SSE events)
  - Jobs (queue management)
  - Logs (complete request history)
  - Incidents (disputable events)
  - Audit (statistics dashboard)
  - Export (support packet generation)
- **🎨 Professional Dark Theme** - Optimized for extended monitoring sessions
- **📦 Support Packet Generation** - Creates CSV files and cover letters for Anthropic support tickets
- **🔐 Puter.js Authentication** - User authentication and profile management
- **✨ Full Model Support** including **Claude Opus 4.5** and all Claude 4, 3.7, 3.5, 3, and legacy models

**Best for:** Production deployment, high-volume usage, billing dispute documentation, professional API monitoring

## Alternative Implementations

For simpler use cases, alternative implementations are available in the `implementations/` folder:

### 🔧 Full Implementation (index.html + app.js)
- Complete audit logging with detailed metadata
- Comprehensive dashboard and statistics
- Full export capabilities (JSON and CSV)
- Support for all Claude models including **Opus 4.5**
- 23 unit tests, CI/CD ready
- **Best for:** Professional use, compliance, complete audit trails

### ⚡ Lite Implementation (implementations/index-lite.html + app-lite.js)
- Minimal, fast interface
- Quick API testing
- Simple logging and JSON export
- Single model support
- **Best for:** Quick testing, personal use, learning

### 🚀 Enhanced Implementation (implementations/index-enhanced.html) **NEW**
- **API Gateway** with streaming support
- **Jobs Queue** for disconnect survival
- **Incident Tracking** and billing dispute evidence
- Multi-tab interface (Gateway, Jobs, Logs, Incidents, Audit, Export)
- Support for **Claude Opus 4.5** and all models
- Professional dark theme
- **Best for:** Production deployment, high-volume usage, team collaboration

📦 **Download Ready-to-Use Packages:**
- [`implementations/claudeit-full.zip`](implementations/claudeit-full.zip) - Complete implementation (5.7KB)
- [`implementations/claudeit-lite.zip`](implementations/claudeit-lite.zip) - Lightweight version (3.8KB)
- [`implementations/claudeit-enhanced.zip`](implementations/claudeit-enhanced.zip) - Advanced gateway (19KB) **NEW**

See [implementations/README.md](implementations/README.md) for detailed comparison.

## Features

- 🔐 **Secure API Key Storage**: Uses Puter.js KV store for client-side encrypted storage
- 📊 **Usage Dashboard**: Real-time tracking of API calls, tokens used, and estimated costs
- 📝 **Detailed Audit Logs**: Complete logging of all requests and responses with timestamps
- 💰 **Cost Calculation**: Automatic cost estimation for all Claude models
- 📤 **Export Functionality**: Export logs in JSON or CSV format for record-keeping
- 🔒 **Privacy-First**: All data stored locally - your API key never leaves your device
- ✅ **Comprehensive Testing**: Full test suite with high coverage
- 🚀 **CI/CD Ready**: GitHub Actions workflows for automated testing

## Live Demo

Open `index.html` in your browser or deploy to any static hosting service. The application uses Puter.js for storage and runs entirely in the browser.

## Installation & Deployment

### Option 1: Use GitHub Pages (Recommended)

Visit the live deployment: **[https://ludoplex.github.io/claudeit/](https://ludoplex.github.io/claudeit/)**

No installation required - just open in your browser and start monitoring!

### Option 2: Direct Use
1. Clone this repository
2. Open `index.html` in a modern web browser for the landing page
3. Or open `app.html` directly for the enhanced gateway
4. Enter your Anthropic API key
5. Start monitoring!

### Option 3: Deploy to Puter.com
1. Visit [puter.com](https://puter.com)
2. Upload the `app.html` file
3. Open the application

### Option 4: Deploy Your Own GitHub Pages

Fork this repository and enable GitHub Pages in Settings → Pages → Source: GitHub Actions. The deployment workflow will automatically publish to `https://[your-username].github.io/claudeit/`

### Option 5: Static Hosting
Deploy to any static hosting service:
- Netlify
- Vercel
- Cloudflare Pages
- AWS S3 + CloudFront

## Usage

### Initial Setup
1. Open the application in your browser
2. Enter your Anthropic API key (starts with `sk-ant-`)
3. Click "Save Configuration"

### Testing the API
1. Enter a test prompt in the "Test API Connection" section
2. Click "Send Test Request"
3. View the response and check the audit logs

### Viewing Logs
- All API calls are automatically logged with full details
- View timestamp, model, token usage, costs, and more
- Expand logs to see full prompts and responses

### Exporting Data
- Export logs as JSON for complete data backup
- Export as CSV for spreadsheet analysis
- Use exports for refund claims or billing disputes

## Supported Models

ClaudeIt supports all current Claude models with accurate pricing:

- **Claude 4.5: Opus 4.5** (NEW)
- Claude 4: Opus 4, Sonnet 4
- Claude 3.7: Sonnet 3.7
- Claude 3.5: Sonnet 3.5 (2024-10-22, 2024-06-20), Haiku 3.5
- Claude 3: Opus 3, Sonnet 3, Haiku 3
- Legacy: Claude 2.1, 2.0, Instant 1.2

Pricing is automatically updated based on Anthropic's latest rates.

## Development

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linter
npm run lint
```

### Running Tests
```bash
npm test
```

Tests include:
- Configuration management
- Cost calculations for all models
- Log management and storage
- CSV/JSON export functionality
- HTML escaping and security
- UI updates and rendering

## CI/CD

The project includes GitHub Actions workflows for:
- Automated testing on Node.js 18.x and 20.x
- ESLint code quality checks
- Code coverage reporting
- Build verification

## Refund Documentation

ClaudeIt helps you maintain the documentation needed for legitimate refund claims per Anthropic's ToS. Each log entry includes:

- **Timestamp**: Exact date and time of the request
- **Request Details**: Full prompt and parameters sent
- **Response Details**: Complete response received
- **Token Usage**: Input and output token counts
- **Cost Breakdown**: Detailed cost calculation
- **Performance Metrics**: Request duration and status
- **Stop Reason**: Why the API stopped generating

This information can be used to document:
- Service interruptions
- Unexpected API behavior
- Billing discrepancies
- Quality issues

## Privacy & Security

- API keys are stored locally using Puter.js encrypted KV storage
- No data is sent to any third-party servers (except Anthropic's API)
- All processing happens in your browser
- Logs are stored locally and can be cleared at any time
- Export your data anytime for backup or transfer

## License

GNU General Public License v3.0 - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Disclaimer

ClaudeIt is an independent tool and is not affiliated with, endorsed by, or connected to Anthropic PBC. This tool is provided as-is for monitoring and audit purposes only. Users are responsible for complying with Anthropic's Terms of Service and API usage policies.

## Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

## Changelog

### Version 1.0.0 (2024)
- Initial release
- Full audit logging functionality
- Support for all Claude models
- JSON and CSV export
- Comprehensive test suite
- CI/CD pipeline

## Roadmap

Future enhancements may include:
- Usage trends and analytics
- Budget alerts and warnings
- Multiple API key management
- Team usage tracking
- Advanced filtering and search
- Scheduled exports
- API usage reports
