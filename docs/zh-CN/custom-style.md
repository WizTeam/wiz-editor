# 自定义文字样式

选中文字后，可以给文字添加任意的css样式。

例如：

```ts
editor.applyTextCustomStyle('style-border');
```

其中自定义样式名，必须以`style-`开头。然后在页面内（或者引入的css文件内），声明这个样式，例如：

```css
.style-border {
  border: 1px solid blue;
}
```

可以通过[自定义菜单](./custom-context-menu.md)，来执行添加样式的功能。也可以通过添加工具栏按钮等方式添加样式。
