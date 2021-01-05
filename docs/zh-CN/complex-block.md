# 创建自定义的 embed block

wiz-editor支持增加自定义的complex类型的block。这种block类似与表格，code这样的block。
这种block里面，又包含了一个或者多个container，每一个container里面，都可以进行独立编辑，
插入除了complex block之外的所有block（也可以仅允许插入指定类型的block，例如code）。

要实现一个complex 类型的block，必须实现下面的方法

```ts
export interface Block {
  //block options
  getBlockOptions?: () => BlockOptions;
  createBlockTemplateData: (editor: Editor, options: any) => BlockTemplateData;
  createBlockContent: (editor: Editor, id: string, data: BlockData) => BlockContentElement;
  updateBlockData: (block: BlockElement, data: BlockData) => void;
  saveData: (block: BlockElement) => BlockData;
  getChildContainersData?: (block: BlockElement) => ContainerData[];
  getCaretPos: (block: BlockElement, node: Node, nodeOffset: number) => number;
  createRange: (block: BlockElement, pos: number) => Range;
  getSubContainerInComplexBlock?: (block: BlockElement, element: HTMLElement, type: 'top' | 'right' | 'bottom' | 'left') => ContainerElement | null;
  replaceChildrenId?: (doc: EditorDoc, data: DocBlock) => void;
}
```

实现Block之后，需要进行注册：

```ts
import {
  blockUtils,
} from 'wiz-editor/client';

const testBlock = {
  ...
};

blockUtils.registerEmbed('test-block' as BLOCK_TYPE, testBlock);
```

[查看例子](../../h5/src/index.ts)
