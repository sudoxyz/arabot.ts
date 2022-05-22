/* SPDX-License-Identifier: MIT
Animal Rights Advocates */

import { PieceContext } from '@sapphire/framework';
import { bold, compose, underline } from 'discord-md-tags';
import { MessageEmbed } from 'discord.js';
import { right } from 'fp-ts/lib/Either.js';
import BotCommand, { CommandEither } from '../../lib/types/bot-command.js';
import BotResult from '../../lib/types/bot-result.js';
import { ReadonlyDiscordEmbedField } from '../../lib/types/util.js';

export default class AboutCommand extends BotCommand {
  constructor(context: PieceContext) {
    super(context, {
      aliases: ['a', 'arabot', 'botinfo', 'arabotinfo', 'bot'],
      name: 'about',
      description: 'Sends details about ARABot.',
      detailedDescription:
        'Prints out detailed information for ARABot. Includes a bot invite, discord server invite, source code, social media, donation pages, and version information.',
    });
  }

  async messageRun(): Promise<CommandEither> {
    return right(
      new BotResult(
        'Printed ARABot Details',
        new MessageEmbed()
          .setAuthor({
            name:
              process.env.npm_package_name ??
              this.container.client.user?.username ??
              'ARA',
            iconURL: this.container.client.user?.displayAvatarURL() ?? '',
          })
          .setColor('AQUA')
          .setDescription(
            'ARABot is a feature-rich Discord Bot written in TypeScript with modern frameworks and highly opinionated style choices. In particular it is programmed by the Animal Rights Advocates Community to help create a functional animal rights platform on Discord.',
          )
          .setFooter({
            text: 'ARABot is programmed under the MIT License - Join our Developer team by using the ?apply command',
          })
          .setThumbnail(
            'https://camo.githubusercontent.com/262d5c2c3a0fe9f055680e79aa4a6239fe4564c1ebf2c249c249b92324dce721/68747470733a2f2f6d656469612e646973636f72646170702e6e65742f6174746163686d656e74732f3839343639383237313537373130383533342f3933373631313038343037303831333732362f486e65742e636f6d2d696d6167652e706e67',
          )
          .setTitle('Animal Rights Advocates Discord Bot')
          .setURL(
            'https://github.com/Animal-Rights-Advocates-Discord/arabot.ts',
          )
          .addFields(
            [
              {
                name: 'Invites',
                value: `🔗 [Join the Animal Rights Advocates Discord](https://discord.gg/animalrights)`,
              },
              {
                name: 'Source',
                value:
                  '🐙 [Github](https://github.com/Animal-Rights-Advocates-Discord/arabot.ts)\n',
              },
              {
                name: 'Socials',
                value:
                  // eslint-disable-next-line no-secrets/no-secrets -- For YouTube
                  '▶️ [YouTube](https://www.youtube.com/channel/UCQvMZHWocuR9tUVCN2I8Jzw)\n' +
                  '📷 [Instagram](https://www.instagram.com/animalrightsadvocates/)\n' +
                  '🐦 [Twitter](https://discord.gg/animalrights)',
              },
              {
                name: 'Donate',
                value: '💰 [Patreon](https://www.patreon.com/araofficial)\n',
              },
              {
                name: 'Developers',
                value: ['💙 <@789937509383143455> - Senior Developer'].join(
                  '\n',
                ),
              },
              {
                name: 'Version',
                value: `${
                  process.env.COMMIT ??
                  process.env.npm_package_version ??
                  'No Version Information Available'
                }`,
              },
            ].map((field: ReadonlyDiscordEmbedField) => ({
              name: compose(bold, underline)`${field.name}`,
              value: field.value,
            })),
          ),
        {
          printResult: false,
          sendPayload: true,
        },
      ),
    );
  }
}
