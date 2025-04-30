import { fetchChampionData } from '@/data/championData.js';
import { fetchWildRiftData } from '@/data/wildriftRss.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import logger from '@/utils/logger.js';
import { Colors, EmbedBuilder, type ChatInputCommandInteraction } from 'discord.js';

// Subcommand to fetch and update game data
export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      await interaction.deferReply();

      if (interaction.user.id !== client.application?.owner?.id) {
        await interaction.editReply({
          embeds: [interactionErrorEmbed('❌你沒有權限使用這個命令。')],
        });
        return;
      }

      // Send initial status message
      const initialEmbed = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setDescription('開始更新數據...');
      await interaction.editReply({ embeds: [initialEmbed] });

      // Update champion data and show progress
      const championEmbed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setDescription('正在更新英雄數據...');
      await interaction.editReply({ embeds: [championEmbed] });
      await fetchChampionData();

      // Update Wild Rift data and show progress
      const wildRiftEmbed = new EmbedBuilder()
        .setColor(Colors.Purple)
        .setDescription('正在更新激鬥峽谷數據...');
      await interaction.editReply({ embeds: [wildRiftEmbed] });
      await fetchWildRiftData();

      // Send completion message
      const successEmbed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setDescription('✅ 已完成所有數據的更新！');
      await interaction.editReply({ embeds: [successEmbed] });
    } catch (error) {
      // Handle and log any errors during the update process
      logger.error('更新數據時發生錯誤:', error);
      await interaction.editReply({
        embeds: [
          interactionErrorEmbed(
            '❌更新數據時發生錯誤。\n請檢查日誌以獲取更多信息。',
          ),
        ],
      });
    }
  },
});
