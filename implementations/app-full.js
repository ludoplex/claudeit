/**
 * ClaudeIt - Claude API Billing Monitor
 * Audit logging for Anthropic API usage per ToS refund requirements
 */

class ClaudeIt {
    constructor() {
        this.apiKey = null;
        this.logs = [];
        this.stats = {
            totalCalls: 0,
            totalTokens: 0,
            totalCost: 0
        };
        this.initialized = false;
    }

    async init() {
        try {
            // Initialize Puter
            await puter.init();
            console.log('Puter initialized');
            
            // Load saved configuration
            await this.loadConfig();
            
            // Load saved logs
            await this.loadLogs();
            
            // Setup UI event listeners
            this.setupEventListeners();
            
            // Update UI
            this.updateUI();
            
            this.initialized = true;
            console.log('ClaudeIt initialized successfully');
        } catch (error) {
            console.error('Failed to initialize ClaudeIt:', error);
            alert('Failed to initialize application. Please refresh the page.');
        }
    }

    setupEventListeners() {
        // Configuration buttons
        document.getElementById('save-config-btn').addEventListener('click', () => this.saveConfig());
        document.getElementById('clear-config-btn').addEventListener('click', () => this.clearConfig());
        
        // Test API button
        document.getElementById('test-api-btn').addEventListener('click', () => this.testAPI());
        
        // Export buttons
        document.getElementById('export-json-btn').addEventListener('click', () => this.exportLogs('json'));
        document.getElementById('export-csv-btn').addEventListener('click', () => this.exportLogs('csv'));
        
        // Clear logs button
        document.getElementById('clear-logs-btn').addEventListener('click', () => this.clearLogs());
    }

    async loadConfig() {
        try {
            const savedKey = await puter.kv.get('anthropic_api_key');
            if (savedKey) {
                this.apiKey = savedKey;
                document.getElementById('api-key').value = savedKey;
                this.showSections();
            }
        } catch (error) {
            console.error('Failed to load config:', error);
        }
    }

    async saveConfig() {
        const apiKey = document.getElementById('api-key').value.trim();
        
        if (!apiKey) {
            alert('Please enter an API key');
            return;
        }
        
        if (!apiKey.startsWith('sk-ant-')) {
            alert('Invalid API key format. Anthropic API keys start with "sk-ant-"');
            return;
        }
        
        try {
            await puter.kv.set('anthropic_api_key', apiKey);
            this.apiKey = apiKey;
            alert('API key saved successfully!');
            this.showSections();
        } catch (error) {
            console.error('Failed to save config:', error);
            alert('Failed to save API key. Please try again.');
        }
    }

    async clearConfig() {
        if (!confirm('Are you sure you want to clear the API key?')) {
            return;
        }
        
        try {
            await puter.kv.del('anthropic_api_key');
            this.apiKey = null;
            document.getElementById('api-key').value = '';
            this.hideSections();
            alert('API key cleared successfully!');
        } catch (error) {
            console.error('Failed to clear config:', error);
            alert('Failed to clear API key. Please try again.');
        }
    }

    showSections() {
        document.getElementById('dashboard').classList.remove('hidden');
        document.getElementById('test-section').classList.remove('hidden');
        document.getElementById('logs-section').classList.remove('hidden');
    }

    hideSections() {
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('test-section').classList.add('hidden');
        document.getElementById('logs-section').classList.add('hidden');
    }

    async testAPI() {
        if (!this.apiKey) {
            alert('Please configure your API key first');
            return;
        }

        const prompt = document.getElementById('test-prompt').value.trim();
        if (!prompt) {
            alert('Please enter a test prompt');
            return;
        }

        const btn = document.getElementById('test-api-btn');
        btn.disabled = true;
        btn.textContent = 'Sending...';

        try {
            const logEntry = await this.makeAPICall(prompt);
            
            // Display response
            document.getElementById('test-result').classList.remove('hidden');
            document.getElementById('test-response').textContent = logEntry.response.content[0].text;
            
            alert('Test request successful! Check the audit logs for details.');
        } catch (error) {
            console.error('API test failed:', error);
            alert('API test failed: ' + error.message);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Send Test Request';
        }
    }

