/* eslint-disable no-alert */
// eslint-disable-next-line import/no-unresolved
import EncryptJWT from 'jose/jwt/encrypt';
import {
  Box,
  BOX_TYPE,
  EditorUser,
  BLOCK_TYPE,
  LANGS,
  createEditor,
  Editor,
  boxUtils,
  assert,
  genId,
  AutoSuggestData,
  MentionBoxData,
  BoxNode,
  BoxData,
  BoxImageChild,
  BoxTextChild,
  BlockElement,
  BoxTemplateData,
  blockUtils,
  docData2Text,
  CommandItemData,
  SelectionDetail,
  SelectedBlock,
  selectionUtils,
  CommandStatus,
  TextCommand,
  EmbedData,
  EmbedElement,
  EMBED_TYPE,
  embedUtils,
  RichTextDocument,
  BlockData,
  BlockContentElement,
  ContainerElement,
  containerUtils,
  BlockOptions,
  EditorDoc,
  DocBlock,
  BlockCommand,
  CommandParams,
  ContainerData,
  Block,
  AutoSuggestOptions,
  domUtils,
  getCurrentCommandBlock,
  getEditor,
  EditorOptions,
} from 'wiz-editor/client';
import { AuthMessage, AuthPermission } from 'wiz-editor/commons/auth-message';

const AppId = '_LC1xOdRp';
const AppSecret = '714351167e39568ba734339cc6b997b960ed537153b68c1f7d52b1e87c3be24a';
const AppDomain = 'wiz.cn';

let currentEditor: Editor | null;

// -------------------custom embed block----------------

const CALENDAR_IMAGE_URL = 'https://www.wiz.cn/wp-content/new-uploads/b75725f0-4008-11eb-8f21-01eb48012b63.jpeg';

(() => {
  interface EmbedButtonsData extends EmbedData {
    count?: number;
  }

  function handleButtonClick(event: Event) {
    const button = event.target as HTMLButtonElement;
    alert(`you clicked button ${button.innerText}`);
  };
  //

  function createElement(editor: Editor, data: EmbedData): EmbedElement {
    assert(data);
    const div = document.createElement('div');
    const child = document.createElement('div');
    div.appendChild(child);
    //
    const buttonsData = data as EmbedButtonsData;
    const count = buttonsData.count || 10;
    //
    div.setAttribute('data-count', `${count}`);
    //
    for (let i = 0; i < count; i++) {
      const button = document.createElement('button');
      button.innerText = `button-${i}`;
      button.onclick = handleButtonClick;
      child.appendChild(button);
    }
    //
    return div as unknown as EmbedElement;
  }

  function saveData(editor: Editor, embed: EmbedElement): EmbedData {
    assert(embed instanceof HTMLDivElement);
    const count = Number.parseInt(embed.getAttribute('data-count') || '10', 10);
    return {
      count,
    };
  }

  function updateData(editor: Editor, embed: EmbedElement, data: EmbedData): void {
    assert(data);
    //
    assert(embed.children.length === 1);
    const child = embed.children[0];
    child.innerHTML = '';
    //
    const buttonsData = data;
    const count = buttonsData.count || 10;
    //
    for (let i = 0; i < count; i++) {
      const button = document.createElement('button');
      button.innerText = `button-${i}`;
      button.onclick = handleButtonClick;
      child.appendChild(button);
    }
  }

  function handleInsertEmbed() {
    const block = getCurrentCommandBlock();
    assert(block);
    const container = containerUtils.getParentContainer(block);
    const index = containerUtils.getBlockIndex(block);
    currentEditor?.insertEmbed(container, index + 1, 'buttons' as any, {
      count: 5,
    });
  }

  function getEmbedOptions() {
    return {
      menuItems: [{
        id: '',
        text: 'Buttons',
        onClick: handleInsertEmbed,
      }],
    };
  }

  const buttonsEmbed = {
    getEmbedOptions,
    createElement,
    saveData,
    updateData,
  };

  embedUtils.registerEmbed('buttons' as EMBED_TYPE, buttonsEmbed);
})();

