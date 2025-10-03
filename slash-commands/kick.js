const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createDMEmbed, createLogEmbed } = require('../utils/embedBuilder');
const { sendDM } = require('../utils/permissions');
const { updateCounter, addLog } = require('../utils/dataManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('کیک کردن کاربر')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('کاربر مورد نظر')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('دلیل کیک')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'دلیلی مشخص نشده';

        try {
            const member = await interaction.guild.members.fetch(user.id).catch(() => null);
            
            if (!member) {
                return interaction.reply({ 
                    content: '❌ کاربر در سرور یافت نشد.', 
                    ephemeral: true 
                });
            }
            
            const kickCount = updateCounter(user.id, 'kicks');

            const embed = createDMEmbed('kick', user, reason);
            await sendDM(user, embed);

            await member.kick(reason);

            addLog('Kick', user, interaction.user, reason);

            const logEmbed = createLogEmbed('Kick', user, interaction.user, reason);
            await interaction.reply({ embeds: [logEmbed] });

            if (kickCount >= 3) {
                await interaction.guild.members.ban(user.id, { reason: 'دریافت 3 کیک' });
                updateCounter(user.id, 'bans');
                
                const banEmbed = createDMEmbed('ban', user, 'دریافت 3 کیک', 'دائمی');
                await sendDM(user, banEmbed);
                
                await interaction.followUp(`⚠️ ${user.tag} به دلیل دریافت 3 کیک به صورت دائمی بن شد.`);
                addLog('Ban', user, interaction.user, 'دریافت 3 کیک', 'دائمی');
            }
        } catch (error) {
            console.error('Kick error:', error);
            await interaction.reply({ content: '❌ خطایی در کیک کردن کاربر رخ داد.', ephemeral: true });
        }
    },
};
