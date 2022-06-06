/* SPDX-License-Identifier: MIT
Animal Rights Advocates */

import { NODE_DEVELOPMENT } from '../../config.js';

enum TestRoles {
  B12 = '977795528538607646',
  SOCIAL_VOUCHED = '977795528521826312',
  VEGAN = '977795528538607640',
}

enum Roles {
  B12 = '826157475815489598',
  SOCIAL_VOUCHED = '976303030544773120',
  VEGAN = '788114978020392982',
}

export default process.env['NODE_ENV'] === NODE_DEVELOPMENT ? TestRoles : Roles;
