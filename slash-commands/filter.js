const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { readData, writeData } = require('../utils/dataManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filter')
        .setDescription('مدیریت فیلتر کلمات')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('اضافه کردن کلمه به فیلتر')
                .addStringOption(option =>
                    option.setName('word')
                        .setDescription('کلمه مورد نظر')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('حذف کلمه از فیلتر')
                .addStringOption(option =>
                    option.setName('word')
                        .setDescription('کلمه مورد نظر')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('نمایش لیست کلمات فیلتر شده'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'add') {
            const word = interaction.options.getString('word').toLowerCase();
            const filters = readData('filters.json');
            
            if (!filters.words.includes(word)) {
                filters.words.push(word);
                writeData('filters.json', filters);
                await interaction.reply({ content: `✅ کلمه "${word}" به فیلتر اضافه شد.`, ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ این کلمه قبلاً در فیلتر وجود دارد.', ephemeral: true });
            }
        } else if (subcommand === 'remove') {
            const word = interaction.options.getString('word').toLowerCase();
            const filters = readData('filters.json');
            const index = filters.words.indexOf(word);
            
            if (index > -1) {
                filters.words.splice(index, 1);
                writeData('filters.json', filters);
                await interaction.reply({ content: `✅ کلمه "${word}" از فیلتر حذف شد.`, ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ این کلمه در فیلتر وجود ندارد.', ephemeral: true });
            }
        } else if (subcommand === 'list') {
            const filters = readData('filters.json');
            
            if (filters.words.length === 0) {
                return interaction.reply({ content: '📋 فیلتر خالی است.', ephemeral: true });
            }

            const list = filters.words.map((word, i) => `${i + 1}. ${word}`).join('\n');
            await interaction.reply({ content: `📋 **کلمات فیلتر شده:**\n${list}`, ephemeral: true });
        }
    },
};
