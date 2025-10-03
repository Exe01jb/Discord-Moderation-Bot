const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createDMEmbed, createLogEmbed } = require('../utils/embedBuilder');
const { parseDuration, formatDuration, sendDM } = require('../utils/permissions');
const { addLog, updateCounter, getCounter } = require('../utils/dataManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('تایم‌اوت کردن کاربر')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('کاربر مورد نظر')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('مدت زمان (مثال: 10m, 1h, 1d)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('دلیل تایم‌اوت')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const durationStr = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'دلیلی مشخص نشده';

        try {
            const member = await interaction.guild.members.fetch(user.id).catch(() => null);
            
            if (!member) {
                return interaction.reply({ 
                    content: '❌ کاربر در سرور یافت نشد.', 
                    ephemeral: true 
                });
            }

            const durationMs = parseDuration(durationStr);
            
            if (!durationMs || durationMs <= 0) {
                return interaction.reply({ 
                    content: '❌ مدت زمان نامعتبر است. مثال: 10m, 1h, 1d', 
                    ephemeral: true 
                });
            }

            if (durationMs > 28 * 24 * 60 * 60 * 1000) {
                return interaction.reply({ 
                    content: '❌ حداکثر مدت تایم‌اوت 28 روز است.', 
                    ephemeral: true 
                });
            }

            await member.timeout(durationMs, reason);

            const timeoutCount = updateCounter(user.id, 'timeouts');

            const embed = createDMEmbed('mute', user, reason, formatDuration(durationMs));
            embed.addFields({ name: '⚠️ تعداد تایم‌اوت‌ها', value: `${timeoutCount}/3`, inline: true });
            await sendDM(user, embed);

            addLog('Timeout', user, interaction.user, reason, formatDuration(durationMs));

            const logEmbed = createLogEmbed('Timeout', user, interaction.user, reason, formatDuration(durationMs));
            await interaction.reply({ embeds: [logEmbed] });

        } catch (error) {
            console.error('Timeout error:', error);
            await interaction.reply({ 
                content: '❌ خطایی در تایم‌اوت کردن کاربر رخ داد.', 
                ephemeral: true 
            });
        }
    },
};