// ------------------ create a custom complex block -------
const TEST_BLOCK_TYPE = 'test';
(() => {
  interface TestComplexBlockTemplateData {
    imgSrc?: string;
  };

  interface TestComplexBlockData extends TestComplexBlockTemplateData, BlockData {
  }

  function createBlockTemplateData(editor: Editor, options: TestComplexBlockTemplateData) {
    //
    const blocks = [
      blockUtils.createBlockData(editor, BLOCK_TYPE.TEXT, {
        text: new RichTextDocument([]),
      }),
    ];
    //
    const containerId = editor.createEmptyChildContainerData(blocks, genId());
    const children = [containerId];
    //
    return {
      children,
      imgSrc: CALENDAR_IMAGE_URL,
      ...options,
    };
  }

  function createBlockContent(editor: Editor, id: string, data: BlockData): BlockContentElement {
    //
    assert(data);
    const blockData = data as TestComplexBlockData;
    const blockContent = document.createElement('div') as unknown as BlockContentElement;
    blockContent.style.border = '1px solid';
    blockContent.style.display = 'flex';
    blockContent.style.alignItems = 'end';
    const img = document.createElement('img');
    img.src = blockData.imgSrc || CALENDAR_IMAGE_URL;
    blockContent.appendChild(img);
    //
    assert(blockData.children);
    assert(blockData.children.length === 1);
    const subContainerId = blockData.children[0];
    const containerBlocks = editor.getChildContainerData(subContainerId);
    const container = editor.createChildContainer(blockContent, subContainerId, containerBlocks);
    assert(container);
    return blockContent;
  }

  function getChildImage(block: BlockElement): HTMLImageElement {
    assert(blockUtils.isBlock(block));
    assert(blockUtils.getBlockType(block) === (TEST_BLOCK_TYPE as any));
    const content = blockUtils.getBlockContent(block);
    assert(content.children.length === 2);
    assert(content.children[0] instanceof HTMLImageElement);
    return content.children[0];
  }

  function getChildContainer(block: BlockElement): ContainerElement {
    assert(blockUtils.isBlock(block));
    assert(blockUtils.getBlockType(block) === (TEST_BLOCK_TYPE as any));
    const content = blockUtils.getBlockContent(block);
    assert(content.children.length === 2);
    const container = content.children[1] as ContainerElement;
    return container;
  }

  function saveData(block: BlockElement): BlockData {
    assert(block);
    //
    const subContainer = getChildContainer(block);
    const subContainerId = containerUtils.getContainerId(subContainer);
    const children = [subContainerId];
    const id = blockUtils.getBlockId(block);
    const image = getChildImage(block);
    //
    const blockData: TestComplexBlockData = {
      id,
      type: TEST_BLOCK_TYPE as any,
      text: new RichTextDocument([]),
      children,
      imgSrc: image.src,
    };
    return blockData;
  }

  function updateBlockData(block: BlockElement, data: BlockData) {
    //
    const newData = data as TestComplexBlockData;
    //
    const oldData = saveData(block) as TestComplexBlockData;
    assert(oldData.children);
    assert(newData.children);
    assert(oldData.children[0] === newData.children[0]);
    //
    if (oldData.imgSrc !== newData.imgSrc) {
      //
      const image = getChildImage(block);
      image.src = newData.imgSrc || CALENDAR_IMAGE_URL;
    }
  }

  function getChildContainersData(block: BlockElement): ContainerData[] {
    //
    const content = getChildContainer(block);
    const containerId = containerUtils.getContainerId(content);
    const blocks: BlockData[] = [];
    containerUtils.getAllBlocks(content).forEach((childBlock) => {
      const blockData = blockUtils.saveData(childBlock);
      blocks.push(blockData);
    });
    return [{
      id: containerId,
      blocks,
    }];
  }

  // eslint-disable-next-line no-unused-vars
  function getCaretPos(block: BlockElement, node: Node, nodeOffset: number): number {
    const container = getChildContainer(block);
    if (node === container) {
      assert(nodeOffset === 0 || nodeOffset === 1);
      return nodeOffset;
    }
    // sub blocked has been deleted, ignore
    return 0;
  }

  function createRange(block: BlockElement, pos: number): Range {
    assert(block);
    assert(pos === 0 || pos === -1 || pos === 1);
    //
    const container = getChildContainer(block);
    assert(container);
    const blocks = containerUtils.getAllBlocks(container);
    const childBlock = pos === 0 ? blocks[0] : blocks[blocks.length - 1];
    assert(childBlock);
    const offset = pos === 0 ? 0 : -1;
    const ret = blockUtils.createRange(childBlock, offset);
    return ret;
  }

  function getSubContainerInComplexBlock(block: BlockElement,
    element: HTMLElement, type: 'top' | 'right' | 'bottom' | 'left') {
    //
    assert(type);
    return null;
  }

  function handleInsertTestComplexBlock() {
    const block = getCurrentCommandBlock();
    assert(block);
    assert(currentEditor);
    const container = containerUtils.getParentContainer(block);
    const index = containerUtils.getBlockIndex(block);
    const blockData = blockUtils.createBlockData(currentEditor, TEST_BLOCK_TYPE as any);
    currentEditor?.insertBlock(container, index + 1, TEST_BLOCK_TYPE as any, blockData, {
      fromUndo: false,
      localAction: true,
      focusToBlock: true,
    });
  }

  function getBlockOptions(): BlockOptions {
    return {
      textBlock: false,
      complexBlock: true,
      menuItems: [{
        id: '',
        text: 'Test Complex Block',
        onClick: handleInsertTestComplexBlock,
      }],
    };
  }

  function replaceChildrenId(editorDoc: EditorDoc, blockData: DocBlock): void {
    const doc = editorDoc;
    const children = blockData.children;
    assert(children);
    const oldId = children[0];
    assert(oldId);
    const newId = genId();
    doc[newId] = doc[oldId];
    delete doc[oldId];
    // eslint-disable-next-line no-param-reassign
    blockData.children = [newId];
  }

  // eslint-disable-next-line no-unused-vars
  function executeBlockCommand(block: BlockElement, command: BlockCommand, params?: CommandParams): any {
    assert(blockUtils.getBlockType(block) === (TEST_BLOCK_TYPE as any));
    //
  }

  // eslint-disable-next-line no-unused-vars
  function handleBlockLoaded(block: BlockElement) {
    //
  }

  function accept(block: BlockElement, type: BOX_TYPE | BLOCK_TYPE): boolean {
    assert(type);
    // accept all non-complex blocks
    return true;
  }

  const TestComplex: Block = {
    getBlockOptions,
    createBlockTemplateData,
    createBlockContent,
    updateBlockData,
    saveData,
    getChildContainersData,
    getCaretPos,
    createRange,
    getSubContainerInComplexBlock,
    replaceChildrenId,
    executeBlockCommand,
    handleBlockLoaded,
    accept,
  };

  blockUtils.registerBlockType(TEST_BLOCK_TYPE as any, TestComplex);
})();

