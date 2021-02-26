# 演示：添加自定义工具栏按钮/菜单

在创建编辑器的时候，可以通过选项，增加自定义按钮和菜单项。

![自定义右键菜单](./assets/custom-context-menu.png)

下面是一个例子：

```ts
// 当用户点击菜单的时候，将会执行相应的方法
function handleMenuItemClicked(item: MenuItemData) {
  console.log(item);
  assert(currentEditor);
  if (item.id === 'get-selected-text') {
    alert(`selected text: ${currentEditor.getSelectedText()}`);
  } else if (item.id === 'add-border') {
    currentEditor.applyTextCustomStyle('style-border');
  } else if (item.id === 'add-strikethrough') {
    currentEditor.applyTextCustomStyle('style-strikethrough');
  }
  ...
}

function handleGetBlockCommand(editor: Editor, block: BlockElement, detail: SelectionDetail, type: 'fixed' | 'hover' | 'menu'): CommandItemData[] {
  if (!blockUtils.isTextTypeBlock(block)) {
    return [];
  }
  //
  const ret: CommandItemData[] = [];
  if (type === 'menu') {
    // 自定义右键菜单
    if (detail.collapsed) {
      ret.push({
        id: 'toHeading2',
        text: '转换为 标题二（demo）',
        shortCut: '',
        disabled: false,
        onClick: handleMenuItemClicked,
      }, {
        id: 'toOrderedList',
        text: '转换为 有序列表（demo）',
        shortCut: '',
        disabled: false,
        onClick: handleMenuItemClicked,
      }, {
        id: 'toUnorderedList',
        text: '转换为 无序列表（demo）',
        shortCut: '',
        disabled: false,
        onClick: handleMenuItemClicked,
      });
    }
    assert(detail.startBlock);
    const blockType = blockUtils.getBlockType(detail.startBlock);
    if (blockType === BLOCK_TYPE.LIST) {
      ret.push({
        id: 'list/indent',
        text: '列表增加缩进（demo）',
        shortCut: '',
        disabled: false,
        onClick: handleMenuItemClicked,
      }, {
        id: 'list/outdent',
        text: '列表减少缩进（demo）',
        shortCut: '',
        disabled: false,
        onClick: handleMenuItemClicked,
      });
    }
    return ret;
  }

  // 自定义浮动工具栏按钮
  if (type === 'hover') {
    ret.push(
      {
        id: 'add-border',
        text: '添加边框',
        shortCut: '',
        disabled: false,
        onClick: handleMenuItemClicked,
      },
      {
        id: 'add-strikethrough',
        text: '添加删除线',
        shortCut: '',
        disabled: false,
        onClick: handleMenuItemClicked,
      },
    );
  }

  // 自定义block 固定显示的按钮（block右侧）
  if (type === 'fixed') {
    ret.push({
      id: 'insert-project',
      text: '插入项目',
      shortCut: '',
      disabled: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M22 11V3h-7v3H9V3H2v8h7V8h2v10h4v3h7v-8h-7v3h-2V8h2v3h7zM7 9H4V5h3v4zm10 6h3v4h-3v-4zm0-10h3v4h-3V5z"></path></svg>',
      data: block,
      onClick: handleMenuItemClicked,
    });
  }

  return ret;
}

...

const options = {
    ...
    callbacks: {
      ...
      // 设置自定义按钮/菜单回调方法
      onGetBlockCommand: handleGetBlockCommand,
    },
  };
};
```



