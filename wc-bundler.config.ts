import type { CoreConfig } from 'wc-bundler';

const Config: CoreConfig = {
  babel: {
    env: {
      targets: {
        node: '10',
      },
    },
  },
};

export default Config;