// -------------------create a custom calendar item----------
(() => {
  const CALENDAR_BOX_TYPE = 'custom-calendar';

  interface CalendarBoxData extends BoxData {
    text: string;
  };

  function createNode(editor: Editor, data: BoxData): BoxNode {
    //
    const { text } = data as CalendarBoxData;
    //
    return {
      classes: ['box-mention'],
      children: [{
        type: 'image',
        src: CALENDAR_IMAGE_URL,
        attributes: {
          class: '.calendar_image',
        },
      } as BoxImageChild, {
        type: 'text',
        text,
      } as BoxTextChild],
    };
  }

  function handleBoxInserted(editor: Editor, data: BoxData,
    block: BlockElement, pos: number): void {
    assert(pos >= 0);
    const calendarData = data as CalendarBoxData;
    console.log('calendar box inserted:', calendarData);
  }

  function handleBoxClicked(editor: Editor, data: BoxData, block: BlockElement): void {
    const calendarData = data as CalendarBoxData;
    alert(`calendar clicked: ${calendarData.text}`);
    assert(block);
  }

  async function getItems(editor: Editor, keywords: string) {
    console.log(keywords);
    return [{
      iconUrl: CALENDAR_IMAGE_URL,
      text: 'Select one event...',
      id: 'selectEvent',
      data: '',
    }, {
      iconUrl: CALENDAR_IMAGE_URL,
      text: 'Create one event...',
      id: 'createEvent',
      data: '',
    }];
  }

  function handleBoxItemSelected(editor: Editor, item: AutoSuggestData): void {
    //
    const pos = editor.saveSelectionState();
    //
    if (item.id === 'selectEvent') {
      alert('select one event');
      //
    } else if (item.id === 'createEvent') {
      alert('create one event');
      //
    }
    //
    if (!editor.restoreSelectionState(pos)) {
      return;
    }
    //
    editor.insertBox(CALENDAR_BOX_TYPE as BOX_TYPE, null, {
      text: new Date().toLocaleDateString(),
    }, {
      deletePrefix: true,
    });
  }

  const calendarBox = {
    prefix: '//',
    createNode,
    getItems,
    handleBoxItemSelected,
    handleBoxInserted,
    handleBoxClicked,
  };

  boxUtils.registerBoxType(CALENDAR_BOX_TYPE as BOX_TYPE, calendarBox);
})();

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
    insertDefaultThenEdit: true,
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
  function handleBoxClicked(editor: Editor, data: BoxData, block: BlockElement): void {
    assert(data);
    const boxData = data as CustomSuggestBoxData;
    alert(`custom suggest clicked: ${boxData.text}`);
    assert(block);
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
  function renderAutoSuggestItem(editor: Editor, suggestData: AutoSuggestData, options: AutoSuggestOptions): HTMLElement {
    assert(suggestData);
    assert(options);
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

// ------------------------ 日期

(() => {
  const DATE_BOX_TYPE = 'date';

  interface DateBoxData extends BoxData {
    text: string;
  };

  function createNode(editor: Editor, data: BoxData): BoxNode {
    //
    const { text } = data as DateBoxData;
    //
    return {
      classes: ['box-mention'],
      children: [{
        type: 'text',
        text,
      } as BoxTextChild],
    };
  }

  function handleBoxInserted(editor: Editor, data: BoxData,
    block: BlockElement, pos: number): void {
    assert(pos >= 0);
    const dateData = data as DateBoxData;
    console.log('date box inserted:', dateData);
  }

  function handleBoxClicked(editor: Editor, data: BoxData, block: BlockElement): void {
    const dateData = data as DateBoxData;
    alert(`date clicked: ${dateData.text}`);
    assert(block);
  }

  async function createBoxData(editor: Editor): Promise<BoxTemplateData | null> {
    assert(editor);
    return {
      text: new Date().toLocaleDateString(),
    };
  }

  const dateBox = {
    prefix: '/date',
    createNode,
    handleBoxInserted,
    handleBoxClicked,
    createBoxData,
  };

  boxUtils.registerBoxType(DATE_BOX_TYPE as BOX_TYPE, dateBox);
})();

(() => {
  const LABEL_BOX_TYPE = 'label';

  interface LabelBoxData extends BoxData {
    color: string;
  };

  function createNode(editor: Editor, data: BoxData): BoxNode {
    //
    const { color } = data as LabelBoxData;
    //
    return {
      classes: [`label-${color}`, 'label'],
      children: [{
        type: 'text',
        text: color,
      } as BoxTextChild],
    };
  }

  function handleBoxInserted(editor: Editor, data: BoxData,
    block: BlockElement, pos: number): void {
    console.log(`insert at ${pos}`);
    const calendarData = data as LabelBoxData;
    console.log('label box inserted:', calendarData);
  }

  function handleBoxClicked(editor: Editor, data: BoxData, block: BlockElement): void {
    const calendarData = data as LabelBoxData;
    alert(`label clicked: ${calendarData.color}`);
    assert(block);
  }
  async function getItems(editor: Editor, keywords: string): Promise<AutoSuggestData[]> {
    console.log(keywords);
    return [{
      iconUrl: '',
      text: 'red',
      id: 'red',
      data: '',
    }, {
      iconUrl: '',
      text: 'green',
      id: 'green',
      data: '',
    }, {
      iconUrl: '',
      text: 'blue',
      id: 'blue',
      data: '',
    }];
  }

  function createBoxDataFromItem(editor: Editor, item: AutoSuggestData): BoxTemplateData {
    const color = item.id;
    return {
      color,
    };
  }

  function renderAutoSuggestItem(editor: Editor, suggestData: AutoSuggestData, options: AutoSuggestOptions): HTMLElement {
    assert(options);
    const div = document.createElement('div');
    div.setAttribute('style', `background-color: ${suggestData.text}; border-radius: 10px; width: 100%; height: 24px`);
    return div;
  }

  const labelBox = {
    prefix: 'll',
    createNode,
    getItems,
    createBoxDataFromItem,
    handleBoxInserted,
    handleBoxClicked,
    renderAutoSuggestItem,
  };

  boxUtils.registerBoxType(LABEL_BOX_TYPE as BOX_TYPE, labelBox);
})();

// this code should run on your server
// eslint-disable-next-line max-len
async function fakeGetAccessTokenFromServer(userId: string, docId: string, permission: AuthPermission): Promise<string> {
  //
  const data = {
    userId,
    docId,
    appId: AppId,
    permission,
  };

  const fromHexString = (hexString: string) => {
    const parts = hexString.match(/.{1,2}/g);
    assert(parts);
    const arr = parts.map((byte) => parseInt(byte, 16));
    return new Uint8Array(arr);
  };
  //
  const key = fromHexString(AppSecret);

  try {
    const accessToken = await new EncryptJWT(data)
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .setIssuedAt()
      .setIssuer(AppDomain)
      .setExpirationTime('1d')
      .encrypt(key);

    return accessToken;
  } catch (err) {
    const res = await fetch(`http://${window.location.host}/token/${AppId}/${docId}/${userId}`);
    const ret = await res.json();
    return ret.token;
  }
}

// --------------------------- mention data ----------------
const NAMES = [
  '龚光杰',
  '褚师弟',
  '容子矩',
  '干光豪',
  '葛光佩',
  '郁光标',
  '吴光胜',
  '唐光雄',
  '枯荣大师',
  '本因大师',
  '本观',
  '本相',
  '本参',
  '本尘',
  '玄愧',
  '玄念',
  '玄净',
  '慧真',
  '慧观',
  '慧净',
  '慧方',
  '慧镜',
  '慧轮',
  '虚清',
  '虚湛',
  '虚渊',
  '摘星子',
  '摩云子',
  '天狼子',
  '出尘子',
  '段延庆',
  '叶二娘',
  '岳老三',
  '云中鹤',
];

const ALL_USERS = [{
  iconUrl: 'https://www.wiz.cn/wp-content/new-uploads/e89745c0-3f7a-11eb-8f21-01eb48012b63.jpeg',
  text: 'Steve',
  id: 'weishijun@wiz.cn',
  data: '',
}, {
  iconUrl: 'https://www.wiz.cn/wp-content/new-uploads/2285af20-4006-11eb-8f21-01eb48012b63.jpeg',
  text: 'zTree',
  id: 'zqg@wiz.cn',
  data: '',
}];

NAMES.forEach((name) => {
  const user = {
    iconUrl: 'https://www.wiz.cn/wp-content/new-uploads/2285af20-4006-11eb-8f21-01eb48012b63.jpeg',
    text: name,
    id: name,
    data: name,
  };
  ALL_USERS.push(user);
});

async function fakeGetMentionItems(editor: Editor, keywords: string): Promise<AutoSuggestData[]> {
  assert(keywords !== undefined);
  console.log(keywords);
  if (!keywords) {
    return ALL_USERS;
  }
  return ALL_USERS.filter((user) => user.text.toLowerCase().indexOf(keywords.toLowerCase()) !== -1);
}

function handleMentionInserted(editor: Editor, boxData: MentionBoxData, block: BlockElement, pos: number) {
  console.log(`mention ${JSON.stringify(boxData)} inserted at ${pos}`);
  const leftText = blockUtils.toText(block, 0, pos);
  const rightText = blockUtils.toText(block, pos + 1, -1);
  const anchorId = `M${boxData.id}`;
  console.log(`anchor id: ${anchorId}, context text:\n\n${leftText}\n\n${rightText}`);
}

function handleMentionClicked(editor: Editor, boxData: MentionBoxData) {
  alert(`you clicked ${boxData.text} (${boxData.mentionId})`);
}

// -------------------tags data --------------------------------------

const ALL_TAGS = [
  'Editor',
  'WizNote',
  'Apple',
  'Software',
  '协同编辑',
  'Web Editor',
];

async function fakeGetTags(editor: Editor, keywords: string): Promise<string[]> {
  assert(keywords !== undefined);
  console.log(keywords);
  if (!keywords) {
    return ALL_TAGS;
  }
  return ALL_TAGS.filter((tag) => tag.toLowerCase().indexOf(keywords.toLowerCase()) !== -1);
}

function handleTagInserted(editor: Editor, tag: string, block: BlockElement, pos: number) {
  console.log(`tag ${tag} inserted at ${pos}`);
}

function handleTagClicked(editor: Editor, tag: string) {
  alert(`you clicked tag ${tag}`);
}

// function handleRenderAutoSuggestItem(suggestData: AutoSuggestData) {
//   const div = document.createElement('div');
//   div.innerText = suggestData.text;
//   return div;
// }
// ---------------------------------------------------------

const urlQuery = new URLSearchParams(window.location.search);
const pageId = urlQuery.get('id') || '_ny9Adsk2';
console.log(`pageGuid: ${pageId}`);

const WsServerUrl = window.location.protocol !== 'https:'
  ? `ws://${window.location.host}`
  : `wss://${window.location.host}`;

const user: EditorUser = {
  avatarUrl: 'https://www.wiz.cn/wp-content/new-uploads/2285af20-4006-11eb-8f21-01eb48012b63.jpeg',
  userId: `${new Date().valueOf()}`,
  displayName: NAMES[new Date().valueOf() % NAMES.length],
};

const MermaidText = `
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
`;

function replaceUrl(docId: string) {
  const now = window.location.href;
  if (now.endsWith(docId)) return;
  //
  const newUrl = `${window.location.origin}/?id=${docId}`;
  window.history.pushState({}, '', newUrl);
}

async function handleSave(editor: Editor, data: any) {
  console.log(JSON.stringify(data, null, 2));
  const text = docData2Text(data);
  console.log('------------------- document text --------------------');
  console.log(text);
  console.log('------------------------------------------------------');
  assert(currentEditor);
  const html = await currentEditor?.toHtml({ inlineImage: true });
  console.log(html);
}

function handleRemoteUserChanged(editor: Editor, users: EditorUser[]) {
  const userNames = [...users].map((u) => u.displayName).join(', ');
  const curElement = document.getElementById('curUserNames');
  assert(curElement);
  curElement.textContent = user.displayName || '';

  const otherElement = document.getElementById('otherUserNames');
  assert(otherElement);
  if (userNames) {
    otherElement.textContent = `其他成员：${userNames}`;
  }
}

function handleLoad(editor: Editor, data: any): void {
  console.log(`${editor.docId()} loaded`);
  assert(data);
  replaceUrl(editor.docId());
}

function handleError(editor: Editor, error: Error): void {
  console.log(`${editor.docId()} error: ${error}`);
  alert(error);
}

function handleStatusChanged(editor: Editor, dirty: boolean): void {
  const elem = document.getElementById('docStatus');
  if (elem) {
    elem.style.color = dirty ? 'rgb(237, 227, 79)' : 'green';
  }
}

function updateStyleCommandStatus(editor: Editor, item: CommandItemData, status: CommandStatus) {
  if (item.id.startsWith('style-')) {
    const i = item;
    i.disabled = status[item.id] === 'disabled';
    i.checked = status[item.id] === true;
  }
}

function handleMenuItemClicked(event: Event, item: CommandItemData) {
  console.log(item);
  assert(currentEditor);
  if (item.id === 'get-selected-text') {
    const doc = selectionUtils.selectionToDoc(currentEditor, currentEditor.getSelectionDetail(), { keepComments: true });
    console.log(doc);
    alert(`selected text: ${currentEditor.getSelectedText()}`);
  } else if (item.id === 'style-border') {
    currentEditor.applyTextCustomStyle('style-border');
  } else if (item.id === 'style-strikethrough') {
    currentEditor.applyTextCustomStyle('style-strikethrough');
  } else if (item.id === 'toHeading2') {
    currentEditor.executeBlockCommand('toHeading2');
  } else if (item.id === 'toOrderedList') {
    currentEditor.executeBlockCommand('toOrderedList');
  } else if (item.id === 'toUnorderedList') {
    currentEditor.executeBlockCommand('toUnorderedList');
  } else if (item.id === 'list/indent') {
    currentEditor.executeBlockCommand('list/indent');
  } else if (item.id === 'list/outdent') {
    currentEditor.executeBlockCommand('list/outdent');
  } else if (item.id === 'insert-project') {
    const block = item.data as BlockElement;
    if (currentEditor.getSelectionDetail().startBlock !== block) {
      currentEditor.selectBlock(block, -1, -1);
    }
    currentEditor.insertEmptyBox(PROJECT_BOX_TYPE as any);
  } else if (item.id === 'showVersion') {
    currentEditor.showVersions();
  }
}

function handleGetBlockCommand(editor: Editor, block: BlockElement, detail: SelectionDetail, type: 'fixed' | 'hover' | 'menu'): CommandItemData[] {
  if (!blockUtils.isTextTypeBlock(block)) {
    return [];
  }
  //
  const status = getEditor(block).getDetailCommandStatus(detail);
  //
  const ret: CommandItemData[] = [];
  if (type === 'menu') {
    ret.push({
      id: 'showVersion',
      text: '查看历史版本',
      shortCut: '',
      disabled: false,
      onClick: handleMenuItemClicked,
    });
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

  if (type === 'hover') {
    ret.push(
      {
        id: 'style-border',
        text: '添加边框',
        shortCut: '',
        disabled: status['style-border'] === 'disabled',
        checked: status['style-border'] === true,
        onClick: handleMenuItemClicked,
        updateStatus: updateStyleCommandStatus,
      },
      {
        id: 'style-strikethrough',
        text: '添加删除线',
        shortCut: '',
        disabled: status['style-strikethrough'] === 'disabled',
        checked: status['style-strikethrough'] === true,
        onClick: handleMenuItemClicked,
        updateStatus: updateStyleCommandStatus,
      },
    );
  }

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

const DocTemplate = `{
  "blocks": [
    {
      "text": [
        {
          "insert": "{{meet-name}} 会议"
        }
      ],
      "id": "_HNsxMNUe",
      "type": "heading",
      "level": 1
    },
    {
      "text": [
        {
          "insert": "参会人: {{names}}"
        }
      ],
      "id": "_iSAuPm5m",
      "type": "text"
    },
    {
      "text": [
        {
          "insert": "会议日期: {{date}}"
        }
      ],
      "id": "_AgSRfkl_",
      "type": "text"
    },
    {
      "text": [
        {
          "insert": "会议内容:"
        }
      ],
      "id": "_t_xqxWwU",
      "type": "text"
    },
    {
      "text": [],
      "id": "_YZddVF5R",
      "type": "text"
    }
  ],
  "comments": {},
  "meta": {
    "kbGuid": "123456"
  }
}`;

const DocTemplateValues = {
  'meet-name': 'XXX',
  names: 'Steve， zTree, OldHu',
  date: new Date().toLocaleDateString(),
};

function handleCommentInserted(editor: Editor, commentId: string, commentDocText: string, commentText: string, selectedBlock: SelectedBlock): void {
  console.log(`comment created: ${commentText}`);
  assert(selectedBlock);
}

function handleCommentReplied(editor: Editor, toUserId: string, orgCommentText: string, commentText: string): void {
  assert(commentText);
  console.log(`comment replied to ${toUserId}: ${commentText}`);
}

function handleCommandStatusChanged(editor: Editor, status: CommandStatus): void {
  // console.log(status);
  const toolbar = document.querySelector('#toolbar');
  assert(toolbar);
  const styleButtons = toolbar.querySelectorAll('button[id^=style-]');
  Array.from(styleButtons).forEach((button: Element) => {
    assert(button instanceof HTMLButtonElement);
    // eslint-disable-next-line no-param-reassign
    button.disabled = status.textStyle === 'disabled';
    if (status[button.id] === true) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  Object.entries(status).forEach(([key, value]) => {
    const button = document.getElementById(key) as HTMLButtonElement;
    if (button) {
      //
      if (value === 'disabled' || value === undefined) {
        button.disabled = true;
      } else if (value !== undefined) {
        button.disabled = false;
      }
    }
    //
  });
  //
  const disabledInsertBox = status.insertBox === 'disabled';
  const disabledInsertBlock = status.insertBlock === 'disabled';
  const disableInsertComplexBlock = status.insertComplexBlock === 'disabled' || disabledInsertBlock;
  //
  (document.getElementById('table') as HTMLButtonElement).disabled = disableInsertComplexBlock;
  (document.getElementById('layout') as HTMLButtonElement).disabled = disableInsertComplexBlock;
  (document.getElementById('code') as HTMLButtonElement).disabled = disableInsertComplexBlock;
  //
  (document.getElementById('mermaid') as HTMLButtonElement).disabled = disabledInsertBlock;
  (document.getElementById('image-button') as HTMLButtonElement).disabled = disabledInsertBlock;
  (document.getElementById('video-button') as HTMLButtonElement).disabled = disabledInsertBlock;
  (document.getElementById('audio-button') as HTMLButtonElement).disabled = disabledInsertBlock;
  (document.getElementById('office-button') as HTMLButtonElement).disabled = disabledInsertBlock;
  (document.getElementById('buttons') as HTMLButtonElement).disabled = disabledInsertBlock;
  (document.getElementById('complex-block') as HTMLButtonElement).disabled = disabledInsertBlock;

  (document.getElementById('math') as HTMLButtonElement).disabled = disabledInsertBox;
  (document.getElementById('project') as HTMLButtonElement).disabled = disabledInsertBox;
  (document.getElementById('custom-suggest') as HTMLButtonElement).disabled = disabledInsertBox;
}

function handleCheckboxChanged(editor: Editor, text: string, blockData: BlockData, mentions: BoxData[], calendars: BoxData[]) {
  // TODO: create / modify messages
  console.log(`checkbox changed: ${text}, ${JSON.stringify(blockData)}, ${JSON.stringify(mentions)}, ${JSON.stringify(calendars)}`);
}

async function handleGetChartData(editor: Editor, id: string) {
  const number = Number.parseInt(id.substr(id.lastIndexOf('_') + 1), 10);
  console.log(`get chart data: ${number}`);
  const dataArray = [{
    type: 'line',
    data: {
      datasets: [{
        label: 'First dataset',
        data: [0, 20, 40, 50],
      }],
      labels: ['January', 'February', 'March', 'April'],
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            suggestedMin: 50,
            suggestedMax: 100,
          },
        }],
      },
    },
  }, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'My First dataset',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [0, 10, 5, 2, 20, 30, 45],
      }],
    },
    // Configuration options go here
    options: {},
  }];
  const data = dataArray[number % 2];
  console.log(data);
  return data;
}

