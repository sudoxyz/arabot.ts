/* SPDX-License-Identifier: MIT
Animal Rights Advocates */

// eslint-disable-next-line node/no-missing-import
import { sep } from 'node:path';
import {
  Args,
  Command,
  CommandOptions,
  PieceContext,
} from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { right } from 'fp-ts/lib/Either.js';
import BotCommand, { CommandEither } from '../../lib/types/bot-command.js';
import BotResult from '../../lib/types/bot-result.js';
import { ReadonlyDiscordEmbedField } from '../../lib/types/util.js';
import CommandError from '../../lib/types/error/command-error.js';
import InternalError from '../../lib/types/error/internal-error.js';

export default class HelpCommand extends BotCommand {
  constructor(context: PieceContext) {
    super(context, {
      aliases: ['h', 'man', 'manual', 'guide', 'usage'],
      name: 'help',
      description: 'Sends a helpful message.',
    });
  }

  async messageRun(
    message: Message,
    commandArguments: Args,
  ): Promise<CommandEither> {
    return commandArguments
      .start()
      .peekResult('string')
      .then((result) =>
        result.success ? commandArguments.peek('string') : undefined,
      )
      .then((commandKey) =>
        commandKey
          ? this.container.stores.get('commands').get(commandKey) ??
            Promise.reject(
              new CommandError(`There is no command called ${commandKey}`),
            )
          : undefined,
      )

      .then((command) =>
        command
          ? right(
              new BotResult(
                `Name: ${command.name} - Description: ${
                  command.description
                } - Detailed Description: ${command.detailedDescription.toString()} - Aliases: ${command.aliases.toLocaleString()} - Enabled: ${String(
                  command.enabled,
                )}`,
                new MessageEmbed()
                  .setAuthor({
                    name: this.container.client.user?.username ?? 'ARA Bot',
                  })
                  .setColor('RANDOM')
                  .setDescription(command.description)
                  .setFooter({ text: 'To see all commands try ???????????????? alone' })
                  .setThumbnail(
                    'https://camo.githubusercontent.com/262d5c2c3a0fe9f055680e79aa4a6239fe4564c1ebf2c249c249b92324dce721/68747470733a2f2f6d656469612e646973636f72646170702e6e65742f6174746163686d656e74732f3839343639383237313537373130383533342f3933373631313038343037303831333732362f486e65742e636f6d2d696d6167652e706e67',
                  )
                  .setTitle(command.name)
                  .setURL(
                    process.env['GIT_BRANCH'] ??
                      'https://github.com/Animal-Rights-Advocates-Discord/arabot.ts',
                  )
                  .addFields(
                    [
                      {
                        name: 'Category',
                        value: this.generateCategoryString(command)
                          .map(
                            (categorySubstring) =>
                              categorySubstring.charAt(0).toLocaleUpperCase() +
                              categorySubstring.slice(1),
                          )
                          .join(' '),
                      },
                      {
                        name: 'Details',
                        value: command.detailedDescription.toString(),
                      },
                      {
                        name: 'Aliases',
                        value: command.aliases.toLocaleString(),
                      },
                    ].filter(
                      (field: {
                        readonly name: string;
                        readonly value: string;
                      }) => field.value.length > 0,
                    ),
                  ),
                {
                  printResult: false,
                  sendPayload: true,
                },
              ),
            )
          : undefined,
      )

      .then(async (result) => ({
        result,
        printableCommands:
          result ??
          (await Promise.all(
            this.store
              .filter((piece): piece is BotCommand => 'preconditions' in piece)

              .map(async (command) =>
                command.preconditions.messageRun(message, command),
              ),
          )),
      }))
      .then(
        (complexResult) =>
          complexResult.result ?? complexResult.printableCommands,
      )
      .then(async (result) =>
        !Array.isArray(result)
          ? 'right' in result
            ? right(result.right)
            : Promise.reject(
                new InternalError('No Successful Help Could Be Given'),
              )
          : right(
              new BotResult(
                this.store.keys().toLocaleString(),
                new MessageEmbed()
                  .setAuthor({
                    name: this.container.client.user?.username ?? 'ARA Bot',
                    iconURL:
                      this.container.client.user?.displayAvatarURL() ?? '',
                    url: 'https://github.com/Animal-Rights-Advocates-Discord/arabot.ts',
                  })
                  .setColor('RANDOM')
                  .setFooter({
                    text: 'To see more details try ???????????????? [????????????????????????????]',
                  })
                  .setThumbnail(
                    'https://camo.githubusercontent.com/262d5c2c3a0fe9f055680e79aa4a6239fe4564c1ebf2c249c249b92324dce721/68747470733a2f2f6d656469612e646973636f72646170702e6e65742f6174746163686d656e74732f3839343639383237313537373130383533342f3933373631313038343037303831333732362f486e65742e636f6d2d696d6167652e706e67',
                  )
                  .setTitle('Read Detailed Documentation And Source Code Here')
                  .setURL(
                    'https://github.com/Animal-Rights-Advocates-Discord/arabot.ts',
                  )
                  .addField(
                    'Server Prefix Options',
                    (await this.container.client.fetchPrefix(message))
                      // eslint-disable-next-line unicorn/no-await-expression-member
                      ?.toLocaleString() ??
                      `No prefix set, mention me (${
                        this.container.client.user?.toString() ?? 'this bot'
                      }) instead!`,
                  )
                  .addFields(
                    [...this.store.values()]
                      .filter(
                        (piece): piece is BotCommand => 'description' in piece,
                      )
                      .filter((_command, index) => result[index]?.success)

                      .map((printableCommand) => ({
                        name: printableCommand.name,
                        value: printableCommand.description,
                      }))
                      .sort(
                        (
                          formerField: ReadonlyDiscordEmbedField,
                          latterField: ReadonlyDiscordEmbedField,
                        ) => (formerField.name > latterField.name ? 1 : -1),
                      ),
                  ),
                {
                  printResult: false,
                  sendPayload: true,
                },
              ),
            ),
      );
  }

  private generateCategoryString(command: Command<Args, CommandOptions>) {
    return command instanceof BotCommand
      ? command.fullCategory
      : this.location.full
          .split(sep)
          .slice(this.location.full.split(sep).indexOf('commands') + 1, -1);
  }
}
