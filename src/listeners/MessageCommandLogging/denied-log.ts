/* SPDX-License-Identifier: MIT
Animal Rights Advocates */

import {
  MessageCommandDeniedPayload,
  Listener,
  Events,
  PieceContext,
  UserError,
} from '@sapphire/framework';
import EVENTS from '../../lib/logger/events.js';
import TOPICS from '../../lib/logger/topics.js';

export default class MessageCommandDeniedLoggingEvent extends Listener<
  typeof Events.MessageCommandDenied
> {
  constructor(context: PieceContext) {
    const options = {
      event: Events.MessageCommandDenied,
    };
    super(context, options);
  }

  public async run(
    error: Readonly<UserError>,

    { message, command }: MessageCommandDeniedPayload,
  ): Promise<void> {
    this.container.logger.debug(
      `Command: [${command.name}] - Message: [${message.content}] Error: [${error.message}]`,
      TOPICS.SAPPHIRE,
      EVENTS.COMMAND_DENIED,
    );
  }
}
