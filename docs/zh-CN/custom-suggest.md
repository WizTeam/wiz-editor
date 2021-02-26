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


如果要创建一个box，可以通过点击按钮直接插入这个box，并且进入编辑状态（类似飞书在任务中插入结束日期的方式），则可以按照下面的方式实现：

```ts
// -------------------- project list
const PROJECT_BOX_TYPE = 'project';
(() => {
  interface ProjectBoxData extends BoxData {
    projectId: string;
    projectName: string;
  };

  function createNode(editor: Editor, data: BoxData): BoxNode {
    //
    const { projectName } = data as ProjectBoxData;
    //
    return {
      classes: ['box-mention'],
      children: [{
        type: 'text',
        text: projectName,
      } as BoxTextChild],
    };
  }

  function handleBoxInserted(editor: Editor, data: BoxData,
    block: BlockElement, pos: number): void {
    assert(pos >= 0);
    const projectData = data as ProjectBoxData;
    console.log('project box inserted:', projectData);
  }

  function handleBoxClicked(editor: Editor, data: BoxData, block: BlockElement): void {
    const projectData = data as ProjectBoxData;
    assert(block);
    editor.editBox(projectData, block);
  }

  const PROJECT_LIST: {
    projectId: string;
    projectName: string;
  }[] = [];
  for (let i = 0; i < 10; i++) {
    PROJECT_LIST.push({
      projectId: `${i}`,
      projectName: `项目${i}`,
    });
  }

  async function getItems(editor: Editor, keywords: string): Promise<AutoSuggestData[]> {
    assert(keywords !== undefined);
    //
    return [{
      iconUrl: '',
      text: '',
      id: '',
      data: '',
    }];
  }

  function createBoxDataFromItem(editor: Editor, item: AutoSuggestData): BoxTemplateData {
    const data: ProjectBoxData = item.data;
    return {
      projectId: data.projectId,
      projectName: data.projectName,
    };
  }

  async function createBoxData(editor: Editor) {
    assert(editor);
    return {
      projectId: '',
      projectName: 'Please select a project',
    };
  }

  // 渲染下拉框。 我们只有一个item，在这里返回item的内容
  function renderAutoSuggestItem(editor: Editor, suggestData: AutoSuggestData, options: AutoSuggestOptions): HTMLElement {
    assert(suggestData);
    assert(options);
    assert(options.data);
    assert(options.data.boxData);
    const boxData = options.data.boxData as ProjectBoxData;
    const boxElem = editor.getBoxById(boxData.id);
    assert(boxElem);
    const block = containerUtils.getParentBlock(boxElem);
    assert(block);
    //
    const div = document.createElement('div');
    domUtils.addClass(div, 'editor-project-box');
    div.onclick = (event) => {
      event.stopPropagation();
    };
    //
    const projectSelect = domUtils.createElement('select', ['project-control'], div) as HTMLSelectElement;
    //
    PROJECT_LIST.forEach((project) => {
      const option = document.createElement('option');
      option.text = project.projectName;
      option.value = project.projectId;
      projectSelect.options.add(option);
    });

    projectSelect.onchange = () => {
      const index = projectSelect.selectedIndex;
      const option = projectSelect.options[index];
      boxData.projectName = option.text;
      boxData.projectId = option.value;
      editor.updateBoxData(boxData.id, {
        ...boxData,
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const updateData = (boxData: ProjectBoxData) => {
      projectSelect.value = boxData.projectId;
    };

    updateData(boxData);
    //
    return div;
  }

  const projectBox = {
    customSuggest: true,
    insertDefaultThenEdit: true, // 插入一个默认的box，然后进入编辑状态
    createNode,
    getItems,
    handleBoxInserted,
    handleBoxClicked,
    createBoxDataFromItem,
    createBoxData,
    renderAutoSuggestItem,
  };

  boxUtils.registerBoxType(PROJECT_BOX_TYPE as BOX_TYPE, projectBox);
})();


function handleMenuItemClicked(event: Event, item: CommandItemData) {
  console.log(item);
  assert(currentEditor);
  if (item.id === 'insert-project') {
    const block = item.data as BlockElement;
    if (currentEditor.getSelectionDetail().startBlock !== block) {
      currentEditor.selectBlock(block, -1, -1);
    }
    currentEditor.insertEmptyBox(PROJECT_BOX_TYPE as any);
  }
}

function handleGetBlockCommand(editor: Editor, block: BlockElement, detail: SelectionDetail, type: 'fixed' | 'hover' | 'menu'): CommandItemData[] {
  if (!blockUtils.isTextTypeBlock(block)) {
    return [];
  }
  // 在text block 后面增加一个fixed的按钮，点击按钮，可以插入一个project
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

// editor options
const options = {
  ...
  callbacks: {
    ...
    onGetBlockCommand: handleGetBlockCommand,
  },
};
```

[完整的例子](../../h5/src/custom.ts)

运行demo：
```
cd h5
npm run custom
```