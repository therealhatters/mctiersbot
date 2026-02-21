import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('setup')
  .setDescription('Post the request message');

export async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setTitle('Evaluation Testing Waitlist')
    .setDescription('Upon applying, you will be added to a waitlist channel.\nHere you will be pinged when a tester of your region is available.\nIf you are HT3 or higher, a high ticket will be created.\n\n• Region should be the region of the server you wish to test on\n\n• Username should be the name of the account you will be testing on\n\n**Failure to provide authentic information will result in a denied test.**')
    .setColor('#ff0000');

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('verify_account').setLabel('Verify Account').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('enter_waitlist').setLabel('Enter Waitlist').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('view_cooldown').setLabel('View Cooldown').setStyle(ButtonStyle.Secondary)
  );

  await interaction.channel.send({ embeds: [embed], components: [row] });
  await interaction.reply({ content: 'Setup complete.', ephemeral: true });
}