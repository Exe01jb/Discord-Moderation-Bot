const { PermissionFlagsBits } = require('discord.js');

function isAdmin(member) {
    return member.permissions.has(PermissionFlagsBits.Administrator);
}

function parseDuration(durationStr) {
    if (!durationStr) return null;

    const regex = /(\d+)([smhd])/g;
    let totalMs = 0;
    let match;

    while ((match = regex.exec(durationStr)) !== null) {
        const value = parseInt(match[1]);
        const unit = match[2];

        switch (unit) {
            case 's':
                totalMs += value * 1000;
                break;
            case 'm':
                totalMs += value * 60 * 1000;
                break;
            case 'h':
                totalMs += value * 60 * 60 * 1000;
                break;
            case 'd':
                totalMs += value * 24 * 60 * 60 * 1000;
                break;
        }
    }

    return totalMs || null;
}

function formatDuration(ms) {
    if (!ms) return 'دائمی';

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} روز`;
    if (hours > 0) return `${hours} ساعت`;
    if (minutes > 0) return `${minutes} دقیقه`;
    return `${seconds} ثانیه`;
}

async function sendDM(user, embed) {
    try {
        await user.send({ embeds: [embed] });
        return true;
    } catch (error) {
        console.error(`Could not send DM to ${user.tag}:`, error);
        return false;
    }
}

module.exports = {
    isAdmin,
    parseDuration,
    formatDuration,
    sendDM
};
