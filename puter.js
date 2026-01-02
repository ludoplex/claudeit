/**
 * OpusAudit - Claude API Billing Monitor & Evidence Collector
 * A comprehensive Puter.js application for monitoring Claude API usage and billing
 * Version: 1.0.0
 */

// Application State Management
class AppState {
    constructor() {
        this.user = null;
        this.requestLogs = [];
        this.refundableEvents = [];
        this.chatHistory = [];
        this.totalSpent = 0;
        this.disputedValue = 0;
        this.isInitialized = false;
    }

    reset() {
        this.user = null;
        this.requestLogs = [];
        this.refundableEvents = [];
        this.chatHistory = [];
        this.totalSpent = 0;
        this.disputedValue = 0;
    }

    addRequestLog(log) {
        this.requestLogs.unshift(log);
        this.updateMetrics();
    }

    updateMetrics() {
        this.refundableEvents = this.requestLogs.filter(l => l.isRefundable);
        this.totalSpent = this.requestLogs.reduce((sum, l) => sum + (l.cost || 0), 0);
        this.disputedValue = this.refundableEvents.reduce((sum, l) => sum + (l.cost || 0), 0);
    }
}

// Pricing Configuration (per 1K tokens)
const PRICING = {
    'claude-sonnet-4-20250514': { input: 0.003, output: 0.015 },
    'claude-3-5-haiku-20241022': { input: 0.0008, output: 0.004 },
    'claude-3-7-sonnet-20250219': { input: 0.003, output: 0.015 }
};

// Application Configuration
const CONFIG = {
    storageKey: 'opusaudit_logs',
    defaultModel: 'claude-sonnet-4-20250514',
    maxLogsDisplay: 50,
    minDisputeThreshold: 5.00,
    autoSaveInterval: 30000 // 30 seconds
};

// Global app state
const appState = new AppState();

