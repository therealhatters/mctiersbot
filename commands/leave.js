import { SlashCommandBuilder } from 'discord.js';
import config from '../config.js';
import fs from 'fs';

export const data = new SlashCommandBuilder()
  .setName('leave')
  .setDescription('Leave the waitlist');

export async function execute(interaction, client) {
  const userId = interaction.user.id;
  let changed = false;

  config.regions.forEach(r => {
    if (client.queue[r]) {
      const before = client.queue[r].length;
      client.queue[r] = client.queue[r].filter(u => u.id !== userId);
      if (client.queue[r].length < before) changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync('data/queue.json', JSON.stringify(client.queue, null, 2));
    interaction.reply({ content: 'Left waitlist.', ephemeral: true });
  } else {
    interaction.reply({ content: 'Not in any waitlist.', ephemeral: true });
  }
}