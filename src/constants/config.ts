/**
 * Bot configuration constants
 */
export default {
  prefix: '!',
  urlChampions: 'https://ry2x.github.io/WildRift-Merged-Champion-Data/data_zh_TW.json',
  urlRssWildRift: 'https://ry2x.github.io/wildrift-feeds/wildrift-news-ja-jp.json',
  urlWinRate: 'https://mlol.qt.qq.com/go/lgame_battle_info/hero_rank_list_v2',
  SUPPORTED_FILE_EXTENSIONS: ['.js', '.ts'],
  championError: {
    notFound: '❌ 找不到對應的英雄。',
    notAvailable: '❌這個英雄在激鬥峽谷中不可用。',
    invalidRank: '❌指定段位無效。',
    invalidChampion: '❌未指定英雄名稱。',
  },
  ButtonError: {
    timeOut: '❌此按鈕已過3分鐘無法使用。',
    invalidUser: '❌非此用戶無法使用按鈕。',
  },
  LeaderBoardError: {
    invalidServer: '❌此服務器無法使用。',
    noData: '❌排行榜中沒有數據。',
  },
} as const;
