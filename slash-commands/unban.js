const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createDMEmbed, createLogEmbed } = require('../utils/embedBuilder');
const { sendDM } = require('../utils/permissions');
const { addLog } = require('../utils/dataManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('آنبن کردن کاربر')
        .addStringOption(option =>
            option.setName('user_id')
                .setDescription('شناسه کاربر')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const userId = interaction.options.getString('user_id');

        try {
            await interaction.guild.members.unban(userId);
            
            const user = await interaction.client.users.fetch(userId);
            const embed = createDMEmbed('unban', user);
            await sendDM(user, embed);

            addLog('Unban', user, interaction.user);

            const logEmbed = createLogEmbed('Unban', user, interaction.user);
            await interaction.reply({ embeds: [logEmbed] });
        } catch (error) {
            console.error('Unban error:', error);
            await interaction.reply({ content: '❌ خطایی در آنبن کردن کاربر رخ داد.', ephemeral: true });
        }
    },
};
