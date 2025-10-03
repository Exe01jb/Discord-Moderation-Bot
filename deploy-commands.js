require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'slash-commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        if (!process.env.CLIENT_ID) {
            console.error('❌ خطا: CLIENT_ID تنظیم نشده است. لطفاً CLIENT_ID ربات خود را در Secrets اضافه کنید.');
            process.exit(1);
        }

        console.log(`شروع به ثبت ${commands.length} دستور اسلش...`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`✅ با موفقیت ${data.length} دستور اسلش ثبت شد!`);
    } catch (error) {
        console.error('خطا در ثبت دستورات:', error);
    }
})();
