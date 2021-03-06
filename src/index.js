/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import RulesOfHooks from './RulesOfHooks';
import ExhaustiveDeps from './ExhaustiveDeps';

export const configs = {
  recommended: {
    plugins: ['react-hooks2'],
    rules: {
      'react-hooks2/rules-of-hooks': 'error',
      'react-hooks2/exhaustive-deps': 'warn',
    },
  },
};

export const rules = {
  'rules-of-hooks': RulesOfHooks,
  'exhaustive-deps': ExhaustiveDeps,
};
