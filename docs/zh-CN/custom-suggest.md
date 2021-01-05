# 自定义插入box下拉框

wiz-editor可以在插入box之前，通过自定义auto suggest，让用户在插入box之前进行内容输入，从而生成特定的box。例如可以让用户在一个日历组件中选择日期，然后再插入。下面是一个例子：

```ts
// -------------------- custom render suggest
// 定义box类型
const CUSTOM_SUGGEST_BOX_TYPE = 'custom_render';

(() => {
  // box数据内容
  interface CustomSuggestBoxData extends BoxData {
    text: string;
  };

  // 定义box dom结构
  function createNode(editor: Editor, data: BoxData): BoxNode {
    assert(data);
    const boxData = data as CustomSuggestBoxData;
    return {
      classes: ['box-mention'],
      children: [{
        type: 'text',
        text: boxData.text,
      } as BoxTextChild],
    };
  }

  // 当box被插入之后调用
  function handleBoxInserted(editor: Editor, data: BoxData,
    block: BlockElement, pos: number): void {
    assert(pos >= 0);
    const boxData = data as CustomSuggestBoxData;
    console.log(`project box inserted: ${boxData.text}`);
  }

  // 响应box被点击事件
  function handleBoxClicked(editor: Editor, data: BoxData): void {
    assert(data);
    const boxData = data as CustomSuggestBoxData;
    alert(`custom suggest clicked: ${boxData.text}`);
  }

  // 获取item。只需要返回一个item（我们会自定义这个item的渲染）
  async function getItems(editor: Editor, keywords: string): Promise<AutoSuggestData[]> {
    console.log(keywords);
    return [{
      iconUrl: '',
      text: '',
      id: 'custom-suggest-id',
      data: null,
    }];
  }

  // 通过item返回数据，不会被调用。我们会自己控制插入的box数据
  function createBoxDataFromItem(editor: Editor, item: AutoSuggestData): BoxTemplateData {
    assert(item);
    return {};
  }

  // 屏蔽内置的item点击事件，避免点击的时候将auto suggest被自动关闭
  function handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  // 渲染下拉框。 我们只有一个item，在这里返回item的内容
  function renderAutoSuggestItem(editor: Editor, suggestData: AutoSuggestData): HTMLElement {
    assert(suggestData);
    const div = document.createElement('div');
    div.style.minHeight = '100px';
    div.style.minWidth = '300px';
    div.style.width = '100%';
    div.style.cursor = 'auto';
    div.style.border = '1px sold #ccc';
    div.style.backgroundColor = 'white';
    //
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    //
    const textArea = document.createElement('textarea');
    div.appendChild(textArea);
    textArea.style.userSelect = 'auto';
    textArea.style.flexGrow = '1';
    textArea.style.padding = '8px';
    const button = document.createElement('button');
    button.innerText = 'OK';
    div.appendChild(button);
    //
    // 屏蔽点击事件。避免autosuggest自动关闭
    div.onclick = handleClick;
    //
    // 注意保存光标位置
    const selectionState = editor.saveSelectionState();
    //
    setTimeout(() => {
      // 自动将焦点设置到textarea里面
      textArea.focus();
    }, 100);
    //
    button.onclick = () => {
      const text = textArea.value.replace(/\n/g, ' ');
      // 恢复光标
      editor.restoreSelectionState(selectionState);
      // 根据用户输入的内容，插入box
      editor.insertBox(CUSTOM_SUGGEST_BOX_TYPE as BOX_TYPE, null, {
        text,
      }, {});
      // 关闭auto suggest
      editor.closeAutoSuggest();
    };
    //
    return div;
  }

  const customSuggestBox = {
    customSuggest: true,
    createNode,
    getItems,
    handleBoxInserted,
    handleBoxClicked,
    createBoxDataFromItem,
    renderAutoSuggestItem,
  };

  boxUtils.registerBoxType(CUSTOM_SUGGEST_BOX_TYPE as BOX_TYPE, customSuggestBox);
})();

...

document.getElementById('custom-suggest')?.addEventListener('click', () => {
  assert(currentEditor);
  // 在光标位置，请求显示auto suggest，让用户输入一个特定的box data
  currentEditor.insertBox(CUSTOM_SUGGEST_BOX_TYPE as any, null, {}, {
    showAutoSuggest: true,
  });
});
```
