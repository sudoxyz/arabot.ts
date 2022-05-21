/* SPDX-License-Identifier: MIT
Animal Rights Advocates */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import EVENTS from '../../../lib/logger/events.js';
import TOPICS from '../../../lib/logger/topics.js';

export default class DiscordReadyLoggingEvent extends Listener<
  typeof Events.ClientReady
> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.ClientReady,
    });
  }

  async run(): Promise<void> {
    return this.container.logger.debug(
      'Ready event emitted',
      TOPICS.DISCORD,
      EVENTS.READY,
    );
  }
}