async function loadDocument(docId: string, template?: any,
  templateValues?: { [index : string]: string}) {
  //
  if (currentEditor) {
    currentEditor.destroy();
    currentEditor = null;
  }
  //
  const options: EditorOptions = {
    lang: LANGS.ZH_CN,
    serverUrl: WsServerUrl,
    user,
    template,
    templateValues,
    placeholder: '请输入笔记正文',
    callbacks: {
      onSave: handleSave,
      onRemoteUserChanged: handleRemoteUserChanged,
      onLoad: handleLoad,
      onError: handleError,
      onStatusChanged: handleStatusChanged,
      onReauth: fakeGetAccessTokenFromServer,
      onGetMentionItems: fakeGetMentionItems,
      onMentionInserted: handleMentionInserted,
      onMentionClicked: handleMentionClicked,
      onGetTagItems: fakeGetTags,
      onTagInserted: handleTagInserted,
      onTagClicked: handleTagClicked,
      onGetBlockCommand: handleGetBlockCommand,
      onCommentInserted: handleCommentInserted,
      onCommentReplied: handleCommentReplied,
      // onRenderAutoSuggestItem: handleRenderAutoSuggestItem,
      onCommandStatusChanged: handleCommandStatusChanged,
      onCheckboxChanged: handleCheckboxChanged,
      onGetChartJsData: handleGetChartData,
    },
  };

  const token = await fakeGetAccessTokenFromServer(user.userId, docId, 'w');
  const auth: AuthMessage = {
    appId: AppId,
    userId: user.userId,
    permission: 'w',
    docId,
    token,
  };

  const editor = createEditor(document.getElementById('editor') as HTMLElement, options, auth);
  currentEditor = editor;
  //
}

