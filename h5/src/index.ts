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
  BoxItemData,
  MentionBoxData,
  BoxNode,
  BoxData,
  BoxImageChild,
  BoxTextChild,
} from 'wiz-editor/client';

const AppId = '_LC1xOdRp';
const AppSecret = '714351167e39568ba734339cc6b997b960ed537153b68c1f7d52b1e87c3be24a';
const AppDomain = 'wiz.cn';

// -------------------create a custom calendar item----------
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

function handleBoxInserted(editor: Editor, data: BoxData): void {
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

function handleBoxItemSelected(editor: Editor, item: BoxItemData): void {
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

// this code should run on your server
async function fakeGetAccessTokenFromServer(userId: string, docId: string): Promise<string> {
  //
  const data = {
    userId,
    docId,
    appId: AppId,
    created: new Date().valueOf(),
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
      .setExpirationTime('120s')
      .encrypt(key);

    return accessToken;
  } catch (err) {
    const res = await fetch(`http://${window.location.host}/token/${AppId}/${docId}/${userId}`);
    const ret = await res.json();
    return ret.token;
  }
}

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

async function fakeGetMentionItems(keywords: string): Promise<BoxItemData[]> {
  assert(keywords !== undefined);
  console.log(keywords);
  if (!keywords) {
    return ALL_USERS;
  }
  return ALL_USERS.filter((user) => user.text.toLowerCase().indexOf(keywords.toLowerCase()) !== -1);
}

function handleMentionInserted(boxData: MentionBoxData) {
  console.log(`mention ${JSON.stringify(boxData)} inserted`);
}

function handleMentionClicked(boxData: MentionBoxData) {
  alert(`you clicked ${boxData.text} (${boxData.mentionId})`);
}

const urlQuery = new URLSearchParams(window.location.search);
const pageId = urlQuery.get('id') || '_e9kD3NTs';
console.log(`pageGuid: ${pageId}`);

const WsServerUrl = window.location.protocol !== 'https:'
  ? `ws://${window.location.host}`
  : `wss://${window.location.host}`;

const user = {
  userId: `${new Date().valueOf()}`,
  displayName: NAMES[new Date().valueOf() % NAMES.length],
};

const user2 = {
  userId: `${new Date().valueOf() + 10}`,
  displayName: NAMES[(new Date().valueOf() + 10) % NAMES.length],
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
  const text = JSON.stringify(data, null, 2);
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

async function loadDocument(docId: string) {
  const options = {
    lang: LANGS.ZH_CN,
    serverUrl: WsServerUrl,
    user,
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
    },
  };

  const options2 = {
    // lang: LANGS.ZH_CN,
    serverUrl: WsServerUrl,
    user: user2,
    callbacks: {
      onSave: handleSave,
      onRemoteUserChanged: handleRemoteUserChanged,
      onLoad: handleLoad,
      onError: handleError,
      onStatusChanged: handleStatusChanged,
      onReauth: fakeGetAccessTokenFromServer,
      onGetMentionItems: fakeGetMentionItems,
    },
  };

  const token = await fakeGetAccessTokenFromServer(user.userId, docId);
  const auth = {
    appId: AppId,
    userId: user.userId,
    docId,
    token,
  };

  const editor = createEditor(document.getElementById('editor') as HTMLElement, options, auth);
  let editor2: Editor | null = null;
  async function startOtherUser() {
    const main = document.querySelector('#main');
    if (!main) {
      return;
    }
    if (main.classList.contains('both-user')) {
      main.classList.remove('both-user');
      return;
    }
    main?.classList.add('both-user');
    if (!editor2) {
      const token2 = await fakeGetAccessTokenFromServer(user2.userId, docId);
      const auth2 = {
        appId: AppId,
        userId: user2.userId,
        docId,
        token: token2,
      };
      editor2 = createEditor(document.getElementById('editor2') as HTMLElement, options2, auth2);
    }
  }
  //
  document.getElementById('otherUser')?.addEventListener('click', () => {
    startOtherUser();
  });

  document.getElementById('addPage')?.addEventListener('click', () => {
    const id = genId();
    loadDocument(id);
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
    editor.executeTextCommand('link', {
      link: '',
    });
  });

  let tagCount = 0;
  document.getElementById('tag')?.addEventListener('click', () => {
    editor.insertBox(BOX_TYPE.TAG, null, { text: `tag-${(tagCount += 1)}` });
  });
  document.getElementById('image')?.addEventListener('click', () => {
    editor.insertEmbed(null, -2, EMBED_TYPE.IMAGE, {
      src: 'https://wcdn.wiz.cn/apple-icon.png?v=1',
    });
  });
  document.getElementById('mermaid')?.addEventListener('click', () => {
    editor.insertMermaid(-2, MermaidText);
  });
  document.getElementById('unlink')?.addEventListener('click', () => {
    editor.executeTextCommand('unlink');
  });
  document.getElementById('comment')?.addEventListener('click', () => {
    editor.executeTextCommand('comment', {
      commentId: '12345',
    });
  });

  const buttons = document.querySelectorAll('.tools .toolbar-button');
  buttons.forEach((button) => {
    button.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });
  });
  setTimeout(() => {
    startOtherUser();
  }, 1000);
}

loadDocument(pageId);
