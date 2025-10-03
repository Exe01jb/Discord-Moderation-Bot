const { readData, writeData } = require('../utils/dataManager');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        const filters = readData('filters.json');
        
        if (filters && filters.violations && filters.violations[member.user.id]) {
            delete filters.violations[member.user.id];
            writeData('filters.json', filters);
            console.log(`Reset filter violations for ${member.user.tag} after leaving guild`);
        }
    }
};