document.getElementById('addPage')?.addEventListener('click', () => {
  const id = genId();
  loadDocument(id);
});

document.getElementById('addPageTemplate')?.addEventListener('click', () => {
  const id = genId();
  loadDocument(id, JSON.parse(DocTemplate), DocTemplateValues);
});

document.getElementById('undo')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.undo();
});

document.getElementById('redo')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.redo();
});

document.getElementById('table')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.insertTable(-2, 5, 3);
});

document.getElementById('checkbox')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.insertCheckbox(null, -2, false, '');
});

document.getElementById('code')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.insertCode(-2, 'int i = 0;');
});

document.getElementById('layout')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.insertLayout(-2, 2);
});

const toolbar = document.querySelector('#toolbar');
assert(toolbar);
const styleButtons = toolbar.querySelectorAll('button[id^=style-]');
Array.from(styleButtons).forEach((button: Element) => {
  assert(button instanceof HTMLButtonElement);
  button.addEventListener('click', () => {
    assert(currentEditor);
    const command = button.id as TextCommand;
    currentEditor.executeTextCommand(command);
  });
});

document.getElementById('link')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.executeTextCommand('link', {});
});

(document.getElementById('image') as HTMLInputElement)?.addEventListener('change', (event: Event): void => {
  assert(event);
  assert(event.target);
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    Array.from(input.files).forEach((file) => {
      assert(currentEditor);
      currentEditor.insertImage(null, file, -2);
    });
    input.files = null;
    input.value = '';
  }
});

