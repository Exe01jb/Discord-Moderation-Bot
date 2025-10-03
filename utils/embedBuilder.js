const { EmbedBuilder } = require('discord.js');

const BOT_LOGO_URL = process.env.BOT_LOGO_URL || 'https://i.imgur.com/AfFp7pu.png';
const EMBED_COLOR = process.env.EMBED_COLOR || '#5865F2';

function createDMEmbed(type, user, reason = '', duration = '') {
    const embed = new EmbedBuilder()
        .setColor(EMBED_COLOR)
        .setThumbnail(BOT_LOGO_URL)
        .setTimestamp()
        .setFooter({ text: 'سام لند 1404-1405' });

    switch (type) {
        case 'ban':
            embed.setTitle('🚫 بن شدید')
                .setDescription(`شما از سرور سام لند بن شدید، علت بن شما: ${reason}${duration ? `، مدت: ${duration}` : ''}`);
            break;
        case 'unban':
            embed.setTitle('✅ آن‌بن شدید')
                .setDescription('شما از سرور سام لند آن‌بن شدید');
            break;
        case 'warn':
            embed.setTitle('⚠️ اخطار دریافت کردید')
                .setDescription(`شما از سرور سام لند وارن دریافت کردید علت وارن شما: ${reason}`);
            break;
        case 'kick':
            embed.setTitle('👢 کیک شدید')
                .setDescription(`شما از سرور سام لند کیک شدید علت کیک شما: ${reason}`);
            break;
        case 'mute':
            embed.setTitle('🔇 تایم‌اوت شدید')
                .setDescription(`شما از سرور سام لند تایم‌اوت شدید علت: ${reason}`);
            break;
    }

    return embed;
}

function createAnnouncementEmbed(title, message, imageUrl = null) {
    const embed = new EmbedBuilder()
        .setColor(EMBED_COLOR)
        .setThumbnail(BOT_LOGO_URL)
        .setTitle(title)
        .setDescription(message)
        .setTimestamp()
        .setFooter({ text: 'سام لند 1404-1405' });

    if (imageUrl) {
        embed.setImage(imageUrl);
    }

    return embed;
}

function createLogEmbed(action, user, moderator, reason = '', duration = '') {
    const embed = new EmbedBuilder()
        .setColor(EMBED_COLOR)
        .setTitle(`📋 ${action}`)
        .addFields(
            { name: 'کاربر', value: `${user.tag} (${user.id})`, inline: true },
            { name: 'مدیر', value: `${moderator.tag}`, inline: true },
            { name: 'علت', value: reason || 'ندارد', inline: false }
        )
        .setTimestamp();

    if (duration) {
        embed.addFields({ name: 'مدت', value: duration, inline: true });
    }

    return embed;
}

function createVerifyEmbed(title, description, bannerUrl) {
    const embed = new EmbedBuilder()
        .setColor(EMBED_COLOR)
        .setTitle(title || '✅ تایید هویت')
        .setDescription(description || 'برای دریافت دسترسی به سرور، لطفاً روی دکمه زیر کلیک کنید.');

    if (bannerUrl) {
        embed.setImage(bannerUrl);
    }

    return embed;
}

module.exports = {
    createDMEmbed,
    createAnnouncementEmbed,
    createLogEmbed,
    createVerifyEmbed
};
