const { readData, writeData } = require('../utils/dataManager');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;
        if (!message.guild) return;

        const filters = readData('filters.json');
        if (!filters || !filters.words || filters.words.length === 0) return;

        const messageContent = message.content.toLowerCase();
        const containsFilteredWord = filters.words.some(word => 
            messageContent.includes(word.toLowerCase())
        );

        if (containsFilteredWord) {
            try {
                await message.delete();

                if (!filters.violations) {
                    filters.violations = {};
                }

                const userId = message.author.id;
                if (!filters.violations[userId]) {
                    filters.violations[userId] = {
                        count: 0,
                        hasBeenTimedOut: false
                    };
                }

                filters.violations[userId].count += 1;
                const violationCount = filters.violations[userId].count;
                const hasBeenTimedOut = filters.violations[userId].hasBeenTimedOut;

                writeData('filters.json', filters);

                const dmEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('⚠️ استفاده از کلمات غیرمجاز')
                    .setDescription('شما از کلمه‌ای غیرمجاز استفاده کردید و پیام شما حذف شد.')
                    .addFields({ name: '🚨 تعداد تخلفات', value: `${violationCount}`, inline: true })
                    .setTimestamp();

                try {
                    await message.author.send({ embeds: [dmEmbed] });
                } catch (dmError) {
                    console.log(`Could not send DM to ${message.author.tag}`);
                }

                if (!hasBeenTimedOut && violationCount >= 3) {
                    const member = await message.guild.members.fetch(message.author.id).catch(() => null);
                    if (member) {
                        try {
                            await member.timeout(10 * 60 * 1000, 'استفاده از 3 کلمه غیرمجاز');
                            
                            filters.violations[userId].hasBeenTimedOut = true;
                            filters.violations[userId].count = 0;
                            writeData('filters.json', filters);

                            const timeoutEmbed = new EmbedBuilder()
                                .setColor('#FF6600')
                                .setTitle('⏱️ تایم‌اوت 10 دقیقه‌ای')
                                .setDescription('به دلیل استفاده از 3 کلمه غیرمجاز، برای 10 دقیقه تایم‌اوت شدید.')
                                .addFields({ name: '⚠️ هشدار', value: 'اگر پس از تایم‌اوت دوباره 2 بار از کلمات غیرمجاز استفاده کنید، از سرور کیک خواهید شد.', inline: false })
                                .setTimestamp();

                            try {
                                await message.author.send({ embeds: [timeoutEmbed] });
                            } catch (dmError) {
                                console.log(`Could not send timeout DM to ${message.author.tag}`);
                            }
                        } catch (timeoutError) {
                            console.error('Failed to timeout user:', timeoutError);
                            filters.violations[userId].count -= 1;
                            writeData('filters.json', filters);
                        }
                    }
                } else if (hasBeenTimedOut && violationCount >= 2) {
                    const member = await message.guild.members.fetch(message.author.id).catch(() => null);
                    if (member) {
                        try {
                            await member.kick('استفاده مجدد از کلمات غیرمجاز پس از تایم‌اوت');
                            
                            const kickEmbed = new EmbedBuilder()
                                .setColor('#FF0000')
                                .setTitle('🚫 کیک شدید')
                                .setDescription('به دلیل استفاده مجدد از کلمات غیرمجاز پس از تایم‌اوت، از سرور کیک شدید.')
                                .setTimestamp();

                            try {
                                await message.author.send({ embeds: [kickEmbed] });
                            } catch (dmError) {
                                console.log(`Could not send kick DM to ${message.author.tag}`);
                            }

                            delete filters.violations[userId];
                            writeData('filters.json', filters);
                        } catch (kickError) {
                            console.error('Failed to kick user:', kickError);
                            filters.violations[userId].count -= 1;
                            writeData('filters.json', filters);
                        }
                    }
                }

            } catch (error) {
                console.error('Filter error:', error);
            }
        }
    }
};