(document.getElementById('audio') as HTMLInputElement)?.addEventListener('change', (event: Event): void => {
  assert(event);
  assert(event.target);
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    Array.from(input.files).forEach((file) => {
      assert(currentEditor);
      currentEditor.insertAudio(null, file, -2);
    });
    input.files = null;
    input.value = '';
  }
});

(document.getElementById('video') as HTMLInputElement)?.addEventListener('change', (event: Event): void => {
  assert(event);
  assert(event.target);
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    Array.from(input.files).forEach((file) => {
      assert(currentEditor);
      currentEditor.insertVideo(null, file, -2);
    });
    input.files = null;
    input.value = '';
  }
});

(document.getElementById('office') as HTMLInputElement)?.addEventListener('change', (event: Event): void => {
  assert(event);
  assert(event.target);
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    Array.from(input.files).forEach((file) => {
      assert(currentEditor);
      currentEditor.insertOffice(null, file, -2);
    });
    input.files = null;
    input.value = '';
  }
});

document.getElementById('mermaid')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.insertMermaid(null, -2, MermaidText);
});

document.getElementById('chart')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.insertChart(null, -2, `callback:chart_id_${new Date().valueOf()}`, {
    width: 600,
    // height: 480,
  });
});


document.getElementById('math')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.executeTextCommand('inline-math');
});

