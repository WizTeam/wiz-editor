# 通过cdn使用WizEditor

可以直接使用jsdelivr来加载编辑器代码(可以自行替换所需的版本号)

```
https://cdn.jsdelivr.net/npm/wiz-editor@0.0.44/client/src/index.js
```

## 代码

```html
<script src='https://cdn.jsdelivr.net/npm/wiz-editor@0.0.44/client/src/index.js' charset="utf-8"></script>

<script>
const {
  Editor,
  createEditorPromise,
  assert,
  BlockElement,
  blockUtils,
  containerUtils,
  CommandItemData,
  MenuItem,
  domUtils,
  getEditor,
  AuthMessage,
  OnProgress,
  EditorOptions,
  SelectionDetail,
  EditorDoc,
} = window.WizEditor;
</script>
```
