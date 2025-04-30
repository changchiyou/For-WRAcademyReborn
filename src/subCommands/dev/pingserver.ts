import { pingEmbed } from '@/embeds/pingEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  type ChatInputCommandInteraction,
} from 'discord.js';

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const ping = client.ws.ping.toString();

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`devping-${ping}`)
        .setLabel('📟公開發佈')
        .setStyle(ButtonStyle.Danger),
    );

    await interaction.reply({
      embeds: [pingEmbed(ping)],
      components: [button],
      flags: MessageFlags.Ephemeral,
    });
  },
});
