const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createLogEmbed } = require('../utils/embedBuilder');
const { addLog } = require('../utils/dataManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('آنمیوت کردن کاربر')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('کاربر مورد نظر')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        try {
            const member = interaction.guild.members.cache.get(user.id);
            await member.timeout(null);

            addLog('Unmute', user, interaction.user);

            const logEmbed = createLogEmbed('Unmute', user, interaction.user);
            await interaction.reply({ embeds: [logEmbed] });
        } catch (error) {
            console.error('Unmute error:', error);
            await interaction.reply({ content: '❌ خطایی در آنمیوت کردن کاربر رخ داد.', ephemeral: true });
        }
    },
};
