/* SPDX-License-Identifier: MIT
Animal Rights Advocates */

import { SapphireClient } from '@sapphire/framework';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import BotLogger, { BotLogLevel } from './lib/logger/bot-logger.js';
import EVENTS from './lib/logger/events.js';
import TOPICS from './lib/logger/topics.js';

const client = new SapphireClient({
  defaultPrefix: process.env.DEFAULT_PREFIX ?? null, // eslint-disable-line unicorn/no-null -- SapphirePrefix is string | string[] | null
  intents: [
    'GUILDS',
    'GUILD_BANS',
    'GUILD_INVITES',
    'GUILD_MEMBERS',
    'GUILD_MESSAGES',
    'GUILD_VOICE_STATES',
    'GUILD_WEBHOOKS',
  ],
  logger: {
    instance: new BotLogger(BotLogLevel.Trace),
  },
  partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
  presence: {
    afk: false,
    status: 'online',
    activities: [{ name: `${process.env.DEFAULT_PREFIX ?? '<@mention>'}help` }],
  },
  loadMessageCommandListeners: true,
  loadDefaultErrorListeners: false,
  baseUserDirectory: `${path.dirname(fileURLToPath(import.meta.url))}`,
});

client
  .login(process.env.DISCORD_TOKEN ?? '')
  // eslint-disable-next-line functional/no-return-void
  .then(() =>
    client.logger.info(
      `Logged In. Running in ${process.env.NODE_ENV ?? 'unknown'}`,
      TOPICS.DISCORD,
      EVENTS.INIT,
    ),
  )
  // eslint-disable-next-line functional/no-return-void
  .catch(() =>
    client.logger.fatal('Could Not Log In.', TOPICS.DISCORD, EVENTS.ERROR),
  );

export default client;
