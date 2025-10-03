const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createDMEmbed, createLogEmbed } = require('../utils/embedBuilder');
const { parseDuration, formatDuration, sendDM } = require('../utils/permissions');
const { addLog } = require('../utils/dataManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('میوت کردن کاربر')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('کاربر مورد نظر')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('دلیل میوت')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('مدت زمان (مثال: 10m, 1h, 1d)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'دلیلی مشخص نشده';
        const duration = interaction.options.getString('duration') || '10m';

        try {
            const member = interaction.guild.members.cache.get(user.id);
            const durationMs = parseDuration(duration) || 600000;

            await member.timeout(durationMs, reason);

            const embed = createDMEmbed('mute', user, reason);
            await sendDM(user, embed);

            addLog('Mute', user, interaction.user, reason, formatDuration(durationMs));

            const logEmbed = createLogEmbed('Mute', user, interaction.user, reason, formatDuration(durationMs));
            await interaction.reply({ embeds: [logEmbed] });
        } catch (error) {
            console.error('Mute error:', error);
            await interaction.reply({ content: '❌ خطایی در میوت کردن کاربر رخ داد.', ephemeral: true });
        }
    },
};
