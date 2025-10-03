const { handleVerifyButton } = require('../slash-commands/verify');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`Command ${interaction.commandName} not found`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}:`, error);
                const reply = { content: '❌ خطایی در اجرای دستور رخ داد.', ephemeral: true };
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(reply);
                } else {
                    await interaction.reply(reply);
                }
            }
        } else if (interaction.isButton()) {
            if (interaction.customId === 'verify_button') {
                await handleVerifyButton(interaction);
            }
        }
    }
};
