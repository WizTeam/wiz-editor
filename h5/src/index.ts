/* eslint-disable no-alert */
// eslint-disable-next-line import/no-unresolved
import EncryptJWT from 'jose/jwt/encrypt';
import {
  BOX_TYPE,
  EditorUser,
  EMBED_TYPE,
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
  MenuItemData,
  SelectionDetail,
  SelectedBlock,
} from 'wiz-editor/client';
import { AuthMessage, AuthPermission } from 'wiz-editor/commons/auth-message';


const AppId = '_LC1xOdRp';
const AppSecret = '714351167e39568ba734339cc6b997b960ed537153b68c1f7d52b1e87c3be24a';
const AppDomain = 'wiz.cn';

let currentEditor: Editor | null;

// -------------------create a custom calendar item----------
(() => {
  const CALENDAR_IMAGE_URL = 'https://www.wiz.cn/wp-content/new-uploads/b75725f0-4008-11eb-8f21-01eb48012b63.jpeg';
  const CALENDAR_BOX_TYPE = 'calendar';

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

  function handleBoxClicked(editor: Editor, data: BoxData): void {
    const calendarData = data as CalendarBoxData;
    alert(`calendar clicked: ${calendarData.text}`);
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
(() => {
  const PROJECT_BOX_TYPE = 'project';

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

  function handleBoxClicked(editor: Editor, data: BoxData): void {
    const projectData = data as ProjectBoxData;
    alert(`calendar clicked: ${projectData.projectName}`);
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
    if (!keywords) {
      return PROJECT_LIST.map((project) => ({
        iconUrl: '',
        text: project.projectName,
        id: project.projectId,
        data: project,
      }));
    }
    //
    return PROJECT_LIST
      .filter((project) => project.projectName.indexOf(keywords) !== -1)
      .map((project) => ({
        iconUrl: '',
        text: project.projectName,
        id: project.projectId,
        data: project,
      }));
  }

  function createBoxDataFromItem(editor: Editor, item: AutoSuggestData): BoxTemplateData {
    const data: ProjectBoxData = item.data;
    return {
      projectId: data.projectId,
      projectName: data.projectName,
    };
  }

  const projectBox = {
    createNode,
    getItems,
    handleBoxInserted,
    handleBoxClicked,
    createBoxDataFromItem,
  };

  boxUtils.registerBoxType(PROJECT_BOX_TYPE as BOX_TYPE, projectBox);
})();

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

  function handleBoxClicked(editor: Editor, data: BoxData): void {
    const dateData = data as DateBoxData;
    alert(`date clicked: ${dateData.text}`);
  }

  async function createBoxData(editor: Editor): Promise<BoxTemplateData | null> {
    assert(editor);
    return {
      text: new Date().toLocaleDateString(),
    };
  }

  const dateBox = {
    prefix: 'dd',
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

  function handleBoxClicked(editor: Editor, data: BoxData): void {
    const calendarData = data as LabelBoxData;
    alert(`label clicked: ${calendarData.color}`);
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

  function renderAutoSuggestItem(editor: Editor, suggestData: AutoSuggestData): HTMLElement {
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

async function fakeGetMentionItems(keywords: string): Promise<AutoSuggestData[]> {
  assert(keywords !== undefined);
  console.log(keywords);
  if (!keywords) {
    return ALL_USERS;
  }
  return ALL_USERS.filter((user) => user.text.toLowerCase().indexOf(keywords.toLowerCase()) !== -1);
}

function handleMentionInserted(boxData: MentionBoxData, block: BlockElement, pos: number) {
  console.log(`mention ${JSON.stringify(boxData)} inserted at ${pos}`);
  const leftText = blockUtils.toText(block, 0, pos);
  const rightText = blockUtils.toText(block, pos + 1, -1);
  const anchorId = `M${boxData.id}`;
  console.log(`anchor id: ${anchorId}, context text:\n\n${leftText}\n\n${rightText}`);
}

function handleMentionClicked(boxData: MentionBoxData) {
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

async function fakeGetTags(keywords: string): Promise<string[]> {
  assert(keywords !== undefined);
  console.log(keywords);
  if (!keywords) {
    return ALL_TAGS;
  }
  return ALL_TAGS.filter((tag) => tag.toLowerCase().indexOf(keywords.toLowerCase()) !== -1);
}

function handleTagInserted(tag: string, block: BlockElement, pos: number) {
  console.log(`tag ${tag} inserted at ${pos}`);
}

function handleTagClicked(tag: string) {
  alert(`you clicked tag ${tag}`);
}

// function handleRenderAutoSuggestItem(suggestData: AutoSuggestData) {
//   const div = document.createElement('div');
//   div.innerText = suggestData.text;
//   return div;
// }
// ---------------------------------------------------------

const urlQuery = new URLSearchParams(window.location.search);
const pageId = urlQuery.get('id') || '_Lm3bYjj7';
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

function handleSave(docId: string, data: any) {
  console.log(JSON.stringify(data, null, 2));
  const text = docData2Text(data);
  console.log('------------------- document text --------------------');
  console.log(text);
  console.log('------------------------------------------------------');
}

function handleRemoteUserChanged(docId: string, users: EditorUser[]) {
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

function handleLoad(docId: string, data: any): void {
  console.log(`${docId} loaded`);
  assert(data);
  replaceUrl(docId);
}

function handleError(docId: string, error: Error): void {
  console.log(`${docId} error: ${error}`);
  alert(error);
}

function handleStatusChanged(docId: string, dirty: boolean): void {
  const elem = document.getElementById('docStatus');
  if (elem) {
    elem.style.color = dirty ? 'rgb(237, 227, 79)' : 'green';
  }
}

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
}

function handleGetContextMenuItems(detail: SelectionDetail): MenuItemData[] {
  if (detail.collapsed) {
    return [];
  }
  const ret: MenuItemData[] = [];
  ret.push({
    id: 'get-selected-text',
    text: '获取选中文字',
    shortCut: '',
    disabled: false,
    onClick: handleMenuItemClicked,
  }, {
    id: 'test id 2',
    text: '自定义样式',
    shortCut: '',
    disabled: false,
    subMenu: [
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
    ],
  });
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
  "comments": {}
}`;

const DocTemplateValues = {
  'meet-name': 'XXX',
  names: 'Steve， zTree, OldHu',
  date: new Date().toLocaleDateString(),
};

function handleCommentInserted(commentId: string, commentDocText: string, commentText: string, selectedBlock: SelectedBlock): void {
  console.log(`comment created: ${commentText}`);
  assert(selectedBlock);
}

function handleCommentReplied(toUserId: string, orgCommentText: string, commentText: string): void {
  assert(commentText);
  console.log(`comment replied to ${toUserId}: ${commentText}`);
}

async function loadDocument(docId: string, template?: any,
  templateValues?: { [index : string]: string}) {
  const options = {
    lang: LANGS.ZH_CN,
    serverUrl: WsServerUrl,
    user,
    template,
    templateValues,
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
      onGetContextMenuItems: handleGetContextMenuItems,
      onCommentInserted: handleCommentInserted,
      onCommentReplied: handleCommentReplied,
      // onRenderAutoSuggestItem: handleRenderAutoSuggestItem,
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
document.getElementById('bold')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.executeTextCommand('bold');
});
document.getElementById('italic')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.executeTextCommand('italic');
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
  }
});

document.getElementById('mermaid')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.insertMermaid(-2, MermaidText);
});

document.getElementById('math')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.executeTextCommand('inline-math');
});

document.getElementById('math-block')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.executeTextCommand('math');
});

document.getElementById('project')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.insertBox('project' as any, null, {}, {
    showAutoSuggest: true,
  });
});
document.getElementById('comment')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.executeTextCommand('comment');
});

document.getElementById('fullscreen')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.rootElement.requestFullscreen();
});

const buttons = document.querySelectorAll('.tools .toolbar-button');
buttons.forEach((button) => {
  button.addEventListener('mousedown', (event) => {
    event.preventDefault();
  });
});

loadDocument(pageId);
