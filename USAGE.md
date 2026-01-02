# ClaudeIt Usage Guide

## Quick Start

1. **Open the Application**
   - Open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari)
   - The application will load with Puter.js and Tailwind CSS from CDN

2. **Configure API Key**
   - Enter your Anthropic API key in the configuration section
   - API keys start with `sk-ant-`
   - Click "Save Configuration" to store it securely
   - Your API key is stored locally using Puter.js KV storage and never leaves your device

3. **Test the Connection**
   - Once configured, the dashboard, test section, and logs section will appear
   - Enter a test prompt in the "Test API Connection" section
   - Click "Send Test Request" to make your first API call
   - The response will appear below and be logged in the audit logs

4. **View Audit Logs**
   - All API calls are automatically logged with complete details:
     - Timestamp
     - Model used
     - Token usage (input/output)
     - Cost breakdown
     - Request duration
     - Full prompt and response (expandable)
   - Logs appear in reverse chronological order (newest first)

5. **Export Data**
   - **JSON Export**: Complete data backup with all log details
   - **CSV Export**: Spreadsheet-friendly format for analysis
   - Use exports for record-keeping or refund documentation

## Dashboard Metrics

The dashboard shows three key metrics:

- **Total API Calls**: Count of all successful API requests
- **Total Tokens Used**: Sum of input and output tokens across all calls
- **Estimated Cost**: Total cost based on current Anthropic pricing

## Supported Use Cases

### Billing Monitoring
Track your API usage in real-time to avoid unexpected charges. The application calculates costs based on the latest Anthropic pricing for each model.

### Refund Documentation
According to Anthropic's Terms of Service, you may be eligible for refunds in certain situations. OpusAudit maintains comprehensive logs that document:
- Service availability issues
- Response quality problems
- Billing discrepancies
- Unexpected API behavior

Each log entry includes all information needed to support a legitimate refund claim.

### Usage Analysis
Export your logs to analyze:
- Cost trends over time
- Token usage patterns
- Model performance
- Response times

## Privacy & Security

- **Local Storage**: All data is stored in your browser using Puter.js
- **No Cloud**: Your API key and logs never leave your device
- **No Tracking**: No analytics or tracking scripts
- **Open Source**: Full source code available for review

## Model Pricing (as of 2024)

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| Claude 3.5 Sonnet | $3.00 | $15.00 |
| Claude 3 Opus | $15.00 | $75.00 |
| Claude 3 Sonnet | $3.00 | $15.00 |
| Claude 3 Haiku | $0.25 | $1.25 |

Pricing is automatically applied based on the model used for each request.

## Troubleshooting

### API Key Not Saving
- Make sure your API key starts with `sk-ant-`
- Check browser console for errors
- Try clearing browser cache and reloading

### Test Request Failed
- Verify your API key is correct
- Check internet connection
- Ensure Anthropic API is accessible
- Review error message in the alert

### Logs Not Appearing
- Check browser console for JavaScript errors
- Verify Puter.js is loaded (check browser console)
- Try clearing logs and making a new request

### Export Not Working
- Check browser pop-up blocker settings
- Verify you have logs to export
- Try a different browser

## Tips for Best Results

1. **Regular Exports**: Export your logs regularly to avoid data loss
2. **Clear Old Logs**: Clear logs periodically to keep the UI responsive
3. **Monitor Costs**: Check your dashboard frequently to stay within budget
4. **Document Issues**: If you experience API problems, check the logs immediately while the details are fresh
5. **Backup Key**: Store your API key securely outside the browser

## Support

For issues or questions:
- Check existing GitHub issues
- Review the main README.md
- Open a new issue with details
