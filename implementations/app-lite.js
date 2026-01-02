/**
 * ClaudeIt Lite - Minimal Claude API Monitor
 * Simplified version for quick logging
 */

let apiKey = null;
let logs = [];
let stats = { calls: 0, tokens: 0, cost: 0 };

// Pricing (per million tokens)
const PRICING = {
    'claude-opus-4-5-20260128': { input: 15.00, output: 75.00 },
    'claude-opus-4-20250514': { input: 15.00, output: 75.00 },
    'claude-sonnet-4-20250514': { input: 3.00, output: 15.00 },
    'claude-3-7-sonnet-20250219': { input: 3.00, output: 15.00 },
    'claude-3-5-sonnet-20241022': { input: 3.00, output: 15.00 },
    'claude-3-opus-20240229': { input: 15.00, output: 75.00 },
    'claude-3-haiku-20240307': { input: 0.25, output: 1.25 }
};

// Initialize
async function init() {
    try {
        await puter.init();
        console.log('✓ Puter initialized');
        
        // Load saved API key
        const saved = await puter.kv.get('lite_api_key');
        if (saved) {
            apiKey = saved;
            document.getElementById('api-key-input').value = saved;
        }
        
        // Load logs
        await loadLogs();
    } catch (err) {
        console.error('Init failed:', err);
    }
}

// Save API key
async function saveKey() {
    const input = document.getElementById('api-key-input').value.trim();
    if (!input.startsWith('sk-ant-')) {
        alert('Invalid API key format');
        return;
    }
    
    apiKey = input;
    await puter.kv.set('lite_api_key', input);
    alert('API key saved!');
}

// Quick test
async function quickTest() {
    if (!apiKey) {
        alert('Please save your API key first');
        return;
    }
    
    const prompt = document.getElementById('quick-prompt').value.trim();
    if (!prompt) {
        alert('Enter a prompt');
        return;
    }
    
    const btn = document.getElementById('test-btn');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    
    try {
        const start = Date.now();
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
                'x-api-key': apiKey
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                messages: [{ role: 'user', content: prompt }]
            })
        });
        
        const data = await response.json();
        const duration = Date.now() - start;
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'API error');
        }
        
        // Calculate cost
        const pricing = PRICING['claude-3-5-sonnet-20241022'];
        const cost = (data.usage.input_tokens / 1_000_000) * pricing.input +
                     (data.usage.output_tokens / 1_000_000) * pricing.output;
        
        // Log it
        const log = {
            timestamp: new Date().toISOString(),
            prompt: prompt.substring(0, 100),
            model: 'claude-3-5-sonnet-20241022',
            tokens: data.usage.input_tokens + data.usage.output_tokens,
            cost: cost,
            duration: duration,
            status: 'success',
            response: data.content[0].text.substring(0, 200)
        };
        
        logs.unshift(log);
        stats.calls++;
        stats.tokens += log.tokens;
        stats.cost += cost;
        
        await saveLogs();
        updateUI();
        
        alert('Success! Check logs below.');
    } catch (err) {
        // Log error
        const log = {
            timestamp: new Date().toISOString(),
            prompt: prompt.substring(0, 100),
            status: 'error',
            error: err.message
        };
        logs.unshift(log);
        await saveLogs();
        updateUI();
        
        alert('Error: ' + err.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Send';
        document.getElementById('quick-prompt').value = '';
    }
}

// Load logs from storage
async function loadLogs() {
    try {
        const saved = await puter.kv.get('lite_logs');
        if (saved) {
            const data = JSON.parse(saved);
            logs = data.logs || [];
            stats = data.stats || stats;
        }
        updateUI();
    } catch (err) {
        console.error('Load logs failed:', err);
    }
}

// Save logs to storage
async function saveLogs() {
    try {
        await puter.kv.set('lite_logs', JSON.stringify({ logs, stats }));
    } catch (err) {
        console.error('Save logs failed:', err);
    }
}

// Update UI
function updateUI() {
    // Update stats
    document.getElementById('call-count').textContent = stats.calls;
    document.getElementById('token-count').textContent = stats.tokens.toLocaleString();
    document.getElementById('cost-display').textContent = '$' + stats.cost.toFixed(4);
    
    // Update logs
    const container = document.getElementById('logs');
    if (logs.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-sm">No activity yet. Configure your API key and send a test request.</p>';
        return;
    }
    
    container.innerHTML = logs.map(log => {
        const time = new Date(log.timestamp).toLocaleTimeString();
        const statusClass = log.status === 'success' ? 'log-success' : 'log-error';
        
        if (log.status === 'success') {
            return `
                <div class="log-entry ${statusClass}">
                    <div class="flex justify-between text-xs text-gray-600 mb-1">
                        <span>${time}</span>
                        <span>${log.tokens} tokens • $${log.cost.toFixed(6)}</span>
                    </div>
                    <div class="text-sm">
                        <strong>Q:</strong> ${escapeHtml(log.prompt)}${log.prompt.length > 100 ? '...' : ''}
                    </div>
                    <div class="text-sm text-gray-600 mt-1">
                        <strong>A:</strong> ${escapeHtml(log.response)}${log.response.length > 200 ? '...' : ''}
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="log-entry ${statusClass}">
                    <div class="text-xs text-gray-600 mb-1">${time}</div>
                    <div class="text-sm text-red-600">
                        <strong>Error:</strong> ${escapeHtml(log.error)}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                        Prompt: ${escapeHtml(log.prompt)}
                    </div>
                </div>
            `;
        }
    }).join('');
}

// Export logs as JSON
function exportJSON() {
    if (logs.length === 0) {
        alert('No logs to export');
        return;
    }
    
    const data = {
        exported: new Date().toISOString(),
        stats: stats,
        logs: logs
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claudeit-lite-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Clear all logs
async function clearAll() {
    if (!confirm('Clear all logs? This cannot be undone.')) {
        return;
    }
    
    logs = [];
    stats = { calls: 0, tokens: 0, cost: 0 };
    await puter.kv.del('lite_logs');
    updateUI();
}

// HTML escape
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Start the app
init();
