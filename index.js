import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();
client.queue = {};
client.queueMessages = {};
client.cooldowns = {};

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  }
}

client.once('ready', async () => {
  console.log(`Bot online: ${client.user.tag}`);

  try {
    client.queue = JSON.parse(fs.readFileSync('data/queue.json', 'utf8'));
  } catch {
    client.queue = config.regions.reduce((acc, r) => { acc[r] = []; return acc; }, {});
  }

  try {
    client.cooldowns = JSON.parse(fs.readFileSync('data/cooldowns.json', 'utf8'));
  } catch {
    client.cooldowns = {};
  }

  const commands = client.commands.map(cmd => cmd.data.toJSON());

  const rest = new REST({ version: '10' }).setToken(config.token);
  await rest.put(Routes.applicationGuildCommands(client.user.id, config.guildId), { body: commands });

  setInterval(async () => {
    const guild = client.guilds.cache.get(config.guildId);
    if (guild) {
      config.regions.forEach(async region => {
        const channel = guild.channels.cache.get(config.waitlistChannelId);
        if (!channel) return;
        const msgId = client.queueMessages[region];
        let msg = msgId ? await channel.messages.fetch(msgId).catch(() => null) : null;
        if (!msg) {
          const embed = { title: `${region} Waitlist`, description: 'Waitlist empty!', color: 0x00ff00 };
          msg = await channel.send({ embeds: [embed] });
          client.queueMessages[region] = msg.id;
        }
      });
    }
  }, 30000);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: 'Error executing command.', ephemeral: true });
    }
  }
});

client.login(config.token);
