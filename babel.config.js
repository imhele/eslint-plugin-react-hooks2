'use strict';

module.exports = {
  presets: ['@babel/preset-react', '@babel/preset-typescript'].map(resolveBabelPluginItem),
};

function resolveBabelPluginItem(plugin) {
  if (typeof plugin === 'string') return resolveBabelPluginItemPath(plugin);
  if (Array.isArray(plugin) && typeof plugin[0] === 'string')
    return [resolveBabelPluginItemPath(plugin[0])].concat(plugin.slice(1));
  return plugin;
}

function resolveBabelPluginItemPath(name) {
  try {
    return require.resolve(name);
  } catch (error) {}
  return require.resolve(name, { paths: [require.resolve('wc-bundler')] });
}
