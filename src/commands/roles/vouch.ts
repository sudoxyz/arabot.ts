/* SPDX-License-Identifier: MIT
Animal Rights Advocates */

import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';
import { right } from 'fp-ts/lib/Either.js';
import { createClient } from 'edgedb';
import BotCommand, { CommandEither } from '../../lib/types/bot-command.js';
import BotResult from '../../lib/types/bot-result.js';
import edge from '../../../dbschema/edgeql-js/index.mjs';

/**
 * Vouches a nonvegan member to be a part of the social section.
 */
export default class VouchCommand extends BotCommand {
  /**
   * {@inheritdoc}
   * @param context - the context of the command.
   */
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      aliases: ['social', 'butterfly'],
      description: 'Gives social section permissions.',
      detailedDescription: 'Adds a user to the social section of ARA.',
      name: 'vouch',
      preconditions: ['GuildOnly', 'VeganOnly'],
    });
  }

  /**
   * @param message - The message calling the command.
   * @returns - A promise that resolves to the result of the command, either the vouched user for social, the state of vouching, or an error.
   */
  async messageRun(message: Message): Promise<CommandEither> {
    const client = createClient();
    const query = edge.select(edge.GuildMember, () => ({ snowflake: true }));
    const result = await query.run(client);
    return right(
      new BotResult(
        `Vouched ${this.name} ${result.toString()} - ${message.author.tag}`,
      ),
    );
  }
}
