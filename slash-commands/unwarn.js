const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createLogEmbed } = require('../utils/embedBuilder');
const { updateCounter, getCounter, addLog } = require('../utils/dataManager');
const { sendDM } = require('../utils/permissions');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unwarn')
        .setDescription('حذف اخطار کاربر')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('کاربر مورد نظر')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        try {
            const currentWarns = getCounter(user.id, 'warns');
            if (currentWarns > 0) {
                const newCount = currentWarns - 1;
                updateCounter(user.id, 'warns', -1);
                
                const dmEmbed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('✅ حذف اخطار')
                    .setDescription(`یکی از اخطارهای شما توسط مدیریت حذف شد.`)
                    .addFields({ name: '⚠️ تعداد اخطارهای باقیمانده', value: `${newCount}/3`, inline: true })
                    .setTimestamp();
                await sendDM(user, dmEmbed);
                
                addLog('Unwarn', user, interaction.user);
                
                const logEmbed = createLogEmbed('Unwarn', user, interaction.user);
                await interaction.reply({ embeds: [logEmbed] });
            } else {
                await interaction.reply({ content: '❌ این کاربر هیچ اخطاری ندارد.', ephemeral: true });
            }
        } catch (error) {
            console.error('Unwarn error:', error);
            await interaction.reply({ content: '❌ خطایی در حذف اخطار رخ داد.', ephemeral: true });
        }
    },
};
