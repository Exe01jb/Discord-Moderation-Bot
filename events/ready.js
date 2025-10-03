const { ActivityType } = require('discord.js');

module.exports = {
    name: 'clientReady',
    once: true,
    execute(client) {
        console.log(`✅ ربات با موفقیت به عنوان ${client.user.tag} وارد شد!`);
        console.log(`🔧 سرورها: ${client.guilds.cache.size}`);
        console.log(`👥 کاربران: ${client.users.cache.size}`);
        
        client.user.setActivity('سام لند | /help', { type: ActivityType.Watching });
    }
};
