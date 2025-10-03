const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createVerifyEmbed } = require('../utils/embedBuilder');
const { readData, writeData } = require('../utils/dataManager');

async function handleVerifyButton(interaction) {
    const settings = readData('settings.json');

    if (!settings.verifyRole) {
        return interaction.reply({ content: '❌ سیستم تایید هویت تنظیم نشده است.', ephemeral: true });
    }

    const member = interaction.member;
    const role = interaction.guild.roles.cache.get(settings.verifyRole);

    if (!role) {
        return interaction.reply({ content: '❌ نقش تایید هویت یافت نشد.', ephemeral: true });
    }

    if (member.roles.cache.has(settings.verifyRole)) {
        return interaction.reply({ content: '✅ شما قبلاً تایید هویت شده‌اید!', ephemeral: true });
    }

    try {
        await member.roles.add(role);
        await interaction.reply({ content: '✅ هویت شما با موفقیت تایید شد!', ephemeral: true });
    } catch (error) {
        console.error('Error verifying user:', error);
        await interaction.reply({ content: '❌ خطایی در تایید هویت رخ داد.', ephemeral: true });
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('مدیریت سیستم تایید هویت')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('نصب سیستم تایید هویت')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('کانال مورد نظر')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('setrole')
                .setDescription('تنظیم نقش تایید هویت')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('نقش مورد نظر')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('setbanner')
                .setDescription('تنظیم بنر تایید هویت')
                .addStringOption(option =>
                    option.setName('url')
                        .setDescription('URL تصویر')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('settext')
                .setDescription('تنظیم متن تایید هویت')
                .addStringOption(option =>
                    option.setName('title')
                        .setDescription('عنوان')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('description')
                        .setDescription('توضیحات')
                        .setRequired(false)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'setup') {
            const channel = interaction.options.getChannel('channel') || interaction.channel;
            const settings = readData('settings.json');

            if (!settings.verifyRole) {
                return interaction.reply({ content: '❌ لطفاً ابتدا با دستور `/verify setrole` نقش تایید هویت را تنظیم کنید.', ephemeral: true });
            }

            const embed = createVerifyEmbed(
                settings.verifyTitle,
                settings.verifyDescription,
                settings.verifyBanner
            );

            const button = new ButtonBuilder()
                .setCustomId('verify_button')
                .setLabel('✅ تایید هویت')
                .setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder().addComponents(button);

            await channel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: `✅ پیام تایید هویت در ${channel} ارسال شد.`, ephemeral: true });
        } else if (subcommand === 'setrole') {
            const role = interaction.options.getRole('role');
            const settings = readData('settings.json');
            settings.verifyRole = role.id;
            writeData('settings.json', settings);

            await interaction.reply({ content: `✅ نقش تایید هویت به ${role.name} تنظیم شد.`, ephemeral: true });
        } else if (subcommand === 'setbanner') {
            const url = interaction.options.getString('url');
            if (!url.startsWith('http')) {
                return interaction.reply({ content: '❌ لطفاً یک URL معتبر وارد کنید.', ephemeral: true });
            }

            const settings = readData('settings.json');
            settings.verifyBanner = url;
            writeData('settings.json', settings);

            await interaction.reply({ content: '✅ بنر تایید هویت تنظیم شد.', ephemeral: true });
        } else if (subcommand === 'settext') {
            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');

            const settings = readData('settings.json');
            if (title) settings.verifyTitle = title;
            if (description) settings.verifyDescription = description;
            writeData('settings.json', settings);

            await interaction.reply({ content: '✅ متن تایید هویت تنظیم شد.', ephemeral: true });
        }
    },
    handleVerifyButton
};
