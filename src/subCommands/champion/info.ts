import config from '@/constants/config.js';
import { LANES, ROLES } from '@/constants/game.js';
import { getChampionByName } from '@/data/championData.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import { type Champion } from '@/types/champs.js';
import { Colors, EmbedBuilder, MessageFlags, type ChatInputCommandInteraction } from 'discord.js';

/**
 * Champion level display configuration
 */
const CHAMPION_LEVEL_DISPLAY = {
  0: '⬜⬜⬜',
  1: '🟦⬜⬜',
  2: '🟨🟨⬜',
  3: '🟧🟧🟧',
} as const;

/**
 * Champion information error messages
 */
const CHAMPION_ERROR_MESSAGES = {
  NO_NAME: config.championError.invalidChampion,
  NOT_FOUND: (name: string) => `❌英雄「${name}」未找到。`,
} as const;

/**
 * Gets the lanes a champion can play in
 * @param champion - The champion to get lanes for
 * @returns Formatted string of lanes
 */
export function getLanes(champion: Champion): string {
  return Object.entries(LANES)
    .filter(([, lane]) => champion.lanes.includes(lane.value))
    .map(([, lane]) => `${lane.emoji}: ${lane.name}`)
    .join(', ');
}

/**
 * Gets the tags/classes of a champion
 * @param champion - The champion to get tags for
 * @returns Formatted string of tags
 */
export function getTags(champion: Champion): string {
  return Object.entries(ROLES)
    .filter(([, tag]) => champion.roles.includes(tag.value))
    .map(([, tag]) => `${tag.name}: ${tag.emoji}`)
    .join(', ');
}

/**
 * Creates a champion info embed
 * @param champion - The champion to create the embed for
 * @returns Champion info embed
 */
export function createChampionEmbed(champion: Champion): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(Colors.Orange)
    .setTitle(champion.name)
    .setDescription(champion.is_free ? `${champion.title}   免費英雄✅` : champion.title)
    .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${champion.id}.png`);

  const levelDisplay = (level: number) =>
    CHAMPION_LEVEL_DISPLAY[level as keyof typeof CHAMPION_LEVEL_DISPLAY];

  return embed.addFields(
    {
      name: champion.is_wr
        ? '<:Icon_WR:1342960956036218942> <:Icon_LOL:1342961477224497232>'
        : '<:Icon_LOL:1342961477224497232>',
      value: `能量類型 : ${champion.type}`,
    },
    { name: '路線', value: getLanes(champion), inline: true },
    { name: '角色', value: getTags(champion), inline: true },
    { name: '難度', value: levelDisplay(champion.difficult), inline: true },
    { name: '傷害', value: levelDisplay(champion.damage), inline: true },
    { name: '生存力', value: levelDisplay(champion.survive), inline: true },
    { name: '輔助性能', value: levelDisplay(champion.utility), inline: true },
    {
      name: '簡介',
      value: champion.describe.length > 1024 ? champion.describe.slice(0, 1024) : champion.describe,
    },
  );
}

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const championName = interaction.options.getString('champion_name');

    if (!championName) {
      await interaction.reply({
        embeds: [interactionErrorEmbed(CHAMPION_ERROR_MESSAGES.NO_NAME)],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const champion = getChampionByName(championName);
    if (!champion) {
      await interaction.reply({
        embeds: [interactionErrorEmbed(CHAMPION_ERROR_MESSAGES.NOT_FOUND(championName))],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.reply({ embeds: [createChampionEmbed(champion)] });
  },
});
