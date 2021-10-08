# `eslint-plugin-react-hooks2`

Fork of
[eslint-plugin-react-hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)
with the following enhanced and additional options：

- `additionalHooks` : A regex to match the names of custom Hooks that have
  dependencies, or an array of hook names and arguments array indicies to
  indicate which argument(s) are functions, and which is the dependencies
  array. A configuration like
  `["useCustomMemo", ["useCallbacks", [0, 1]], ["useDelay", 0, 2]]` is equal to
  `[["useCustomMemo", 0, 1], ["useCallbacks", [0, 1], 2], ["useDelay", 0, 2]]`,
  which is equal to
  `[["useCustomMemo", [0], 1], ["useCallbacks", [0, 1], 2], ["useDelay", [0], 2]]`,
  meaning the `useCustomMemo(fn, deps)` takes a function as the first argument
  and dependencies as the second, `useCallbacks(fn1, fn2, deps)` takes a
  function as the first and second argument and dependencies as the third
  argument, and `useDelay(fn, delay, deps)` takes a function as the first, and 
  dependencies as the third argument.
- `immediateRefHooks` : A regex to match the name of hooks that return a `Ref`
  that can immediately be used in a `useEffect()` callback.
- `stableRefHooks` : A regex to match the name of hooks returning a value that
  will maintain its object reference during the lifecycle of the component,
  similar to `useRef()`.
- `stableStateHooks` : An array of hook names and return array indicies to
  indicate return values similar to `useState()`. A configuration like
  `["useModel", ["useToggle", [1, 2]]]` is equal to
  `[["useModel", 1], ["useToggle", [1, 2]]]`, which is equal to
  `[["useModel", [1]], ["useToggle", [1, 2]]]`, meaning the second item in the
  return value of `useModel()` and the second and third items in the return
  value of `useToggle()` will maintain their object references throughout the
  lifecycle of the component.

Example：

```json
{
  "rules": {
    // ...
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        "additionalHooks": ["useCustomMemo", ["useCallbacks", [0, 1]], ["useDelay", 0, 2]],
        "immediateRefHooks": "^use(ImmedValueRef)$",
        "stableRefHooks": "^use(CombinedRef|Constant|ImmedValueRef|RefCallback|RefGetter)$",
        "stableStateHooks": ["useModel", ["useToggle", [1, 2]]]
      }
    ]
  }
}
```

---

> The following is the original text of the eslint-plugin-react-hooks README.

This ESLint plugin enforces the [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html).

It is a part of the [Hooks API](https://reactjs.org/docs/hooks-intro.html) for React.

## Installation

**Note: If you're using Create React App, please use `react-scripts` >= 3 instead of adding it directly.**

Assuming you already have ESLint installed, run:

```sh
# npm
npm install eslint-plugin-react-hooks --save-dev

# yarn
yarn add eslint-plugin-react-hooks --dev
```

Then extend the recommended eslint config:

```js
{
  "extends": [
    // ...
    "plugin:react-hooks/recommended"
  ]
}
```

### Custom Configuration

If you want more fine-grained configuration, you can instead add a snippet like this to your ESLint configuration file:

```js
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## Advanced Configuration

`exhaustive-deps` can be configured to validate dependencies of custom Hooks with the `additionalHooks` option. This option accepts a regex to match the names of custom Hooks that have dependencies.

```js
{
  "rules": {
    // ...
    "react-hooks/exhaustive-deps": ["warn", {
      "additionalHooks": "(useMyCustomHook|useMyOtherCustomHook)"
    }]
  }
}
```

We suggest to use this option **very sparingly, if at all**. Generally saying, we recommend most custom Hooks to not use the dependencies argument, and instead provide a higher-level API that is more focused around a specific use case.

## Valid and Invalid Examples

Please refer to the [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html) documentation and the [Hooks FAQ](https://reactjs.org/docs/hooks-faq.html#what-exactly-do-the-lint-rules-enforce) to learn more about this rule.

## License

MIT
