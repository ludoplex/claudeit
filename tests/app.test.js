/**
 * @jest-environment jsdom
 */

const { describe, it, expect, beforeEach } = require('@jest/globals');
const ClaudeIt = require('../app.js');

describe('ClaudeIt', () => {
  let app;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <input id="api-key" />
      <button id="save-config-btn"></button>
      <button id="clear-config-btn"></button>
      <button id="test-api-btn"></button>
      <button id="export-json-btn"></button>
      <button id="export-csv-btn"></button>
      <button id="clear-logs-btn"></button>
      <textarea id="test-prompt"></textarea>
      <div id="dashboard"></div>
      <div id="test-section"></div>
      <div id="logs-section"></div>
      <div id="test-result"></div>
      <div id="test-response"></div>
      <div id="total-calls"></div>
      <div id="total-tokens"></div>
      <div id="total-cost"></div>
      <div id="logs-container"></div>
    `;

    app = new ClaudeIt();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(app.apiKey).toBeNull();
      expect(app.logs).toEqual([]);
      expect(app.stats).toEqual({
        totalCalls: 0,
        totalTokens: 0,
        totalCost: 0
      });
      expect(app.initialized).toBe(false);
    });

    it('should initialize puter on init', async () => {
      await app.init();
      expect(puter.init).toHaveBeenCalled();
      expect(app.initialized).toBe(true);
    });
  });

  describe('Configuration Management', () => {
    it('should save valid API key', async () => {
      const apiKey = 'sk-ant-test123456';
      document.getElementById('api-key').value = apiKey;
      
      global.alert = jest.fn();
      await app.saveConfig();
      
      expect(puter.kv.set).toHaveBeenCalledWith('anthropic_api_key', apiKey);
      expect(app.apiKey).toBe(apiKey);
      expect(global.alert).toHaveBeenCalledWith('API key saved successfully!');
    });

    it('should reject invalid API key format', async () => {
      document.getElementById('api-key').value = 'invalid-key';
      
      global.alert = jest.fn();
      await app.saveConfig();
      
      expect(puter.kv.set).not.toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith(
        'Invalid API key format. Anthropic API keys start with "sk-ant-"'
      );
    });

    it('should reject empty API key', async () => {
      document.getElementById('api-key').value = '';
      
      global.alert = jest.fn();
      await app.saveConfig();
      
      expect(puter.kv.set).not.toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('Please enter an API key');
    });

    it('should clear API key', async () => {
      app.apiKey = 'sk-ant-test123456';
      global.confirm = jest.fn(() => true);
      global.alert = jest.fn();
      
      await app.clearConfig();
      
      expect(puter.kv.del).toHaveBeenCalledWith('anthropic_api_key');
      expect(app.apiKey).toBeNull();
      expect(global.alert).toHaveBeenCalledWith('API key cleared successfully!');
    });

    it('should not clear API key when user cancels', async () => {
      app.apiKey = 'sk-ant-test123456';
      global.confirm = jest.fn(() => false);
      
      await app.clearConfig();
      
      expect(puter.kv.del).not.toHaveBeenCalled();
      expect(app.apiKey).toBe('sk-ant-test123456');
    });

    it('should load saved API key', async () => {
      const savedKey = 'sk-ant-saved123';
      puter.kv.get.mockResolvedValue(savedKey);
      
      await app.loadConfig();
      
      expect(app.apiKey).toBe(savedKey);
    });
  });

  describe('Cost Calculation', () => {
    it('should calculate cost for Claude 3.5 Sonnet correctly', () => {
      const usage = {
        input_tokens: 1000,
        output_tokens: 500
      };
      
      const cost = app.calculateCost('claude-3-5-sonnet-20241022', usage);
      
      // Input: (1000 / 1,000,000) * 3.00 = 0.003
      // Output: (500 / 1,000,000) * 15.00 = 0.0075
      // Total: 0.0105
      expect(cost.input).toBeCloseTo(0.003, 6);
      expect(cost.output).toBeCloseTo(0.0075, 6);
      expect(cost.total).toBeCloseTo(0.0105, 6);
    });

    it('should calculate cost for Claude 3 Opus correctly', () => {
      const usage = {
        input_tokens: 1000,
        output_tokens: 500
      };
      
      const cost = app.calculateCost('claude-3-opus-20240229', usage);
      
      // Input: (1000 / 1,000,000) * 15.00 = 0.015
      // Output: (500 / 1,000,000) * 75.00 = 0.0375
      // Total: 0.0525
      expect(cost.input).toBeCloseTo(0.015, 6);
      expect(cost.output).toBeCloseTo(0.0375, 6);
      expect(cost.total).toBeCloseTo(0.0525, 6);
    });

    it('should calculate cost for Claude 3 Haiku correctly', () => {
      const usage = {
        input_tokens: 1000,
        output_tokens: 500
      };
      
      const cost = app.calculateCost('claude-3-haiku-20240307', usage);
      
      // Input: (1000 / 1,000,000) * 0.25 = 0.00025
      // Output: (500 / 1,000,000) * 1.25 = 0.000625
      // Total: 0.000875
      expect(cost.input).toBeCloseTo(0.00025, 6);
      expect(cost.output).toBeCloseTo(0.000625, 6);
      expect(cost.total).toBeCloseTo(0.000875, 6);
    });

    it('should use default pricing for unknown model', () => {
      const usage = {
        input_tokens: 1000,
        output_tokens: 500
      };
      
      const cost = app.calculateCost('unknown-model', usage);
      
      // Should use Claude 3.5 Sonnet pricing as default
      expect(cost.total).toBeCloseTo(0.0105, 6);
    });
  });

  describe('Log Management', () => {
    it('should add successful log entry and update stats', async () => {
      const logEntry = {
        id: 'test-123',
        timestamp: new Date().toISOString(),
        status: 'success',
        model: 'claude-3-5-sonnet-20241022',
        request: {
          prompt: 'Test prompt'
        },
        response: {
          content: [{ text: 'Test response' }]
        },
        usage: {
          input_tokens: 100,
          output_tokens: 50,
          total_tokens: 150
        },
        cost: {
          input: 0.0003,
          output: 0.00075,
          total: 0.00105
        },
        stop_reason: 'end_turn',
        duration_ms: 1000
      };

      await app.addLog(logEntry);

      expect(app.logs).toHaveLength(1);
      expect(app.logs[0]).toEqual(logEntry);
      expect(app.stats.totalCalls).toBe(1);
      expect(app.stats.totalTokens).toBe(150);
      expect(app.stats.totalCost).toBeCloseTo(0.00105, 6);
    });

    it('should add error log entry without updating success stats', async () => {
      const logEntry = {
        id: 'test-error',
        timestamp: new Date().toISOString(),
        status: 'error',
        error: 'API Error'
      };

      await app.addLog(logEntry);

      expect(app.logs).toHaveLength(1);
      expect(app.stats.totalCalls).toBe(0);
      expect(app.stats.totalTokens).toBe(0);
      expect(app.stats.totalCost).toBe(0);
    });

    it('should save and load logs correctly', async () => {
      const testLogs = {
        logs: [
          {
            id: 'test-1',
            status: 'success',
            usage: { total_tokens: 100 },
            cost: { total: 0.001 }
          }
        ],
        stats: {
          totalCalls: 1,
          totalTokens: 100,
          totalCost: 0.001
        },
        lastUpdated: new Date().toISOString()
      };

      puter.kv.get.mockResolvedValue(JSON.stringify(testLogs));
      
      await app.loadLogs();

      expect(app.logs).toEqual(testLogs.logs);
      expect(app.stats).toEqual(testLogs.stats);
    });

    it('should clear logs and reset stats', async () => {
      app.logs = [{ id: 'test' }];
      app.stats = { totalCalls: 5, totalTokens: 1000, totalCost: 0.1 };
      
      global.confirm = jest.fn(() => true);
      global.alert = jest.fn();

      await app.clearLogs();

      expect(app.logs).toEqual([]);
      expect(app.stats).toEqual({
        totalCalls: 0,
        totalTokens: 0,
        totalCost: 0
      });
      expect(puter.kv.del).toHaveBeenCalledWith('audit_logs');
    });

    it('should not clear logs when user cancels', async () => {
      app.logs = [{ id: 'test' }];
      global.confirm = jest.fn(() => false);

      await app.clearLogs();

      expect(app.logs).toHaveLength(1);
      expect(puter.kv.del).not.toHaveBeenCalled();
    });
  });

  describe('CSV Export', () => {
    it('should convert logs to CSV format correctly', () => {
      app.logs = [
        {
          timestamp: '2024-01-01T12:00:00Z',
          id: 'log-1',
          status: 'success',
          model: 'claude-3-5-sonnet-20241022',
          usage: {
            input_tokens: 100,
            output_tokens: 50,
            total_tokens: 150
          },
          cost: {
            input: 0.0003,
            output: 0.00075,
            total: 0.00105
          },
          duration_ms: 1500,
          stop_reason: 'end_turn'
        },
        {
          timestamp: '2024-01-01T12:01:00Z',
          id: 'log-2',
          status: 'error',
          model: 'claude-3-5-sonnet-20241022',
          duration_ms: 500,
          error: 'Rate limit exceeded'
        }
      ];

      const csv = app.logsToCSV();
      const lines = csv.split('\n');

      expect(lines[0]).toContain('Timestamp');
      expect(lines[0]).toContain('ID');
      expect(lines[0]).toContain('Status');
      expect(lines[1]).toContain('2024-01-01T12:00:00Z');
      expect(lines[1]).toContain('log-1');
      expect(lines[1]).toContain('success');
      expect(lines[2]).toContain('2024-01-01T12:01:00Z');
      expect(lines[2]).toContain('log-2');
      expect(lines[2]).toContain('error');
      expect(lines[2]).toContain('Rate limit exceeded');
    });
  });

  describe('HTML Escaping', () => {
    it('should escape HTML special characters', () => {
      const dangerous = '<script>alert("xss")</script>';
      const escaped = app.escapeHtml(dangerous);
      
      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;script&gt;');
    });

    it('should handle empty string', () => {
      expect(app.escapeHtml('')).toBe('');
    });
  });

  describe('UI Updates', () => {
    it('should update stats in UI', () => {
      app.stats = {
        totalCalls: 5,
        totalTokens: 1500,
        totalCost: 0.045
      };
      app.logs = [];

      app.updateUI();

      const totalCalls = document.getElementById('total-calls');
      const totalTokens = document.getElementById('total-tokens');
      const totalCost = document.getElementById('total-cost');

      expect(totalCalls.textContent).toBe(5);
      expect(totalTokens.textContent).toBe('1,500');
      expect(totalCost.textContent).toBe('$0.0450');
    });

    it('should show empty state when no logs', () => {
      app.logs = [];
      app.updateUI();

      const logsContainer = document.getElementById('logs-container');
      expect(logsContainer.innerHTML).toContain('No logs yet');
    });

    it('should render log entries when logs exist', () => {
      app.logs = [
        {
          id: 'test-1',
          timestamp: '2024-01-01T12:00:00Z',
          status: 'success',
          model: 'claude-3-5-sonnet-20241022',
          usage: {
            input_tokens: 100,
            output_tokens: 50,
            total_tokens: 150
          },
          cost: {
            input: 0.0003,
            output: 0.00075,
            total: 0.00105
          },
          duration_ms: 1500,
          stop_reason: 'end_turn',
          request: { prompt: 'Hello' },
          response: { content: [{ text: 'Hi there!' }] }
        }
      ];

      app.updateUI();

      const logsContainer = document.getElementById('logs-container');
      expect(logsContainer.innerHTML).toContain('test-1');
      expect(logsContainer.innerHTML).toContain('SUCCESS');
    });
  });
});
