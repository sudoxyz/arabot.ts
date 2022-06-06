/* SPDX-License-Identifier: MIT
Animal Rights Advocates */

import { AllFlowsPrecondition } from '@sapphire/framework';
import {
  Message,
  GuildMember,
  Role,
  CacheType,
  CommandInteraction,
  ContextMenuInteraction,
} from 'discord.js';
import ROLES from '../../lib/ara/roles.js';

declare module '@sapphire/framework' {
  interface Preconditions {
    readonly NonVeganModeratorOnly: never;
  }
}

export default class NonVeganModeratorOnly extends AllFlowsPrecondition {
  public override async messageRun(message: Message<boolean>) {
    return message.member
      ? this.checkIfModerator(message.member)
      : this.notGuildError();
  }

  public override async chatInputRun(
    interaction: CommandInteraction<CacheType>,
  ) {
    return interaction.member instanceof GuildMember
      ? this.checkIfModerator(interaction.member)
      : this.notGuildError();
  }

  public override async contextMenuRun(
    interaction: ContextMenuInteraction<CacheType>,
  ) {
    // eslint-disable-next-line ternary/no-unreachable
    return interaction.member instanceof GuildMember
      ? this.checkIfModerator(interaction.member)
      : this.notGuildError();
  }

  private async checkIfModerator(member: GuildMember) {
    return !member.roles.cache.some(
      (role: Readonly<Role>) => role.id === ROLES.B12,
    )
      ? this.error({
          message:
            'This command can only be used by users who can moderate non-vegans.',
        })
      : this.ok();
  }

  private async notGuildError() {
    return this.error({ message: 'This command can only be used in a guild.' }); // TODO: Fetch From ARA
  }
}
