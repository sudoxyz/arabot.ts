/* SPDX-License-Identifier: MIT
Animal Rights Advocates */

import { MessageEmbed, MessageOptions, MessagePayload } from 'discord.js';

/**
 * Represents the results of a command that has completed with success.
 */
export default class BotResult {
  public readonly message: string;

  public readonly payload: MessagePayload | MessageOptions;

  public readonly options: ARAResultOptions;

  /**
   *
   * @param resultMessage - The message to send to the user.
   * @param outputPackage - A payload to send to the user. Can be an Embed, or a MessagePayload.
   * @param resultOptions - Toggle options for display.
   */
  constructor(
    resultMessage: string,
    outputPackage?: MessageEmbed | MessagePayload | MessageOptions,
    resultOptions?: ARAResultOptions,
  ) {
    this.message = resultMessage ?? 'no result message given';
    this.message =
      resultMessage ||
      (outputPackage instanceof MessageEmbed && outputPackage.description
        ? outputPackage.description
        : 'no result message given');
    this.payload = ((testablePackage): testablePackage is MessageEmbed =>
      testablePackage instanceof MessageEmbed)(outputPackage)
      ? { embeds: [outputPackage] }
      : outputPackage ?? { content: resultMessage };
    this.options = resultOptions ?? { printResult: false, sendPayload: false };
  }
}

/**
 * Whether to print the result in Message.content, and whether to send the payload.
 */
export type ARAResultOptions = {
  readonly printResult?: boolean;
  readonly sendPayload?: boolean;
};
