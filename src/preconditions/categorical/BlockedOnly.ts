/* SPDX-License-Identifier: MIT
Animal Rights Advocates */

import { AllFlowsPrecondition } from '@sapphire/framework';

declare module '@sapphire/framework' {
  interface Preconditions {
    readonly BlockedOnly: never;
  }
}

export default class BlockedPrecondition extends AllFlowsPrecondition {
  public override async messageRun() {
    return this.block();
  }

  public override async chatInputRun() {
    return this.block();
  }

  public override async contextMenuRun() {
    return this.block();
  }

  private async block() {
    return this.error({ message: 'This command cannot be run.' });
  }
}
