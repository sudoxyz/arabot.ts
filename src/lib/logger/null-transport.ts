/* SPDX-License-Identifier: MIT
Animal Rights Advocates */

import Transport, { TransportStreamOptions } from 'winston-transport';

export default class NullTransport extends Transport {
  public constructor(options: TransportStreamOptions) {
    super(options);
  }

  public override log(
    info: readonly unknown[],
    callback: { (transport: Readonly<NullTransport>): void },
  ): readonly unknown[] {
    callback(this);
    return info;
  }
}
