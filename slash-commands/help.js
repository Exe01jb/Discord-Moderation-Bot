const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('نمایش راهنمای ربات'),
    async execute(interaction) {
        const isUserAdmin = interaction.member.permissions.has('Administrator');

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('📚 راهنمای ربات سام لند')
            .setDescription('لیست تمام دستورات موجود')
            .setThumbnail(process.env.BOT_LOGO_URL || 'https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            .setFooter({ text: 'سام لند 1404-1405' });

        if (isUserAdmin) {
            embed.addFields(
                {
                    name: '🔨 دستورات مدیریتی',
                    value: '`/ban` - بن کردن کاربر\n' +
                           '`/unban` - آنبن کردن کاربر\n' +
                           '`/mute` - میوت کردن کاربر\n' +
                           '`/unmute` - آنمیوت کردن کاربر\n' +
                           '`/warn` - اخطار دادن به کاربر\n' +
                           '`/unwarn` - حذف اخطار کاربر\n' +
                           '`/kick` - کیک کردن کاربر',
                    inline: false
                },
                {
                    name: '✅ دستورات تایید هویت',
                    value: '`/verify setup` - نصب سیستم تایید هویت\n' +
                           '`/verify setrole` - تنظیم نقش تایید هویت\n' +
                           '`/verify setbanner` - تنظیم بنر تایید هویت\n' +
                           '`/verify settext` - تنظیم متن',
                    inline: false
                },
                {
                    name: '🛡️ دستورات فیلتر',
                    value: '`/filter add` - اضافه کردن کلمه به فیلتر\n' +
                           '`/filter remove` - حذف کلمه از فیلتر\n' +
                           '`/filter list` - نمایش لیست کلمات فیلتر شده',
                    inline: false
                },
                {
                    name: '📋 دستورات لاگ',
                    value: '`/logs` - نمایش آخرین لاگ‌های مدیریتی',
                    inline: false
                }
            );
        } else {
            embed.addFields(
                {
                    name: 'دستورات عمومی',
                    value: '`/help` - نمایش این راهنما\n\nبرای دسترسی به دستورات مدیریتی، به مجوز ادمین نیاز دارید.',
                    inline: false
                }
            );
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
