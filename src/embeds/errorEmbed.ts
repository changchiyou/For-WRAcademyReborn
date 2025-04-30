import { Colors, EmbedBuilder, MessageFlags, type InteractionReplyOptions } from 'discord.js';

export function interactionErrorEmbed(msg: string): EmbedBuilder {
  return new EmbedBuilder().setColor(Colors.Red).setTitle(msg);
}

export const interactionError: InteractionReplyOptions = {
  embeds: [interactionErrorEmbed('❌執行指令時發生錯誤！')],
  flags: MessageFlags.Ephemeral,
};
