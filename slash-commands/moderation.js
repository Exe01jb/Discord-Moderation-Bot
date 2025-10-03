const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createDMEmbed, createLogEmbed } = require('../utils/embedBuilder');
const { parseDuration, formatDuration, sendDM } = require('../utils/permissions');
const { updateCounter, getCounter, addLog } = require('../utils/dataManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('بن کردن کاربر')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('کاربر مورد نظر')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('دلیل بن')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('مدت زمان (مثال: 1d, 2h, 30m)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'دلیلی مشخص نشده';
        const duration = interaction.options.getString('duration') || '';

        try {
            const banCount = updateCounter(user.id, 'bans');
            const isPermanent = banCount >= 3;

            const embed = createDMEmbed('ban', user, reason, isPermanent ? 'دائمی' : formatDuration(parseDuration(duration)));
            await sendDM(user, embed);

            await interaction.guild.members.ban(user.id, { reason });

            addLog('Ban', user, interaction.user, reason, isPermanent ? 'دائمی' : formatDuration(parseDuration(duration)));

            const logEmbed = createLogEmbed('Ban', user, interaction.user, reason, isPermanent ? 'دائمی' : formatDuration(parseDuration(duration)));
            
            await interaction.reply({ embeds: [logEmbed] });

            if (isPermanent) {
                await interaction.followUp(`⚠️ این سومین بن ${user.tag} است. بن دائمی اعمال شد.`);
            }
        } catch (error) {
            console.error('Ban error:', error);
            await interaction.reply({ content: '❌ خطایی در بن کردن کاربر رخ داد.', ephemeral: true });
        }
    },
};
