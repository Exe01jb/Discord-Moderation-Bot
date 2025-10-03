const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createDMEmbed, createLogEmbed } = require('../utils/embedBuilder');
const { sendDM } = require('../utils/permissions');
const { updateCounter, addLog } = require('../utils/dataManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('اخطار دادن به کاربر')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('کاربر مورد نظر')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('دلیل اخطار')
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

            const warnCount = updateCounter(user.id, 'warns');

            const embed = createDMEmbed('warn', user, reason);
            embed.addFields({ name: '⚠️ تعداد اخطارها', value: `${warnCount}/3`, inline: true });
            await sendDM(user, embed);

            addLog('Warn', user, interaction.user, reason);

            const logEmbed = createLogEmbed('Warn', user, interaction.user, reason);
            await interaction.reply({ embeds: [logEmbed] });

            if (warnCount >= 3) {
                try {
                    await member.kick(`سومین اخطار - ${reason}`);
                    
                    const kickEmbed = createDMEmbed('kick', user, 'دریافت 3 اخطار');
                    await sendDM(user, kickEmbed);
                    
                    await interaction.followUp(`⚠️ ${user.tag} به دلیل دریافت 3 اخطار از سرور کیک شد.`);
                    addLog('Kick', user, interaction.user, 'دریافت 3 اخطار');
                } catch (kickError) {
                    console.error('Failed to kick user after 3 warns:', kickError);
                    updateCounter(user.id, 'warns', -1);
                    await interaction.followUp('❌ خطا در کیک کردن کاربر. آخرین اخطار لغو شد.');
                }
            }
        } catch (error) {
            console.error('Warn error:', error);
            await interaction.reply({ content: '❌ خطایی در اخطار دادن به کاربر رخ داد.', ephemeral: true });
        }
    },
};
