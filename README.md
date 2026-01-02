# OpusAudit - Claude API Billing Monitor

![CI](https://github.com/ludoplex/claudeit/workflows/CI/badge.svg)

OpusAudit is a comprehensive audit logging and billing monitor for the Anthropic Claude API. It helps you track API usage, costs, and maintain detailed logs that can be used for refund claims per Anthropic's Terms of Service.

## Two Implementations Available

OpusAudit comes in two distinct implementations to suit different needs:

### 🔧 Full Implementation (index.html + app.js)
- Complete audit logging with detailed metadata
- Comprehensive dashboard and statistics
- Full export capabilities (JSON and CSV)
- Support for all Claude models
- 23 unit tests, CI/CD ready
- **Best for:** Professional use, compliance, complete audit trails

### ⚡ Lite Implementation (implementations/index-lite.html + app-lite.js)
- Minimal, fast interface
- Quick API testing
- Simple logging and JSON export
- Single model support
- **Best for:** Quick testing, personal use, learning

📦 **Download Ready-to-Use Packages:**
- [`implementations/opusaudit-full.zip`](implementations/opusaudit-full.zip) - Complete implementation
- [`implementations/opusaudit-lite.zip`](implementations/opusaudit-lite.zip) - Lightweight version

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

## Installation

### Option 1: Direct Use
1. Clone this repository
2. Open `index.html` in a modern web browser
3. Enter your Anthropic API key
4. Start monitoring!

### Option 2: Deploy to Puter.com
1. Visit [puter.com](https://puter.com)
2. Upload the `index.html` and `app.js` files
3. Open the application

### Option 3: Static Hosting
Deploy to any static hosting service like:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

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

OpusAudit supports all current Claude models with accurate pricing:

- Claude 3.5 Sonnet (20241022 & 20240620)
- Claude 3 Opus (20240229)
- Claude 3 Sonnet (20240229)
- Claude 3 Haiku (20240307)

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

OpusAudit helps you maintain the documentation needed for legitimate refund claims per Anthropic's ToS. Each log entry includes:

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

OpusAudit is an independent tool and is not affiliated with, endorsed by, or connected to Anthropic PBC. This tool is provided as-is for monitoring and audit purposes only. Users are responsible for complying with Anthropic's Terms of Service and API usage policies.

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
