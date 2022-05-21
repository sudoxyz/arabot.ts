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
            'https://gitlab.com/Leftclickchris/arabot/-/raw/sapphire-typescript/assets/img/cow.png',
          )
          .setTitle('Animal Rights Advocates Discord Bot')
          .setURL('https://gitlab.com/Leftclickchris/arabot')
          .addFields(
            [
              {
                name: 'Invites',
                value: `🔗 [Join the Animal Rights Advocates Discord](https://discord.gg/animalrights)`,
              },
              {
                name: 'Source',
                value:
                  '🦊 [Gitlab](https://discord.gg/animalrights)\n' +
                  '🐙 [Github](https://discord.gg/animalrights)\n' +
                  '🥺 Bot Is Currently Closed Source',
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
                value: [
                  '🖱️ <@134002739255574536> - Senior Developer',
                  '💮 <@260991585230127105> - Developer',
                  '❗ <@113703834051805184> - Developer',
                  '💙 <@789937509383143455> - Developer',
                ].join('\n'),
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
