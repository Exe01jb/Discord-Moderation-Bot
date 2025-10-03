const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { createAnnouncementEmbed } = require('../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('ارسال اطلاعیه به اعضا')
        .addSubcommand(subcommand =>
            subcommand
                .setName('main_server')
                .setDescription('ارسال اطلاعیه به سرور اصلی')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('کانال برای ارسال اطلاعیه')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('title')
                        .setDescription('عنوان اطلاعیه')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('متن اطلاعیه')
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('نقش برای تگ کردن (اختیاری)')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('image')
                        .setDescription('لینک تصویر (اختیاری)')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('کد رنگ embed (مثال: #FF0000)')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('staff_team')
                .setDescription('ارسال اطلاعیه به تیم استاف')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('کانال استاف')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('نقش استاف')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('title')
                        .setDescription('عنوان اطلاعیه')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('متن اطلاعیه')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('image')
                        .setDescription('لینک تصویر (اختیاری)')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('کد رنگ embed (مثال: #FF0000)')
                        .setRequired(false)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const channel = interaction.options.getChannel('channel');
        const title = interaction.options.getString('title');
        const message = interaction.options.getString('message');
        const imageUrl = interaction.options.getString('image');
        const color = interaction.options.getString('color');

        await interaction.deferReply({ ephemeral: true });

        try {
            const embed = createAnnouncementEmbed(title, message, imageUrl);
            
            if (color && /^#[0-9A-F]{6}$/i.test(color)) {
                embed.setColor(color);
            }

            if (subcommand === 'main_server') {
                const role = interaction.options.getRole('role');
                
                if (role) {
                    await channel.send({ 
                        content: `${role}`,
                        embeds: [embed] 
                    });
                } else {
                    await channel.send({ embeds: [embed] });
                }

                const members = await interaction.guild.members.fetch();
                let successCount = 0;
                let failCount = 0;

                for (const [, member] of members) {
                    if (member.user.bot) continue;
                    
                    try {
                        await member.send({ embeds: [embed] });
                        successCount++;
                    } catch (error) {
                        failCount++;
                    }
                }

                const roleText = role ? ` و ${role.name} تگ شد` : '';
                await interaction.editReply({
                    content: `✅ اطلاعیه در ${channel} ارسال شد${roleText}.\n📨 DM به ${successCount} نفر ارسال شد.\n❌ ${failCount} نفر DM دریافت نکردند.`
                });

            } else if (subcommand === 'staff_team') {
                const role = interaction.options.getRole('role');
                
                await channel.send({ 
                    content: `${role}`,
                    embeds: [embed] 
                });

                const members = await interaction.guild.members.fetch();
                let successCount = 0;
                let failCount = 0;

                for (const [, member] of members) {
                    if (member.user.bot) continue;
                    if (!member.roles.cache.has(role.id)) continue;
                    
                    try {
                        await member.send({ embeds: [embed] });
                        successCount++;
                    } catch (error) {
                        failCount++;
                    }
                }

                await interaction.editReply({
                    content: `✅ اطلاعیه در ${channel} ارسال شد و ${role.name} تگ شد.\n📨 DM به ${successCount} نفر از ${role.name} ارسال شد.\n❌ ${failCount} نفر DM دریافت نکردند.`
                });
            }

        } catch (error) {
            console.error('Announcement error:', error);
            await interaction.editReply({ 
                content: '❌ خطایی در ارسال اطلاعیه رخ داد.' 
            });
        }
    },
};
