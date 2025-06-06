import config from '@/constants/config.js';
import { type LANES, RANK_EMOJIS, type RANK_RANGES, WIN_RATE_DEFAULTS } from '@/constants/game.js';
import { getChampByHeroId, getLanePositionSets } from '@/data/championData.js';
import { getTopChampionsByWinRate } from '@/data/winRate.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import type { LaneKey } from '@/types/game.js';
import { type HeroStats } from '@/types/winRate.js';
import { getIsFloating } from '@/utils/formatUtils.js';
import { getRankRange } from '@/utils/rankUtils.js';
import { type ChatInputCommandInteraction, Colors, EmbedBuilder } from 'discord.js';

/**
 * Creates a formatted string for a champion's win rate statistics
 * @param stat - The champion's statistics
 * @param index - The rank index (0-4)
 * @returns Formatted string with rank, name, win rate, and pick rate
 */
function formatChampionStats(stat: HeroStats, index: number): string {
  const champion = getChampByHeroId(stat.hero_id);
  const rankEmoji = RANK_EMOJIS[index];

  return (
    `${rankEmoji}:**${champion?.name}**\n` +
    `┗ ⚔️:${stat.win_rate_percent ?? '-'}% ${getIsFloating(stat?.win_rate_float ?? null)}` +
    `  ⚒️:${stat.appear_rate_percent ?? '-'}% ${getIsFloating(stat?.appear_rate_float ?? null)}`
  );
}

/**
 * Creates a field for win rate statistics of a specific lane
 * @param lane - The lane configuration
 * @param rank - The rank configuration
 * @returns Formatted field value with top 5 champions
 */
function createWinRateField(
  lane: { apiParam: (typeof LANES)[keyof typeof LANES]['apiParam'] },
  rank: { apiParam: (typeof RANK_RANGES)[keyof typeof RANK_RANGES]['apiParam'] },
): string {
  const stats = getTopChampionsByWinRate(lane.apiParam, rank.apiParam, 5);
  return stats.map((stat, index) => formatChampionStats(stat, index)).join('\n');
}

/**
 * Creates an embed for lane win rate statistics
 * @param targetLanes - Array of lane configurations
 * @param rank - The rank configuration
 * @returns Embed with lane win rate statistics
 */
function createLaneWinRateEmbed(
  targetLanes: (typeof LANES)[keyof typeof LANES][],
  rank: (typeof RANK_RANGES)[keyof typeof RANK_RANGES],
): EmbedBuilder {
  const fields = targetLanes
    .filter((lane) => lane.value !== 'all')
    .map((lane) => {
      const fieldValue = createWinRateField(lane, rank).toString();
      return {
        name: `${lane.name}での勝率${lane.emoji}`,
        value: fieldValue.length > 0 ? fieldValue : '❌データがありません。',
      };
    });
  return new EmbedBuilder()
    .setTitle(`各レーンでの勝率トップ:${rank.emoji}${rank.name}`)
    .setDescription('⚔️:勝率 ⚒️:ピック率')
    .setColor(Colors.Aqua)
    .addFields(fields);
}

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    const rankValue = interaction.options.getString('rank', false) ?? WIN_RATE_DEFAULTS.RANK;
    const laneValue = interaction.options.getString('lane', false) ?? WIN_RATE_DEFAULTS.LANE;

    const rank = getRankRange(rankValue);
    if (!rank) {
      await interaction.editReply({
        content: '',
        embeds: [interactionErrorEmbed(config.championError.invalidRank)],
      });
      return;
    }

    const targetLanes = getLanePositionSets(laneValue as LaneKey);
    const embed = createLaneWinRateEmbed(targetLanes, rank);

    await interaction.editReply({ embeds: [embed] });
  },
});
