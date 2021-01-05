# 创建自定义的 embed block

wiz-editor支持增加自定义的embed类型的block。这种block类似与图片，视频, Office文件等这样的block，用户可以将光标定位在这种block前面后者后面，但是不能将光标定位在block里面。

block内容是一个任意的HTMLElement，里面也可以包含任意元素。

embed block定义：

```ts
export interface EmbedData {
  [index: string]: any;
};

export interface Embed {
  // 返回一个EmbedElement（就是HTMLElement）
  createElement(editor: Editor, data: EmbedData): EmbedElement;
  // 保存数据： 从EmbedElement里面保存数据
  saveData(editor: Editor, embed: EmbedElement): EmbedData;
  // 更新数据（例如从服务器更新新的数据）到界面（dom）
  updateData(editor: Editor, embed: EmbedElement, data: EmbedData): void;
  // 获取工具栏按钮，可以不实现
  getToolbarOptions?: (block: BlockElement, target: Element) => ToolbarOptions | null;
};
```

实现Embed之后，需要进行注册：

```ts
import {
  embedUtils,
} from 'wiz-editor/client';

const buttonsEmbed = {
  createElement,
  saveData,
  updateData,
};

embedUtils.registerEmbed('buttons' as EMBED_TYPE, buttonsEmbed);
```

[查看例子](../../h5/src/index.ts)

