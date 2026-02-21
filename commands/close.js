import { SlashCommandBuilder } from 'discord.js';
import config from '../config.js';
import fs from 'fs';
import fetch from 'node-fetch';

export const data = new SlashCommandBuilder()
  .setName('close')
  .setDescription('Close test and assign tier')
  .addUserOption(option => option.setName('user').setDescription('User').setRequired(true))
  .addStringOption(option =>
    option.setName('tier')
      .setDescription('Tier')
      .setRequired(true)
      .addChoices(...config.tierChoices)
  );

export async function execute(interaction, client) {
  const target = interaction.options.getUser('user');
  const tier = interaction.options.getString('tier');

  config.regions.forEach(r => {
    if (client.queue[r]) client.queue[r] = client.queue[r].filter(u => u.id !== target.id);
  });

  fs.writeFileSync('data/queue.json', JSON.stringify(client.queue, null, 2));

  const member = await interaction.guild.members.fetch(target.id).catch(() => null);
  if (member && config.tierRoles[tier]) await member.roles.add(config.tierRoles[tier]);

  if (['HT1','HT2','HT3'].includes(tier) && config.highTicketCategoryId) {
    const ticket = await interaction.guild.channels.create({
      name: `high-ticket-${target.username.toLowerCase()}`,
      type: 0,
      parent: config.highTicketCategoryId,
      permissionOverwrites: [
        { id: interaction.guild.roles.everyone.id, deny: ['ViewChannel'] },
        { id: target.id, allow: ['ViewChannel', 'SendMessages'] },
        { id: config.testerRoleId, allow: ['ViewChannel', 'SendMessages'] }
      ]
    });
    await ticket.send(`High ticket for <@${target.id}> (${tier})`);
  }

  client.cooldowns[target.id] = Date.now();
  fs.writeFileSync('data/cooldowns.json', JSON.stringify(client.cooldowns, null, 2));

  if (config.resultWebhook) {
    await fetch(config.resultWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{ title: 'Result', description: `<@${target.id}> → **${tier}**`, color: 0x00ff00 }]
      })
    }).catch(() => {});
  }

  await interaction.reply({ content: `Closed: <@${target.id}> assigned **${tier}**.` });
}