document.getElementById('project')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.insertBox('project' as any, null, {}, {
    showAutoSuggest: true,
  });
});

document.getElementById('custom-suggest')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.insertBox(CUSTOM_SUGGEST_BOX_TYPE as any, null, {}, {
    showAutoSuggest: true,
  });
});

document.getElementById('comment')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.executeTextCommand('comment');
});

document.getElementById('fullscreen')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.fullscreen();
});

const buttons = document.querySelectorAll('.tools .toolbar-button');
buttons.forEach((button) => {
  button.addEventListener('mousedown', (event) => {
    event.preventDefault();
  });
});

document.getElementById('buttons')?.addEventListener('click', () => {
  assert(currentEditor);
  const count = (Date.now() % 5) + 5;
  currentEditor.insertEmbed(null, -2, 'buttons' as any, {
    count,
  });
});

document.getElementById('complex-block')?.addEventListener('click', () => {
  assert(currentEditor);
  const blockData = blockUtils.createBlockData(currentEditor, TEST_BLOCK_TYPE as any, {
    imgSrc: CALENDAR_IMAGE_URL,
  });
  currentEditor.insertBlock(null, -2, 'test' as any, blockData, {
    fromUndo: false,
    focusToBlock: true,
    localAction: true,
  });
});

loadDocument(pageId);
