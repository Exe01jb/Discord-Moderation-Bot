# Discord Moderation Bot

A comprehensive Discord moderation bot built with Node.js and discord.js v14, featuring Persian/Farsi language support.

## Features

- **User Moderation**: Ban, unban, mute, unmute, warn, unwarn, and kick users
- **Word Filtering**: Automatically filter unwanted words from messages
- **Verification System**: Set up role-based verification for new members
- **Logging**: Track all moderation actions
- **Slash Commands**: Modern Discord slash command interface

## Setup Instructions

### 1. Create a Discord Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section and click "Add Bot"
4. Under the bot's username, click "Reset Token" to get your bot token
5. Copy the bot token (you'll need this for step 3)
6. Enable these Privileged Gateway Intents:
   - Server Members Intent
   - Message Content Intent
7. Go to the "OAuth2" > "General" section
8. Copy your Application ID (CLIENT_ID)

### 2. Invite the Bot to Your Server

1. In the Developer Portal, go to "OAuth2" > "URL Generator"
2. Select these scopes:
   - `bot`
   - `applications.commands`
3. Select these bot permissions:
   - Administrator (or specific permissions as needed)
4. Copy the generated URL and open it in your browser
5. Select your server and authorize the bot

### 3. Configure Environment Variables

1. In Replit, go to the "Secrets" tab (lock icon in the left sidebar)
2. Add these secrets:
   - `DISCORD_TOKEN`: Your bot token from step 1
   - `CLIENT_ID`: Your Application ID from step 1
   - `BOT_LOGO_URL` (optional): URL to your bot's logo image
   - `EMBED_COLOR` (optional): Hex color code for embeds (default: #5865F2)

### 4. Deploy Slash Commands

After setting up the secrets, run this command once to register the slash commands with Discord:

```bash
node deploy-commands.js
```

### 5. Start the Bot

Click the "Run" button in Replit, or the bot will start automatically.

## Available Commands

All commands require Administrator permissions.

### Moderation Commands
- `/ban` - Ban a user (with optional reason and duration)
- `/unban` - Unban a user
- `/mute` - Mute a user (with optional duration)
- `/unmute` - Unmute a user
- `/warn` - Warn a user
- `/unwarn` - Remove a warning from a user
- `/kick` - Kick a user from the server
- `/timeout` - Timeout User
- `/removetimeout` - Removetimeout User

### Verification System
- `/verify setup` - Set up the verification system in a channel
- `/verify setrole` - Set the role given after verification
- `/verify setbanner` - Set a banner image for the verification message
- `/verify settext` - Customize verification message text

### Word Filter
- `/filter add` - Add a word to the filter
- `/filter remove` - Remove a word from the filter
- `/filter list` - View all filtered words

### Logs
- `/logs` - View recent moderation actions

### Help
- `/help` - Display all available commands

## Data Storage

The bot stores data in JSON files in the `data/` directory:
- `settings.json` - Bot configuration
- `counters.json` - User violation counts
- `logs.json` - Moderation action history
- `filters.json` - Filtered words list

## Support

This bot is configured for Persian/Farsi language interfaces. All command responses and DM notifications are in Persian.

## Project Structure

```
.
├── data/               # JSON data files
├── events/            # Discord event handlers
│   ├── interactionCreate.js
│   ├── messageCreate.js
│   └── ready.js
├── slash-commands/    # Slash command implementations
│   ├── filter.js
│   ├── help.js
│   ├── kick.js
│   ├── logs.js
│   ├── moderation.js
│   ├── mute.js
│   ├── unban.js
│   ├── unmute.js
│   ├── unwarn.js
│   ├── verify.js
│   └── warn.js
├── utils/            # Utility functions
│   ├── dataManager.js
│   ├── embedBuilder.js
│   └── permissions.js
├── index.js          # Main bot file
└── deploy-commands.js # Command registration script
```
