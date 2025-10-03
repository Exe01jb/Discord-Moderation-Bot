const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function ensureDataFiles() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const files = {
        'settings.json': {
            verifyRole: null,
            verifyChannel: null,
            verifyTitle: '✅ تایید هویت',
            verifyDescription: 'برای دریافت دسترسی به سرور، لطفاً روی دکمه زیر کلیک کنید.',
            verifyBanner: null,
            logChannel: null
        },
        'counters.json': {},
        'logs.json': [],
        'filters.json': {
            words: [],
            violations: {}
        }
    };

    for (const [filename, defaultData] of Object.entries(files)) {
        const filePath = path.join(DATA_DIR, filename);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
        }
    }
}

function readData(filename) {
    const filePath = path.join(DATA_DIR, filename);
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return null;
    }
}

function writeData(filename, data) {
    const filePath = path.join(DATA_DIR, filename);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        return false;
    }
}

function getCounters() {
    return readData('counters.json') || {};
}

function updateCounter(userId, type, increment = 1) {
    const counters = getCounters();
    if (!counters[userId]) {
        counters[userId] = { bans: 0, kicks: 0, warns: 0, timeouts: 0 };
    }
    counters[userId][type] = (counters[userId][type] || 0) + increment;
    writeData('counters.json', counters);
    return counters[userId][type];
}

function getCounter(userId, type) {
    const counters = getCounters();
    return counters[userId]?.[type] || 0;
}

function addLog(action, user, moderator, reason = '', duration = '') {
    const logs = readData('logs.json') || [];
    logs.push({
        action,
        user: { id: user.id, tag: user.tag },
        moderator: { id: moderator.id, tag: moderator.tag },
        reason,
        duration,
        timestamp: new Date().toISOString()
    });
    writeData('logs.json', logs);
}

function getLogs(limit = 10) {
    const logs = readData('logs.json') || [];
    return logs.slice(-limit).reverse();
}

module.exports = {
    ensureDataFiles,
    readData,
    writeData,
    getCounters,
    updateCounter,
    getCounter,
    addLog,
    getLogs
};
