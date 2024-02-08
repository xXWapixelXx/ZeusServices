const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const config = require('./config.json'); // Import the configuration file
const client = new Client({ intents: [Intents.FLAGS.Guilds, Intents.FLAGS.MessageContent, Intents.FLAGS.MessageComponents] });

client.once('ready', () => {
    console.log('Bot is ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'buy') {
        // Create a private channel (ticket) here
        const ticketChannel = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
            type: 'GUILD_TEXT',
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone, // Replace with the ID of the role you want to have access to the ticket
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ],
        });
        await ticketChannel.send(`Ticket for ${interaction.user.username}`);
        await interaction.reply('A ticket has been created for you!');
    }
});

client.on('messageCreate', message => {
    if (message.content === '!showproducts' && message.channel.id === config.purchaseChannelId) { // Use the channel ID from the config file
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Products for sale')
            .setDescription(
                '1000 Vbucks - $7.99\n' +
                '5000 Vbucks - $31.99\n' +
                '10000 Vbucks - $59.99\n' +
                'Product 4 - $Price\n' + // Replace with your actual product name and price
                'Product 5 - $Price\n'  // Replace with your actual product name and price
            );

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('buy')
                    .setLabel('Buy Now')
                    .setStyle('SUCCESS')
                    .setEmoji('💰'),
            );

        message.channel.send({ embeds: [embed], components: [row] });
    }
});

client.login(config.token); // Use the token from the config file