// Utility Functions
const Utils = {
    generateRequestId() {
        return 'req_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
    },

    estimateTokens(text) {
        // Rough estimation: ~4 chars per token
        return Math.ceil(text.length / 4);
    },

    calculateCost(model, inputTokens, outputTokens) {
        const pricing = PRICING[model] || PRICING['claude-sonnet-4-20250514'];
        return ((inputTokens / 1000) * pricing.input) + ((outputTokens / 1000) * pricing.output);
    },

    formatCurrency(amount) {
        return '$' + amount.toFixed(2);
    },

    formatTimestamp(isoString) {
        return new Date(isoString).toLocaleString();
    },

    formatTime(isoString) {
        return new Date(isoString).toLocaleTimeString();
    },

    formatDate(isoString) {
        return new Date(isoString).toLocaleDateString();
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Storage Manager
const StorageManager = {
    async save() {
        try {
            await puter.kv.set(CONFIG.storageKey, JSON.stringify(appState.requestLogs));
            console.log('Data saved successfully');
        } catch (error) {
            console.error('Error saving data:', error);
            throw error;
        }
    },

    async load() {
        try {
            const logs = await puter.kv.get(CONFIG.storageKey);
            if (logs) {
                appState.requestLogs = JSON.parse(logs);
                appState.updateMetrics();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error loading saved data:', error);
            return false;
        }
    },

    async saveToCloud(filename, content, contentType = 'text/plain') {
        try {
            await puter.fs.write(filename, content);
            return true;
        } catch (error) {
            console.error('Error saving to cloud:', error);
            throw error;
        }
    },

    downloadFile(filename, content, contentType = 'text/plain') {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
};

// Authentication Manager
const AuthManager = {
    async signIn() {
        try {
            const user = await puter.auth.signIn();
            appState.user = user;
            return user;
        } catch (error) {
            console.error('Auth error:', error);
            throw new Error('Authentication failed. Please try again.');
        }
    },

    async signOut() {
        try {
            await puter.auth.signOut();
            appState.reset();
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    },

    async checkAuth() {
        try {
            const isSignedIn = await puter.auth.isSignedIn();
            if (isSignedIn) {
                appState.user = await puter.auth.getUser();
                return true;
            }
            return false;
        } catch (error) {
            console.log('Not signed in yet');
            return false;
        }
    }
};

// Claude API Manager
const ClaudeAPIManager = {
    async sendMessage(message, model = CONFIG.defaultModel) {
        const requestLog = {
            id: Utils.generateRequestId(),
            timestamp: new Date().toISOString(),
            model: model,
            inputTokens: Utils.estimateTokens(message),
            status: 'PENDING',
            stopReason: null,
            outputTokens: 0,
            cost: 0,
            latencyMs: 0,
            isRefundable: false,
            refundReason: null,
            error: null
        };

        const startTime = Date.now();

        try {
            const response = await puter.ai.chat(message, {
                model: model,
                stream: true
            });

            let fullResponse = '';
            
            // Handle different response types
            if (typeof response === 'string') {
                fullResponse = response;
            } else if (response && typeof response[Symbol.asyncIterator] === 'function') {
                for await (const chunk of response) {
                    if (chunk?.text) {
                        fullResponse += chunk.text;
                        // Yield chunks for streaming display
                        if (this.onChunk) {
                            this.onChunk(chunk.text);
                        }
                    }
                }
            } else if (response?.message?.content) {
                fullResponse = response.message.content.map(c => c.text || '').join('');
            }

            // Update request log with success
            requestLog.latencyMs = Date.now() - startTime;
            requestLog.status = 200;
            requestLog.stopReason = 'end_turn';
            requestLog.outputTokens = Utils.estimateTokens(fullResponse);
            requestLog.cost = Utils.calculateCost(model, requestLog.inputTokens, requestLog.outputTokens);

            return { success: true, response: fullResponse, log: requestLog };

        } catch (error) {
            console.error('API Error:', error);
            
            requestLog.latencyMs = Date.now() - startTime;
            requestLog.status = error.status || 500;
            requestLog.error = error.message;
            
            // Check if refundable
            if (requestLog.status >= 500) {
                requestLog.isRefundable = true;
                requestLog.refundReason = `Service Availability (${requestLog.status} Error)`;
                requestLog.cost = Utils.calculateCost(model, requestLog.inputTokens, 0);
            }

            return { success: false, error: error.message, log: requestLog };
        }
    }
};

// Refund Analysis Engine
const RefundAnalyzer = {
    analyzeEligibility(logs) {
        const eligibleClaims = [];

        logs.forEach(log => {
            // RULE 1: 5xx Service Failure
            if (log.status >= 500) {
                eligibleClaims.push({
                    id: log.id,
                    reason: "Service Availability (5xx Error)",
                    evidence: `HTTP ${log.status} received at ${log.timestamp}`,
                    policyCite: "Commercial Terms: Service Availability / SLA",
                    cost: log.cost
                });
            }

            // RULE 2: Ghost Stream (200 OK but incomplete)
            if (log.status === 200 && !log.stopReason && log.outputTokens > 0) {
                eligibleClaims.push({
                    id: log.id,
                    reason: "Incomplete Delivery / Stream Interruption",
                    evidence: "Stream terminated by server without 'end_turn' signal.",
                    policyCite: "Billing Policy: Charges apply to successful completion. Delivery was incomplete.",
                    cost: log.cost
                });
            }

            // RULE 3: Zero output with charges
            if (log.outputTokens === 0 && log.cost > 0 && log.status === 200) {
                eligibleClaims.push({
                    id: log.id,
                    reason: "Zero Output Delivery",
                    evidence: "Request completed with 200 OK but no output tokens delivered.",
                    policyCite: "Billing Policy: Charges should reflect actual usage.",
                    cost: log.cost
                });
            }
        });

        return eligibleClaims;
    },

    generateCoverLetter(events, user) {
        const claims = this.analyzeEligibility(events);
        const totalDisputed = claims.reduce((sum, c) => sum + c.cost, 0);
        
        const dateRange = events.length > 0 
            ? `${Utils.formatDate(events[events.length - 1].timestamp)} - ${Utils.formatDate(events[0].timestamp)}`
            : 'N/A';

        const serverInterruptions = claims.filter(c => c.reason.includes('Incomplete')).length;
        const serviceErrors = claims.filter(c => c.reason.includes('5xx')).length;
        const zeroOutputs = claims.filter(c => c.reason.includes('Zero Output')).length;

        return `Subject: Billing Adjustment Request - ${dateRange} - User: ${user?.email || user?.username || 'Unknown'}

To: Anthropic Support

I am writing to request a billing adjustment regarding specific API interactions that failed to meet the Service Availability standards or resulted in incomplete delivery.

Summary of Claim:
- Total Incidents: ${claims.length}
- Total Disputed Value: ${Utils.formatCurrency(totalDisputed)}

Incident Types:
1. Server-Side Interruption: ${serverInterruptions} requests where the API stream was terminated by the host without a \`stop_reason\` or completion signal, rendering the partial output unusable.
2. Service Unavailable: ${serviceErrors} requests returning 5xx errors which may have resulted in erroneous credit deduction.
3. Zero Output Delivery: ${zeroOutputs} requests that completed but delivered no output tokens despite charging.

Please see the attached \`request_ids.csv\` for the specific tracing IDs required for your engineering team to verify these server-side failures.

Regards,
${user?.email || user?.username || 'OpusAudit User'}`;
    },

    generateCSV(events, includeAllFields = false) {
        if (includeAllFields) {
            const header = 'timestamp_utc,request_id,model,http_status,stop_reason,input_tokens,output_tokens,latency_ms,cost_usd,is_refundable,refund_reason\n';
            const rows = events.map(e => 
                `${e.timestamp},${e.id},${e.model},${e.status},${e.stopReason || 'null'},${e.inputTokens},${e.outputTokens},${e.latencyMs},${e.cost.toFixed(4)},${e.isRefundable},${e.refundReason || ''}`
            ).join('\n');
            return header + rows;
        } else {
            const header = 'timestamp_utc,request_id,model,http_status,error_type,estimated_cost\n';
            const rows = events.map(e => 
                `${e.timestamp},${e.id},${e.model},${e.status},${e.refundReason || 'null'},${e.cost.toFixed(4)}`
            ).join('\n');
            return header + rows;
        }
    }
};

// Export functionality
const ExportManager = {
    exportAllLogs() {
        if (appState.requestLogs.length === 0) {
            throw new Error('No logs to export.');
        }

        const csv = RefundAnalyzer.generateCSV(appState.requestLogs, true);
        const filename = `opusaudit_all_logs_${new Date().toISOString().split('T')[0]}.csv`;
        StorageManager.downloadFile(filename, csv, 'text/csv');
    },

    async downloadSupportPacket() {
        const events = appState.refundableEvents;
        if (events.length === 0) {
            throw new Error('No refundable events to export.');
        }

        const csv = RefundAnalyzer.generateCSV(events, false);
        const coverLetter = RefundAnalyzer.generateCoverLetter(events, appState.user);
        
        const dateStr = new Date().toISOString().split('T')[0];
        
        // Download CSV
        StorageManager.downloadFile(
            `opusaudit_request_ids_${dateStr}.csv`,
            csv,
            'text/csv'
        );
        
        // Download cover letter
        StorageManager.downloadFile(
            `opusaudit_cover_letter_${dateStr}.txt`,
            coverLetter,
            'text/plain'
        );
    },

    async savePacketToCloud() {
        const events = appState.refundableEvents;
        if (events.length === 0) {
            throw new Error('No refundable events to save.');
        }

        const csv = RefundAnalyzer.generateCSV(events, false);
        const coverLetter = RefundAnalyzer.generateCoverLetter(events, appState.user);
        
        const dateStr = new Date().toISOString().split('T')[0];
        
        await StorageManager.saveToCloud(`opusaudit_request_ids_${dateStr}.csv`, csv);
        await StorageManager.saveToCloud(`opusaudit_cover_letter_${dateStr}.txt`, coverLetter);
    }
};

// Initialize auto-save
let autoSaveInterval;
function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        if (appState.user && appState.requestLogs.length > 0) {
            StorageManager.save().catch(console.error);
        }
    }, CONFIG.autoSaveInterval);
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
}

// Export for use in HTML
if (typeof window !== 'undefined') {
    window.OpusAudit = {
        appState,
        Utils,
        StorageManager,
        AuthManager,
        ClaudeAPIManager,
        RefundAnalyzer,
        ExportManager,
        CONFIG,
        startAutoSave,
        stopAutoSave
    };
}
