# `eslint-plugin-react-hooks2`

> [English version](https://github.com/imhele/eslint-plugin-react-hooks2/blob/main/README.en.md) , provided by [@forivall](https://github.com/forivall).

基于 [eslint-plugin-react-hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks) 修改的版本，新增/强化了以下配置：

> 配置项概览，点击以跳转：
>
> - [`additionalHooks`](#additionalhooks)
> - [`immediateRefHooks`](#immediateRefHooks)
> - [`stableRefHooks`](#stableRefHooks)
> - [`stableStateHooks`](#stableStateHooks)
> - [完整配置示例](#完整配置示例)

### `additionalHooks`

> 由 [@forivall](https://github.com/forivall) 贡献。

#### 说明

与此配置匹配的 Hook 将被视为存在依赖项与副作用函数，也就是被认为类似 `useEffect()` ，本规则将对副作用函数中引用到的外部变量进行分析，以检查依赖项是否存在遗漏。

#### 用法

- 基础用法：

  - 描述：与 eslint-plugin-react-hooks 用法相同，可以配置为一个正则表达式以匹配 Hook （传入字符串将被直接转换为正则表达式）。
  - 示例：以下面的配置为例，满足正则表达式 `/^use(MyEffect|CustomEffect)$/` 的 Hook 有 `useMyEffect(effect, deps)` 与 `useCustomEffect(effect, deps)` ，它们的第一项入参将被视为副作用函数、第二项入参将被视为依赖项，并对二者进行分析以给出提示。

    ```json
    {
      "additionalHooks": "^use(MyEffect|CustomEffect)$"
    }
    ```

- 自定义参数位置：

  - 描述：配置为一个数组，数组的每一项可以是如下几种类型：

    1. `string` ：**精确**匹配 Hook ，并将其第一项入参视为副作用函数、第二项入参视为依赖项；
    2. `[reactHookName: string, effectArgumentIndexes: number | number[]]` ：根据 reactHookName **精确**匹配 Hook 、将 effectArgumentIndexes 指向的参数视为副作用函数、将 max(effectArgumentIndexes) + 1 位置的参数视为依赖项；
    3. `[reactHookName: string, effectArgumentIndexes: number | number[], depsArgumentIndex: number]` ：根据 reactHookName **精确**匹配 Hook 、将 effectArgumentIndexes 指向的参数视为副作用函数、将 depsArgumentIndex 位置的参数视为依赖项。

  - 针对上述几种类型的配置，分别给出示例：

    1. 以下面的配置为例，匹配到的 Hook 有 `useMyEffect(effect, deps)` 与 `useCustomEffect(effect, deps)` ，它们的第一项入参将被视为副作用函数、第二项入参将被视为依赖项，并对二者进行分析以给出提示。

       ```json
       {
         "additionalHooks": ["useMyEffect", "useCustomEffect"]
       }
       ```

    2. 以下面的配置为例，匹配到的 Hook 有 `useMyEffect(options, firstEffect, secondEffect, deps)` ，它们的第二项和第三项入参将被视为副作用函数、第四项入参将被视为依赖项，并对三者进行分析以给出提示。

       ```json
       {
         "additionalHooks": [["useMyEffect", [1, 2]]]
       }
       ```

    3. 以下面的配置为例，匹配到的 Hook 有 `useMyEffect(deps, effect)` ，它的第二项入参将被视为副作用函数、第一项入参将被视为依赖项，并对二者进行分析以给出提示。

       ```json
       {
         "additionalHooks": [["useMyEffect", [1], 0]]
       }
       ```

> [回到顶部](#eslint-plugin-react-hooks2)

### `immediateRefHooks`

#### 说明

与此配置匹配的 Hook 的返回值将被视为立即引用，在 `useEffect()` 清理函数中取用时不会报警，也不会要求加入依赖项。

#### 用法

- 描述：可以配置为一个正则表达式以匹配 Hook （传入字符串将被直接转换为正则表达式）。
- 示例：以下面的配置为例，满足正则表达式 `/^use(My|Custom)Ref$/` 的 Hook 有 `useMyRef()` 与 `useCustomRef()` ，它们将被视为类似 `useRef()` 的 Hook ，也就是返回的内容不会被要求加入 `useEffect()` 或是 `useCallback()` 的依赖项；此外，它们返回的内容在 `useEffect()` 清理函数中使用时，也不会抛出错误。

  ```json
  {
    "immediateRefHooks": "^use(My|Custom)Ref$"
  }
  ```

  ```js
  function MyComponent() {
    const ref = useRef();
    const myRef = useMyRef();

    useEffect(() => {
      return () => {
        // 如果 ref.current 没有在组件内被赋值过，
        // 那么在 useEffect 清理函数中直接使用时 eslint 会给出警告
        console.log(ref.current);
        // 但是配置了 immediateRefHooks 的 useMyRef() 返回的 myRef 不会给出警告，
        // 也不会要求将 myRef 加入 useEffect() 的依赖项
        console.log(myRef.current);
      };
    }, []);

    return null;
  }
  ```

> [回到顶部](#eslint-plugin-react-hooks2)

### `stableRefHooks`

#### 说明

与此配置匹配的 Hook 的返回值将被视为组件挂载期间不会发生变化，也就是被认为类似 `useRef()` 。

#### 用法

- 描述：可以配置为一个正则表达式（传入字符串将被直接转换为正则表达式）以匹配 Hook 。
- 示例：以下面的配置为例，满足正则表达式 `/^use(My|Custom)Ref$/` 的 Hook 有 `useMyRef()` 与 `useCustomRef()` ，它们将被视为类似 `useRef()` 的 Hook ，也就是返回的内容不会被要求加入 `useEffect()` 或是 `useCallback()` 的依赖项。

  ```json
  {
    "stableRefHooks": "^use(My|Custom)Ref$"
  }
  ```

  ```js
  function MyComponent() {
    const myRef = useMyRef();
    const myUnstableRef = useMyUnstableRef();

    useEffect(() => {
      // 在 useEffect 或是 useCallback 中使用 myRef 不会要求加入依赖项
      console.log(myRef.current);
      // 但是 myUnstableRef 会被要求加入依赖项，因为 stableRefHooks 选项没有匹配上 useMyUnstableRef()
      console.log(myUnstableRef.current);
    }, []);

    return null;
  }
  ```

> [回到顶部](#eslint-plugin-react-hooks2)

### `stableStateHooks`

#### 说明

与此配置匹配的 Hook 的返回数组的某些项目将被视为组件挂载期间不会发生变化，不会被要求加入 `useEffect()` 或是 `useCallback()` 的依赖项，也就是被认为类似 `useState()` 。

#### 用法

- 描述：配置为一个数组，数组的每一项可以是如下几种类型：

  1. `string` ：**正则**匹配 Hook ，并将其返回的数组的第二项入参视为组件挂载期间不会发生变化；
  2. `[reactHookName: string, stableElementIndexes: number | number[]]` ：根据 reactHookName **精确**匹配 Hook 、将 Hook 返回的数组中 stableElementIndexes 位置的元素视为组件挂载期间不会发生变化；

- 针对上述几种类型的配置，分别给出示例：

  1. 以下面的配置为例，匹配到的 Hook 有 `useModel()` ，它返回的数组的第二项入参视为组件挂载期间不会发生变化。

     ```json
     {
       "stableStateHooks": ["^use.*Model$"]
     }
     ```

     ```js
     function MyComponent() {
       const [state, actions] = useMyModel();

       useEffect(() => {
         // 在 useEffect 或是 useCallback 中使用 actions 不会要求加入依赖项
         actions.updateState({ hello: 1 });
       }, []);

       return null;
     }
     ```

  2. 以下面的配置为例，匹配到的 Hook 有 `useToggle()` ，它返回的数组的第二项和第三项入参视为组件挂载期间不会发生变化。

     ```json
     {
       "stableStateHooks": [["^useToggle$", [1, 2]]]
     }
     ```

     ```js
     function MyComponent(props) {
       const { visible } = props;
       const [isModalVisible, showModal, hideModal] = useToggle(false);

       useEffect(() => {
         // 在 useEffect 或是 useCallback 中使用 showModal / hideModal 不会要求加入依赖项
         if (visible) showModal();
         else hideModal();
       }, [visible]);

       return null;
     }
     ```

> [回到顶部](#eslint-plugin-react-hooks2)

### 完整配置示例

```json
{
  "rules": {
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

> [回到顶部](#eslint-plugin-react-hooks2)

---

> 以下是 eslint-plugin-react-hooks README 原文。

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
