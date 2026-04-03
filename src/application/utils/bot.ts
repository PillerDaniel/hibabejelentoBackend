import config from 'config';
import {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    TextChannel,
} from 'discord.js';

const token = config.get<string>('DISCORD_TOKEN');

import Report from '../../domain/models/Report';
import { report } from 'node:process';

//channels
const runnningChannelId = config.get<string>('RUNNING_CHANNEL');
const logRequestsChannelId = config.get<string>('REQUEST_LOG_CHANNEL');
const emailErrorChannelId = config.get<string>('EMAILERROR_LOG_CHANNEL');
const reportLogChannelId = config.get<string>('REPORT_LOG_CHANNEL');
const errorLogChannelId = config.get<string>('ERROR_LOG_CHANNEL');
const registerLogChannelId = config.get<string>('REGISTER_LOG_CHANNEL');
const categoryLogChannelId = config.get<string>('CATEGORY_LOG_CHANNEL');

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
    userId: string,
    userAgent: string
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
                    { name: 'User ID:', value: userId, inline: false },
                    {
                        name: 'User Agent:',
                        value: userAgent || 'N/A',
                        inline: false,
                    }
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

const logEmailError = async (title: string, err: any) => {
    try {
        const channel = await client.channels.fetch(emailErrorChannelId);
        if (channel && channel.isTextBased()) {
            const embed = new EmbedBuilder()
                .setTitle('<:botEmailError:1482098634026778684> Email Error')
                .addFields(
                    { name: 'Title:', value: title, inline: false },
                    { name: 'Error:', value: err, inline: false }
                )
                .setColor(0xff0000)
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

const logReportCreate = async (reportId: string, userId: string) => {
    try {
        const channel = await client.channels.fetch(reportLogChannelId);
        if (channel && channel.isTextBased()) {
            const embed = new EmbedBuilder()
                .setTitle(
                    '<:botReportCreate:1483571036409692232>  New Report Created'
                )
                .addFields(
                    { name: 'Report ID:', value: reportId, inline: false },
                    { name: 'User ID:', value: userId, inline: false }
                )
                .setColor(0x3fff00)
                .setTimestamp();
            await (channel as TextChannel).send({ embeds: [embed] });
        } else {
            console.error(
                'Log requests channel not found or is not text-based'
            );
        }
    } catch (error) {
        console.error('Error sending message to report log channel', error);
    }
};

const logReportEdit = async (
    oldReport: object,
    newReport: object,
    userId: string
) => {
    try {
        const channel = await client.channels.fetch(reportLogChannelId);

        const newReportObj = newReport as Report;
        const oldReportObj = oldReport as Report;

        if (channel && channel.isTextBased()) {
            const embed = new EmbedBuilder()
                .setTitle('<:botReportEdit:1483573583933476974> Report Edited')
                .addFields(
                    {
                        name: 'Old Report:',
                        value: `Id: ${oldReportObj.id}\nTitle: ${oldReportObj.title}\nDescription: ${oldReportObj.description}\nPriority: ${oldReportObj.priority}\nCategoryId: ${oldReportObj.category.id}\nCategory: ${oldReportObj.category.name}\nStatus: ${oldReportObj.status}\nManaged By: ${oldReportObj.managedBy ? oldReportObj.managedBy.username : null}`,
                        inline: false,
                    },
                    {
                        name: 'Edited Report:',
                        value: `Id: ${newReportObj.id}\nTitle: ${newReportObj.title}\nDescription: ${newReportObj.description}\nPriority: ${newReportObj.priority}\nCategoryId: ${newReportObj.category.id}\nCategory: ${newReportObj.category.name}\nStatus: ${newReportObj.status}\nManaged By: ${newReportObj.managedBy ? newReportObj.managedBy.username : null}`,
                        inline: false,
                    },
                    { name: 'User ID:', value: userId, inline: false }
                )
                .setColor(0x1324c1)
                .setTimestamp();
            await (channel as TextChannel).send({ embeds: [embed] });
        } else {
            console.error(
                'Log requests channel not found or is not text-based'
            );
        }
    } catch (error) {
        console.error('Error sending message to report log channel', error);
    }
};

const logReportStatusChange = async (
    reportId: string,
    userId: string,
    status: string
) => {
    try {
        const channel = await client.channels.fetch(reportLogChannelId);

        if (channel && channel.isTextBased()) {
            const embed = new EmbedBuilder()
                .setTitle(
                    '<:botStatusChange:1483729122814595245> Report Status Changed'
                )
                .addFields(
                    { name: 'Report ID:', value: reportId, inline: false },
                    { name: 'New Status:', value: status, inline: false },
                    { name: 'User ID:', value: userId, inline: false }
                )
                .setColor(0xffff00)
                .setTimestamp();
            await (channel as TextChannel).send({ embeds: [embed] });
        } else {
            console.error(
                'Log requests channel not found or is not text-based'
            );
        }
    } catch (error) {
        console.error('Error sending message to report log channel', error);
    }
};

const logReportAssign = async (reportId: string, userId: string) => {
    try {
        const channel = await client.channels.fetch(reportLogChannelId);

        if (channel && channel.isTextBased()) {
            const embed = new EmbedBuilder()
                .setTitle(
                    '<:botReportAssign:1483733682056466595> Report Assigned'
                )
                .addFields(
                    { name: 'Report ID:', value: reportId, inline: false },
                    {
                        name: 'Assigned To User ID:',
                        value: userId,
                        inline: false,
                    }
                )
                .setColor(0xffff00)
                .setTimestamp();
            await (channel as TextChannel).send({ embeds: [embed] });
        } else {
            console.error(
                'Log requests channel not found or is not text-based'
            );
        }
    } catch (error) {
        console.error('Error sending message to report log channel', error);
    }
};

const logRegister = async (userId: string, adminId: string) => {
    try {
        const channel = await client.channels.fetch(registerLogChannelId);
        if (channel && channel.isTextBased()) {
            const embed = new EmbedBuilder()
                .setTitle('<:botRegister:1484714055079039056>  Account created')
                .addFields(
                    { name: 'UserId:', value: userId, inline: false },
                    {
                        name: 'AdminId:',
                        value: adminId,
                        inline: false,
                    }
                )
                .setColor(0x13dd34)
                .setTimestamp();
            await (channel as TextChannel).send({ embeds: [embed] });
        } else {
            console.error(
                'Log requests channel not found or is not text-based'
            );
        }
    } catch (error) {
        console.error('Error sending message to register log channel', error);
    }
};

const logError = async (route: string, err: any) => {
    try {
        const channel = await client.channels.fetch(errorLogChannelId);
        if (channel && channel.isTextBased()) {
            const embed = new EmbedBuilder()
                .setTitle('<:botError:1485543767908810802>  Error Occurred')
                .addFields(
                    { name: 'Route:', value: route, inline: false },
                    {
                        name: 'Error:',
                        value: err,
                        inline: false,
                    }
                )
                .setColor(0xff0000)
                .setTimestamp();
            await (channel as TextChannel).send({ embeds: [embed] });
        } else {
            console.error('Error log channel not found or is not text-based');
        }
    } catch (error) {
        console.error('Error sending message to error log channel', error);
    }
};

const logCategoryCreate = async (categoryId: string, userId: string) => {
    try {
        const channel = await client.channels.fetch(categoryLogChannelId);
        if (channel && channel.isTextBased()) {
            const embed = new EmbedBuilder()
                .setTitle('<:botCategory:1489668807482937496> Category Created')
                .addFields(
                    { name: 'Category ID:', value: categoryId, inline: false },
                    {
                        name: 'User ID:',
                        value: userId,
                        inline: false,
                    }
                )
                .setColor(0x13dd34)
                .setTimestamp();
            await (channel as TextChannel).send({ embeds: [embed] });
        } else {
            console.error(
                'Category log channel not found or is not text-based'
            );
        }
    } catch (error) {
        console.error('Error sending message to category log channel', error);
    }
};

export {
    startBot,
    logRequest,
    logEmailError,
    logReportCreate,
    logReportEdit,
    logReportStatusChange,
    logReportAssign,
    logRegister,
    logError,
    logCategoryCreate,
};