    async makeAPICall(prompt, model = 'claude-3-5-sonnet-20241022') {
        const startTime = new Date();
        
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01',
                    'x-api-key': this.apiKey
                },
                body: JSON.stringify({
                    model: model,
                    max_tokens: 1024,
                    messages: [{
                        role: 'user',
                        content: prompt
                    }]
                })
            });

            const endTime = new Date();
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'API request failed');
            }

            // Create audit log entry
            const logEntry = {
                id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                timestamp: startTime.toISOString(),
                model: model,
                request: {
                    prompt: prompt,
                    max_tokens: 1024
                },
                response: data,
                usage: {
                    input_tokens: data.usage.input_tokens,
                    output_tokens: data.usage.output_tokens,
                    total_tokens: data.usage.input_tokens + data.usage.output_tokens
                },
                cost: this.calculateCost(model, data.usage),
                duration_ms: endTime - startTime,
                status: 'success',
                stop_reason: data.stop_reason
            };

            // Save log entry
            await this.addLog(logEntry);

            return logEntry;
        } catch (error) {
            // Log failed requests too
            const endTime = new Date();
            const logEntry = {
                id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                timestamp: startTime.toISOString(),
                model: model,
                request: {
                    prompt: prompt,
                    max_tokens: 1024
                },
                error: error.message,
                duration_ms: endTime - startTime,
                status: 'error'
            };

            await this.addLog(logEntry);
            throw error;
        }
    }

    calculateCost(model, usage) {
        // Pricing as of 2024 (per million tokens)
        const pricing = {
            'claude-3-5-sonnet-20241022': { input: 3.00, output: 15.00 },
            'claude-3-5-sonnet-20240620': { input: 3.00, output: 15.00 },
            'claude-3-opus-20240229': { input: 15.00, output: 75.00 },
            'claude-3-sonnet-20240229': { input: 3.00, output: 15.00 },
            'claude-3-haiku-20240307': { input: 0.25, output: 1.25 }
        };

        const modelPricing = pricing[model] || pricing['claude-3-5-sonnet-20241022'];
        const inputCost = (usage.input_tokens / 1_000_000) * modelPricing.input;
        const outputCost = (usage.output_tokens / 1_000_000) * modelPricing.output;

        return {
            input: inputCost,
            output: outputCost,
            total: inputCost + outputCost
        };
    }

    async addLog(logEntry) {
        this.logs.unshift(logEntry); // Add to beginning
        
        // Update stats
        if (logEntry.status === 'success') {
            this.stats.totalCalls++;
            this.stats.totalTokens += logEntry.usage.total_tokens;
            this.stats.totalCost += logEntry.cost.total;
        }

        // Save logs
        await this.saveLogs();
        
        // Update UI
        this.updateUI();
    }

    async loadLogs() {
        try {
            const savedLogs = await puter.kv.get('audit_logs');
            if (savedLogs) {
                const parsed = JSON.parse(savedLogs);
                this.logs = parsed.logs || [];
                this.stats = parsed.stats || this.stats;
            }
        } catch (error) {
            console.error('Failed to load logs:', error);
        }
    }

    async saveLogs() {
        try {
            const data = {
                logs: this.logs,
                stats: this.stats,
                lastUpdated: new Date().toISOString()
            };
            await puter.kv.set('audit_logs', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save logs:', error);
        }
    }

    async clearLogs() {
        if (!confirm('Are you sure you want to clear all audit logs? This cannot be undone.')) {
            return;
        }

        try {
            this.logs = [];
            this.stats = {
                totalCalls: 0,
                totalTokens: 0,
                totalCost: 0
            };
            await puter.kv.del('audit_logs');
            this.updateUI();
            alert('Logs cleared successfully!');
        } catch (error) {
            console.error('Failed to clear logs:', error);
            alert('Failed to clear logs. Please try again.');
        }
    }

    updateUI() {
        // Update stats
        document.getElementById('total-calls').textContent = this.stats.totalCalls;
        document.getElementById('total-tokens').textContent = this.stats.totalTokens.toLocaleString();
        document.getElementById('total-cost').textContent = '$' + this.stats.totalCost.toFixed(4);

        // Update logs display
        const logsContainer = document.getElementById('logs-container');
        
        if (this.logs.length === 0) {
            logsContainer.innerHTML = '<p class="text-gray-500 text-sm">No logs yet. Make some API calls to see them here.</p>';
            return;
        }

        logsContainer.innerHTML = this.logs.map(log => this.renderLogEntry(log)).join('');
    }

    renderLogEntry(log) {
        const statusColor = log.status === 'success' ? 'green' : 'red';
        const timestamp = new Date(log.timestamp).toLocaleString();
        
        let details = '';
        if (log.status === 'success') {
            details = `
                <div class="text-xs text-gray-600 mt-2 space-y-1">
                    <p><strong>Model:</strong> ${log.model}</p>
                    <p><strong>Tokens:</strong> ${log.usage.input_tokens} in / ${log.usage.output_tokens} out / ${log.usage.total_tokens} total</p>
                    <p><strong>Cost:</strong> $${log.cost.total.toFixed(6)} (Input: $${log.cost.input.toFixed(6)}, Output: $${log.cost.output.toFixed(6)})</p>
                    <p><strong>Duration:</strong> ${log.duration_ms}ms</p>
                    <p><strong>Stop Reason:</strong> ${log.stop_reason}</p>
                    <details class="mt-2">
                        <summary class="cursor-pointer text-blue-600 hover:text-blue-800">Show prompt & response</summary>
                        <div class="mt-2 p-2 bg-gray-50 rounded">
                            <p class="font-semibold">Prompt:</p>
                            <p class="whitespace-pre-wrap">${this.escapeHtml(log.request.prompt)}</p>
                            <p class="font-semibold mt-2">Response:</p>
                            <p class="whitespace-pre-wrap">${this.escapeHtml(log.response.content[0].text)}</p>
                        </div>
                    </details>
                </div>
            `;
        } else {
            details = `
                <div class="text-xs text-red-600 mt-2">
                    <p><strong>Error:</strong> ${this.escapeHtml(log.error)}</p>
                    <p><strong>Duration:</strong> ${log.duration_ms}ms</p>
                </div>
            `;
        }

        return `
            <div class="border border-gray-200 rounded p-3 bg-gray-50">
                <div class="flex justify-between items-start">
                    <div>
                        <span class="inline-block px-2 py-1 text-xs font-semibold rounded bg-${statusColor}-100 text-${statusColor}-800">
                            ${log.status.toUpperCase()}
                        </span>
                        <span class="ml-2 text-sm text-gray-600">${timestamp}</span>
                    </div>
                    <span class="text-xs text-gray-500">ID: ${log.id}</span>
                </div>
                ${details}
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async exportLogs(format) {
        if (this.logs.length === 0) {
            alert('No logs to export');
            return;
        }

        try {
            let content, filename, mimeType;

            if (format === 'json') {
                content = JSON.stringify({
                    exported_at: new Date().toISOString(),
                    stats: this.stats,
                    logs: this.logs
                }, null, 2);
                filename = `claudeit-logs-${Date.now()}.json`;
                mimeType = 'application/json';
            } else if (format === 'csv') {
                content = this.logsToCSV();
                filename = `claudeit-logs-${Date.now()}.csv`;
                mimeType = 'text/csv';
            }

            // Create download
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            alert(`Logs exported successfully as ${filename}`);
        } catch (error) {
            console.error('Failed to export logs:', error);
            alert('Failed to export logs. Please try again.');
        }
    }

    logsToCSV() {
        const headers = [
            'Timestamp',
            'ID',
            'Status',
            'Model',
            'Input Tokens',
            'Output Tokens',
            'Total Tokens',
            'Input Cost',
            'Output Cost',
            'Total Cost',
            'Duration (ms)',
            'Stop Reason',
            'Error'
        ];

        const rows = this.logs.map(log => {
            if (log.status === 'success') {
                return [
                    log.timestamp,
                    log.id,
                    log.status,
                    log.model,
                    log.usage.input_tokens,
                    log.usage.output_tokens,
                    log.usage.total_tokens,
                    log.cost.input.toFixed(6),
                    log.cost.output.toFixed(6),
                    log.cost.total.toFixed(6),
                    log.duration_ms,
                    log.stop_reason,
                    ''
                ];
            } else {
                return [
                    log.timestamp,
                    log.id,
                    log.status,
                    log.model || '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    log.duration_ms,
                    '',
                    log.error
                ];
            }
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        return csvContent;
    }
}

// Export for testing (if in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClaudeIt;
}

// Initialize the application (browser only)
if (typeof window !== 'undefined') {
    const app = new ClaudeIt();
    app.init();
}
