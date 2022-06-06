/* SPDX-License-Identifier: MIT
Animal Rights Advocates */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import EVENTS from '../../../lib/logger/events.js';
import TOPICS from '../../../lib/logger/topics.js';

export default class DiscordDebugLoggingEvent extends Listener<
  typeof Events.Debug
> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.Debug,
    });
  }

  async run(info: string): Promise<void> {
    return this.container.logger.debug(info, TOPICS.DISCORD, EVENTS.DEBUG);
  }
}
