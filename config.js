import dotenv from 'dotenv';

dotenv.config();

export default {
  token: process.env.DISCORD_TOKEN,
  guildId: process.env.GUILD_ID,
  requestChannelId: process.env.REQUEST_CHANNEL_ID,
  waitlistChannelId: process.env.WAITLIST_CHANNEL_ID,
  testerRoleId: process.env.TESTER_ROLE_ID,
  highTicketCategoryId: process.env.HIGH_TICKET_CATEGORY_ID,
  resultWebhook: process.env.RESULT_WEBHOOK,
  cooldownMs: Number(process.env.COOLDOWN_DAYS || 7) * 24 * 60 * 60 * 1000,
  regions: (process.env.REGIONS || 'NA,EU,AS').split(',').map(r => r.trim()),
  tierRoles: {
    HT1: process.env.ROLE_HT1,
    HT2: process.env.ROLE_HT2,
    HT3: process.env.ROLE_HT3,
    HT4: process.env.ROLE_HT4,
    HT5: process.env.ROLE_HT5,
    LT1: process.env.ROLE_LT1,
    LT2: process.env.ROLE_LT2,
    LT3: process.env.ROLE_LT3,
    LT4: process.env.ROLE_LT4,
    LT5: process.env.ROLE_LT5
  },
  tierChoices: [
    { name: 'HT1', value: 'HT1' },
    { name: 'HT2', value: 'HT2' },
    { name: 'HT3', value: 'HT3' },
    { name: 'HT4', value: 'HT4' },
    { name: 'HT5', value: 'HT5' },
    { name: 'LT1', value: 'LT1' },
    { name: 'LT2', value: 'LT2' },
    { name: 'LT3', value: 'LT3' },
    { name: 'LT4', value: 'LT4' },
    { name: 'LT5', value: 'LT5' }
  ]
};
