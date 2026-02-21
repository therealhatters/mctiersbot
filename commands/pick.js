import { SlashCommandBuilder } from 'discord.js';
import config from '../config.js';
import fs from 'fs';

export const data = new SlashCommandBuilder()
  .setName('pick')
  .setDescription('Pick a user')
  .addUserOption(option => option.setName('user').setDescription('User').setRequired(true))
  .addStringOption(option =>
    option.setName('region')
      .setDescription('Region')
      .setRequired(true)
      .addChoices(...config.regions.map(r => ({ name: r, value: r })))
  );

export async function execute(interaction, client) {
  const target = interaction.options.getUser('user');
  const region = interaction.options.getString('region');

  const q = client.queue[region];
  if (!q || !q.some(u => u.id === target.id)) {
    return interaction.reply({ content: 'User not in this queue.', ephemeral: true });
  }

  client.queue[region] = q.filter(u => u.id !== target.id);
  fs.writeFileSync('data/queue.json', JSON.stringify(client.queue, null, 2));

  await interaction.reply({ content: `Picked <@${target.id}> from ${region}.` });
}
