const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getLogs } = require('../utils/dataManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('نمایش آخرین لاگ‌های مدیریتی')
        .addIntegerOption(option =>
            option.setName('limit')
                .setDescription('تعداد لاگ‌ها')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(25))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const limit = interaction.options.getInteger('limit') || 10;
        const logs = getLogs(limit);

        if (logs.length === 0) {
            return interaction.reply({ content: '📋 هیچ لاگی ثبت نشده است.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('📋 آخرین لاگ‌های مدیریتی')
            .setTimestamp();

        logs.forEach((log, index) => {
            const date = new Date(log.timestamp).toLocaleString('fa-IR');
            embed.addFields({
                name: `${index + 1}. ${log.action} - ${date}`,
                value: `**کاربر:** ${log.user.tag}\n**مدیر:** ${log.moderator.tag}\n**علت:** ${log.reason || 'ندارد'}${log.duration ? `\n**مدت:** ${log.duration}` : ''}`,
                inline: false
            });
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
