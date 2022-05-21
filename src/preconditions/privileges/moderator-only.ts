/* SPDX-License-Identifier: MIT
Animal Rights Advocates */

import { Precondition, PreconditionResult } from '@sapphire/framework';
import { Message, GuildMember, Role } from 'discord.js';

declare module '@sapphire/framework' {
  interface Preconditions {
    readonly ModeratorOnly: never;
  }
}

export default class ModeratorOnly extends Precondition {
  public run(message: Message): PreconditionResult {
    return !message.member
      ? this.error({
          message:
            'This command can only be used inside of guilds, and by guild moderators.',
        })
      : this.checkIfModerator(message.member);
  }

  private checkIfModerator(member: GuildMember): PreconditionResult {
    return member.roles.cache.some(
      (role: Readonly<Role>) => role.name === 'Moderator',
    ) && member.manageable
      ? this.error({
          message: 'This command can only be used by server moderators.',
        })
      : this.ok();
  }
}
