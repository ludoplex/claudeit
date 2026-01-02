// Mock Puter.js
global.puter = {
    init: jest.fn().mockResolvedValue(true),
    kv: {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn()
    }
};

// Mock fetch
global.fetch = jest.fn();

// Mock DOM methods
const elementValues = {};
document.getElementById = jest.fn((id) => {
    if (!elementValues[id]) {
        elementValues[id] = {
            value: '',
            textContent: '',
            innerHTML: '',
            classList: {
                add: jest.fn(),
                remove: jest.fn()
            },
            addEventListener: jest.fn(),
            disabled: false
        };
    }
    return elementValues[id];
});

// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(elementValues).forEach(key => {
        elementValues[key].value = '';
        elementValues[key].textContent = '';
        elementValues[key].innerHTML = '';
    });
});
