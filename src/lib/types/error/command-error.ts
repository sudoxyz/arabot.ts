/* SPDX-License-Identifier: MIT
Animal Rights Advocates */

/**
 * Represents an error that occurred due to a user's actions.
 */
export default class CommandError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CommandError';
    this.message = message;
  }
}
