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

  function createNode(data: BoxData): BoxNode {
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
    const pos = editor.saveCaretPos();
    //
    if (item.id === 'selectEvent') {
      alert('select one event');
      //
    } else if (item.id === 'createEvent') {
      alert('create one event');
      //
    }
    //
    if (!editor.tryRestoreCaretPos(pos)) {
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

(() => {
  const DATE_BOX_TYPE = 'date';

  interface DateBoxData extends BoxData {
    text: string;
  };

  function createNode(data: BoxData): BoxNode {
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

  function createNode(data: BoxData): BoxNode {
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

  const labelBox = {
    prefix: 'll',
    createNode,
    getItems,
    createBoxDataFromItem,
    handleBoxInserted,
    handleBoxClicked,
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
  iconUrl: 'http://www.wiz.cn/wp-content/new-uploads/e89745c0-3f7a-11eb-8f21-01eb48012b63.jpeg',
  text: 'Steve',
  id: 'weishijun@wiz.cn',
  data: '',
}, {
  iconUrl: 'http://www.wiz.cn/wp-content/new-uploads/2285af20-4006-11eb-8f21-01eb48012b63.jpeg',
  text: 'zTree',
  id: 'zqg@wiz.cn',
  data: '',
}];

NAMES.forEach((name) => {
  const user = {
    iconUrl: 'http://www.wiz.cn/wp-content/new-uploads/2285af20-4006-11eb-8f21-01eb48012b63.jpeg',
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
  alert(`context text:\n\n${leftText}\n\n${rightText}`);
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
const pageId = urlQuery.get('id') || '_1cTj9vG1';
console.log(`pageGuid: ${pageId}`);

const WsServerUrl = window.location.protocol !== 'https:'
  ? `ws://${window.location.host}`
  : `wss://${window.location.host}`;

const user = {
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
          "insert": "模版临时解决方案，后期将会直接内置该功能"
        }
      ],
      "id": "_MUdYmTuv",
      "type": "heading",
      "level": 1
    },
    {
      "text": [
        {
          "insert": "新建一篇文档"
        }
      ],
      "id": "_yuwdR7WT",
      "type": "list",
      "level": 1,
      "ordered": true,
      "start": 1,
      "groupId": "_sUejxRZs"
    },
    {
      "text": [
        {
          "insert": "按照要求进行编辑，然后将其中的某些内容替换成key，通过{{key}}定义需要替换的内容"
        }
      ],
      "id": "_RxT4EdqB",
      "type": "list",
      "start": 2,
      "groupId": "_sUejxRZs",
      "level": 1,
      "ordered": true
    },
    {
      "text": [
        {
          "insert": "保存内容，获得文档json数据。这个json数据，就可以当成模版。"
        }
      ],
      "id": "_oDSmf_a_",
      "type": "list",
      "start": 3,
      "groupId": "_sUejxRZs",
      "level": 1,
      "ordered": true
    },
    {
      "text": [
        {
          "insert": "下次新建文档的时候，将模版以及参数传递给编辑器。编辑器将会自动使用模版创建一篇新的文档。"
        }
      ],
      "id": "_7Ee5ClSH",
      "type": "list",
      "start": 4,
      "groupId": "_sUejxRZs",
      "level": 1,
      "ordered": true
    },
    {
      "text": [
        {
          "insert": "-------"
        }
      ],
      "id": "_Lc_8Z0Aa",
      "type": "text"
    },
    {
      "text": [
        {
          "insert": "可以在任意地方输入参数，{{name}}，例如在表格里面替换内容："
        }
      ],
      "id": "_cf9WSoXB",
      "type": "text"
    },
    {
      "text": [],
      "id": "_qADk96wH",
      "type": "table",
      "rows": 3,
      "cols": 5,
      "cells": [
        "_LBncC1fo",
        "_vOwxKHeb",
        "_6xLp_apS",
        "_4cxKjIyq",
        "_3fdf6Hb8",
        "_oO1q7tAB",
        "_ICwtzI38",
        "_zCC0Nzzl",
        "_khqRZt0R",
        "_dNukpoEh",
        "_AOYNeNAV",
        "_JDAkqWsg",
        "_WXWDUNmd",
        "_Eyk3EoQV",
        "_1w9JKDes"
      ]
    },
    {
      "text": [
        {
          "insert": "----"
        }
      ],
      "id": "_COBJGEZE",
      "type": "text"
    },
    {
      "text": [
        {
          "insert": "这是临时解决方案。"
        }
      ],
      "id": "_6Pid_fVK",
      "type": "text"
    }
  ],
  "comments": {},
  "_1w9JKDes": [
    {
      "text": [
        {
          "insert": "{{date}}"
        }
      ],
      "id": "_uBS6PZu9",
      "type": "text"
    }
  ],
  "_3fdf6Hb8": [
    {
      "text": [],
      "id": "_XRRZ4qH1",
      "type": "text"
    }
  ],
  "_4cxKjIyq": [
    {
      "text": [],
      "id": "_wF9uyc9S",
      "type": "text"
    }
  ],
  "_6xLp_apS": [
    {
      "text": [],
      "id": "_Q1MWcLOg",
      "type": "text"
    }
  ],
  "_AOYNeNAV": [
    {
      "text": [],
      "id": "_u6eVoaJ5",
      "type": "text"
    }
  ],
  "_Eyk3EoQV": [
    {
      "text": [
        {
          "insert": "{{personal}}"
        }
      ],
      "id": "_xEeEwFSj",
      "type": "text"
    }
  ],
  "_ICwtzI38": [
    {
      "text": [],
      "id": "_H2tMwXFb",
      "type": "text"
    }
  ],
  "_JDAkqWsg": [
    {
      "text": [],
      "id": "_xSMX75bj",
      "type": "text"
    }
  ],
  "_LBncC1fo": [
    {
      "text": [],
      "id": "_MYTXF6HG",
      "type": "text"
    }
  ],
  "_WXWDUNmd": [
    {
      "text": [
        {
          "insert": "{{company}}"
        }
      ],
      "id": "_Nao1rp8b",
      "type": "text"
    }
  ],
  "_dNukpoEh": [
    {
      "text": [],
      "id": "_MmFTp7Oa",
      "type": "text"
    }
  ],
  "_khqRZt0R": [
    {
      "text": [],
      "id": "_KfwuRTaV",
      "type": "text"
    }
  ],
  "_oO1q7tAB": [
    {
      "text": [],
      "id": "_pYvTIiNy",
      "type": "text"
    }
  ],
  "_vOwxKHeb": [
    {
      "text": [],
      "id": "_04JLC_GS",
      "type": "text"
    }
  ],
  "_zCC0Nzzl": [
    {
      "text": [],
      "id": "_kx0_IpFb",
      "type": "text"
    }
  ]
}`;

const DocTemplateKeys = {
  name: '我是名字',
  company: '我知科技',
  personal: 'Steve',
  date: new Date().toLocaleDateString(),
};

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
  document.getElementById('addPage')?.addEventListener('click', () => {
    const id = genId();
    loadDocument(id);
  });

  document.getElementById('addPageTemplate')?.addEventListener('click', () => {
    const id = genId();
    loadDocument(id, JSON.parse(DocTemplate), DocTemplateKeys);
  });

  document.getElementById('undo')?.addEventListener('click', () => {
    editor.undo();
  });
  document.getElementById('redo')?.addEventListener('click', () => {
    editor.redo();
  });
  document.getElementById('table')?.addEventListener('click', () => {
    editor.insertTable(-2, 5, 3);
  });
  document.getElementById('bold')?.addEventListener('click', () => {
    editor.executeTextCommand('bold');
  });
  document.getElementById('italic')?.addEventListener('click', () => {
    editor.executeTextCommand('italic');
  });
  document.getElementById('link')?.addEventListener('click', () => {
    editor.executeTextCommand('link', {});
  });

  (document.getElementById('image') as HTMLInputElement)?.addEventListener('change', (event: Event): void => {
    assert(event);
    assert(event.target);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach((file) => {
        editor.insertImage(null, file, -2);
      });
    }
    // editor.insertEmbed(null, -2, EMBED_TYPE.IMAGE, {
    //   src: 'https://wcdn.wiz.cn/apple-icon.png?v=1',
    // });
  });
  document.getElementById('mermaid')?.addEventListener('click', () => {
    editor.insertMermaid(-2, MermaidText);
  });
  document.getElementById('comment')?.addEventListener('click', () => {
    editor.executeTextCommand('comment');
  });

  const buttons = document.querySelectorAll('.tools .toolbar-button');
  buttons.forEach((button) => {
    button.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });
  });
}

loadDocument(pageId);
