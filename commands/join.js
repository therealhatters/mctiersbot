import { SlashCommandBuilder } from 'discord.js';
import config from '../config.js';

export const data = new SlashCommandBuilder()
  .setName('join')
  .setDescription('Join waitlist')
  .addStringOption(option =>
    option.setName('region')
      .setDescription('Region')
      .setRequired(true)
      .addChoices(...config.regions.map(r => ({ name: r, value: r })))
  );

export async function execute(interaction, client) {
  const region = interaction.options.getString('region');
  const userId = interaction.user.id;

  if (Date.now() - (client.cooldowns[userId] || 0) < config.cooldownMs) {
    return interaction.reply({ content: 'On cooldown.', ephemeral: true });
  }

  if (Object.values(client.queue).flat().some(u => u.id === userId)) {
    return interaction.reply({ content: 'Already in waitlist.', ephemeral: true });
  }

  if (!client.queue[region]) client.queue[region] = [];
  client.queue[region].push({ id: userId, username: interaction.user.username, mcname: 'Pending', region, joined: Date.now() });

  fs.writeFileSync('data/queue.json', JSON.stringify(client.queue, null, 2));

  interaction.reply({ content: `Joined ${region} waitlist.`, ephemeral: true });
}