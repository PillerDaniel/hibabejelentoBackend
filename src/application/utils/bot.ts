import config from 'config';
import {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    TextChannel,
} from 'discord.js';

const token = config.get<string>('DISCORD_TOKEN');

//channels
const runnningChannelId = config.get<string>('RUNNING_CHANNEL');
const logRequestsChannelId = config.get<string>('REQUEST_LOG_CHANNEL');

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

const startBot = async () => {
    try {
        await client.login(token);
        await sendRunningMessage('Bot is online!');
        console.log('Discord bot logged in successfully');
    } catch (err) {
        console.error('Error logging in the Discord bot', err);
        process.exit(1);
    }
};

const sendRunningMessage = async (message: string) => {
    try {
        const channel = await client.channels.fetch(runnningChannelId);
        if (channel && channel.isTextBased()) {
            const embed = new EmbedBuilder()
                .setTitle('<:botOnline:1476961315607019611> Bot Status')
                .setDescription(message)
                .setColor(0xffff00)
                .setTimestamp();
            await (channel as TextChannel).send({ embeds: [embed] });
        } else {
            console.error('Running channel not found or is not text-based');
        }
    } catch (error) {
        console.error('Error sending message to running channel', error);
    }
};

const logRequest = async (
    endpoint: string,
    method: string,
    status: number,
    userId: string
) => {
    try {
        const channel = await client.channels.fetch(logRequestsChannelId);
        if (channel && channel.isTextBased()) {
            const embed = new EmbedBuilder()
                .setTitle('<:botRequest:1476962224294858843> Request Log')
                .addFields(
                    { name: 'Method:', value: method, inline: false },
                    { name: 'Endpoint:', value: endpoint, inline: false },
                    {
                        name: 'Status:',
                        value: status.toString(),
                        inline: false,
                    },
                    { name: 'User ID:', value: userId, inline: false }
                )
                .setColor(0x00ff00)
                .setTimestamp();
            await (channel as TextChannel).send({ embeds: [embed] });
        } else {
            console.error(
                'Log requests channel not found or is not text-based'
            );
        }
    } catch (error) {
        console.error('Error sending message to request channel', error);
    }
};

export { startBot, logRequest };
