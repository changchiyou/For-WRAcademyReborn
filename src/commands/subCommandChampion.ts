import { LANES, RANK_RANGES } from '@/constants/game.js';
import ApplicationCommand from '@/templates/ApplicationCommand.js';
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';

const { ENABLE_SUBCOMMAND_CHAMPION } = process.env;

const command = ENABLE_SUBCOMMAND_CHAMPION?.toLowerCase() === 'true' ? new ApplicationCommand({ data: new SlashCommandBuilder()
    .setName('champion')
    .setDescription('Champion commands')
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('info')
        .setDescription('顯示指定的英雄資訊')
        .addStringOption((option) =>
          option
            .setName('champion_name')
            .setDescription('英雄名稱')
            .setRequired(true)
            .setAutocomplete(true),
        ),
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('lanechamps')
        .setDescription('顯示指定路線的英雄列表')
        .addStringOption((option) =>
          option
            .setName('lane')
            .setDescription('指定路線')
            .setRequired(true)
            .addChoices(
              Object.entries(LANES).map(([, v]) => ({
                name: v.name,
                value: v.value,
              })),
            ),
        ),
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('random')
        .setDescription(
          '隨機顯示指定路線或所有路線的英雄（1至10個，預設為1個）',
        )
        .addStringOption((option) =>
          option
            .setName('lane')
            .setDescription('指定路線')
            .setRequired(true)
            .addChoices(
              Object.entries(LANES).map(([, v]) => ({
                name: v.name,
                value: v.value,
              })),
            ),
        )
        .addIntegerOption((option) =>
          option
            .setName('count')
            .setDescription('隨機選擇英雄的數量（1至10）')
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(10),
        )
        .addBooleanOption((option) =>
          option
            .setName('wr_only')
            .setDescription('限於已在激鬥峽谷存在的英雄（預設為true）')
            .setRequired(false),
        ),
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('team')
        .setDescription(
          '從各路線（Top, JG, Mid, ADC, Sup）隨機選擇2名英雄，共計10名（無重複）',
        )
        .addBooleanOption((option) =>
          option
            .setName('wr_only')
            .setDescription('限於已在激鬥峽谷存在的英雄（預設為true）')
            .setRequired(false),
        ),
    )
    .addSubcommandGroup(
      new SlashCommandSubcommandGroupBuilder()
        .setName('stats')
        .setDescription('英雄統計數據')
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('winrate')
            .setDescription('顯示個別英雄在激鬥峽谷中的勝率')
            .addStringOption((option) =>
              option
                .setName('champion_name')
                .setDescription('英雄名稱')
                .setRequired(true)
                .setAutocomplete(true),
            )
            .addStringOption((option) =>
              option
                .setName('rank')
                .setDescription('指定段位（預設為大師以上）')
                .setRequired(false)
                .addChoices(
                  Object.entries(RANK_RANGES).map(([, v]) => ({
                    name: v.name,
                    value: v.value,
                  })),
                ),
            )
            .addStringOption((option) =>
              option
                .setName('lane')
                .setDescription('指定路線（預設為英雄規定路線）')
                .setRequired(false)
                .addChoices(
                  Object.entries(LANES).map(([, v]) => ({
                    name: v.name,
                    value: v.value,
                  })),
                ),
            ),
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('lanewinrate')
            .setDescription('顯示各路線勝率前五名')
            .addStringOption((option) =>
              option
                .setName('rank')
                .setDescription('指定段位（預設為大師以上）')
                .setRequired(false)
                .addChoices(
                  Object.entries(RANK_RANGES).map(([, v]) => ({
                    name: v.name,
                    value: v.value,
                  })),
                ),
            )
            .addStringOption((option) =>
              option
                .setName('lane')
                .setDescription('指定路線（預設為全部）')
                .setRequired(false)
                .addChoices(
                  Object.entries(LANES).map(([, v]) => ({
                    name: v.name,
                    value: v.value,
                  })),
                ),
            ),
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('pickrate')
            .setDescription('顯示各路線選取率前五名')
            .addStringOption((option) =>
              option
                .setName('rank')
                .setDescription('指定段位（預設為大師以上）')
                .setRequired(false)
                .addChoices(
                  Object.entries(RANK_RANGES).map(([, v]) => ({
                    name: v.name,
                    value: v.value,
                  })),
                ),
            )
            .addStringOption((option) =>
              option
                .setName('lane')
                .setDescription('指定路線（預設為全部）')
                .setRequired(false)
                .addChoices(
                  Object.entries(LANES).map(([, v]) => ({
                    name: v.name,
                    value: v.value,
                  })),
                ),
            )
            .addBooleanOption((option) =>
              option
                .setName('banrate')
                .setDescription('考慮禁用率（預設為false）')
                .setRequired(false),
            ),
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('strength')
            .setDescription('顯示各路線系統評分前五名')
            .addStringOption((option) =>
              option
                .setName('rank')
                .setDescription('指定段位（預設為大師以上）')
                .setRequired(false)
                .addChoices(
                  Object.entries(RANK_RANGES).map(([, v]) => ({
                    name: v.name,
                    value: v.value,
                  })),
                ),
            )
            .addStringOption((option) =>
              option
                .setName('lane')
                .setDescription('指定路線（預設為全部）')
                .setRequired(false)
                .addChoices(
                  Object.entries(LANES).map(([, v]) => ({
                    name: v.name,
                    value: v.value,
                  })),
                ),
            ),
        ),
    ),
  hasSubCommands: true,
}) : new ApplicationCommand({
  data: new SlashCommandBuilder().setName('empty').setDescription('empty command'),
  hasSubCommands: false,
  execute: async () => {
    // empty execute-function
  },
});

export default command;
