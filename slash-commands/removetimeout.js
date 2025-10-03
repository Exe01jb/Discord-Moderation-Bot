const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { createLogEmbed } = require('../utils/embedBuilder');
const { updateCounter, getCounter, addLog } = require('../utils/dataManager');
const { sendDM } = require('../utils/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removetimeout')
        .setDescription('حذف تایم‌اوت کاربر')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('کاربر مورد نظر')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        try {
            const member = await interaction.guild.members.fetch(user.id).catch(() => null);
            
            if (!member) {
                return interaction.reply({ 
                    content: '❌ کاربر در سرور یافت نشد.', 
                    ephemeral: true 
                });
            }

            if (!member.isCommunicationDisabled()) {
                return interaction.reply({ 
                    content: '❌ این کاربر تایم‌اوت ندارد.', 
                    ephemeral: true 
                });
            }

            await member.timeout(null);

            const currentTimeouts = getCounter(user.id, 'timeouts');
            const newCount = currentTimeouts > 0 ? currentTimeouts - 1 : 0;
            if (currentTimeouts > 0) {
                updateCounter(user.id, 'timeouts', -1);
            }

            const dmEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ حذف تایم‌اوت')
                .setDescription('تایم‌اوت شما توسط مدیریت حذف شد.')
                .addFields({ name: '⚠️ تعداد تایم‌اوت‌های باقیمانده', value: `${newCount}/3`, inline: true })
                .setTimestamp();
            await sendDM(user, dmEmbed);

            addLog('Remove Timeout', user, interaction.user);
            
            const logEmbed = createLogEmbed('Remove Timeout', user, interaction.user);
            await interaction.reply({ embeds: [logEmbed] });

        } catch (error) {
            console.error('Remove timeout error:', error);
            await interaction.reply({ 
                content: '❌ خطایی در حذف تایم‌اوت رخ داد.', 
                ephemeral: true 
            });
        }
    },
};
