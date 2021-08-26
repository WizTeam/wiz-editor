import {
  AuthMessage,
  AuthPermission,
  docData2Text,
  createEditor,
  Editor,
  assert,
  genId,
  BoxData,
  blockUtils,
  SelectedBlock,
  CommandStatus,
  TextCommand,
  BlockData,
  RichTextDocument,
  EditorOptions,
  OnlineUsers,
  domUtils,
  AutoSuggestData,
  LANGS,
} from 'wiz-editor/client';

const AppId = '_LC1xOdRp'; // demo服务器默认的AppID，也可以通过服务端接口自行建立

let currentEditor: Editor | null;

// 获取编辑服务需要的token。demo中从wiz-editor服务端获取一个token，请勿在测试和生产中使用这种方式
// 应该在自己的业务中实现这个接口
// 业务需要根据当前用户信息以及文档id，生成一个针对该用户的token。
// 编辑器前端会将这个token发送给编辑器服务端，编辑器服务端会验证这个token，并得知用户对该文档的权限（读/写或者无权限等）
async function getAccessTokenFromServer(userId: string, docId: string, permission: AuthPermission): Promise<string> {
  //
  const res = await fetch(`//${window.location.host}/token/${AppId}/${docId}/${userId}`);
  const ret = await res.json();
  return ret.token;
}

// 编辑服务至少需要三个用户信息：用户ID（用来记录每一个操作的用户），用户名称和头像（用户在编辑过程中显示在线用户信息）

// // --------------------------- mention data ----------------
// 生成一些随机的提醒用户信息。实际生产中，可以通过查询业务中的人员来实现。
const NAMES = [
  '家豪', '志明', '俊杰', '建宏',
  '淑芬', '淑惠', '美玲',
];

const ALL_USERS: AutoSuggestData[] = [];

const AVATAR_URLS = [
  'https://live-editor.com/wp-content/new-uploads/2f4c76a6-db63-4de1-a5c0-28cf36384b7e.png',
  'https://live-editor.com/wp-content/new-uploads/fc728217-55e3-4d09-b034-07a9960a6b39.png',
  'https://live-editor.com/wp-content/new-uploads/a0919cb4-d3c2-4027-b64d-35a4c2dc8e23.png',
  'https://live-editor.com/wp-content/new-uploads/edd02e17-0311-42f2-b6e4-f2182c9af669.png',
  'https://live-editor.com/wp-content/new-uploads/466fd22b-efa2-4aa9-afa2-2e7fd7e877c4.png',
  'https://live-editor.com/wp-content/new-uploads/ba347c05-ec29-4ebf-bca0-d95670c93df0.png',
  'https://live-editor.com/wp-content/new-uploads/200598ee-a746-403f-9908-a91949bc41c2.png',
];

NAMES.forEach((name, index) => {
  const user = {
    iconUrl: AVATAR_URLS[index % AVATAR_URLS.length],
    text: name,
    id: name,
    data: name,
  };
  ALL_USERS.push(user);
});

// // ---------------------------------------------------------

const urlQuery = new URLSearchParams(window.location.search);
const pageId = urlQuery.get('id') || '_ny9Adsk2';
console.log(`pageGuid: ${pageId}`);

const WsServerUrl = window.location.protocol !== 'https:'
  ? `ws://${window.location.host}`
  : `wss://${window.location.host}`;

const userIndex = Date.now() % NAMES.length;

const user = {
  avatarUrl: AVATAR_URLS[userIndex % AVATAR_URLS.length],
  userId: `${NAMES[userIndex]}`,
  displayName: NAMES[new Date().valueOf() % NAMES.length],
};

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
  const html = await currentEditor?.toHtml();
  console.log(html);
}

function handleRemoteUserChanged(editor: Editor, remoteUsers: OnlineUsers) {
  const users = remoteUsers;
  const fragment = document.createDocumentFragment();
  // eslint-disable-next-line @typescript-eslint/no-shadow
  users.forEach((user) => {
    const userDom = document.createElement('div');
    userDom.classList.add('userFace');
    userDom.title = user.displayName;
    if (user.avatarUrl) {
      const faceDom = document.createElement('img');
      faceDom.classList.add('faceImg');
      faceDom.alt = user.displayName;
      faceDom.src = user.avatarUrl;
      userDom.append(faceDom);
    }
    const color = editor.options.colors![user.rainbowIndex % editor.options.colors!.length];
    userDom.setAttribute('style', `--marker-color: ${color}`);
    fragment.append(userDom);
  });
  const container = document.getElementById('userContainer');
  assert(container);
  container.innerHTML = '';
  container.append(fragment);
}

function handleLoad(editor: Editor, data: any): void {
  console.log(`${editor.docId()} loaded`);
  assert(data);
  replaceUrl(editor.docId());
  //
  editor.postCustomMessage('I\' am in.');
}

function handleError(editor: Editor, error: Error): void {
  console.log(`${editor.docId()} error: ${error}`);
  // alert(error);
}

function handleStatusChanged(editor: Editor, dirty: boolean): void {
  const elem = document.getElementById('docStatus');
  if (elem) {
    elem.style.color = dirty ? 'rgb(237, 227, 79)' : 'green';
  }
}

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
    if (button && button.id !== 'link') {
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
  (document.getElementById('code') as HTMLButtonElement).disabled = disableInsertComplexBlock;
  //
  (document.getElementById('drawio') as HTMLButtonElement).disabled = disabledInsertBlock;
  (document.getElementById('image-button') as HTMLButtonElement).disabled = disabledInsertBlock;
  (document.getElementById('video-button') as HTMLButtonElement).disabled = disabledInsertBlock;
  (document.getElementById('audio-button') as HTMLButtonElement).disabled = disabledInsertBlock;
  (document.getElementById('office-button') as HTMLButtonElement).disabled = disabledInsertBlock;

  (document.getElementById('math') as HTMLButtonElement).disabled = disabledInsertBox;
}

function handleCheckboxChanged(editor: Editor, text: string, blockData: BlockData, mentions: BoxData[], calendars: BoxData[]) {
  // TODO: create / modify messages
  console.log(`checkbox changed: ${text}, ${JSON.stringify(blockData)}, ${JSON.stringify(mentions)}, ${JSON.stringify(calendars)}`);
}

async function fakeGetMentionItems(editor: Editor, keywords: string): Promise<AutoSuggestData[]> {
  assert(keywords !== undefined);
  console.log(keywords);
  if (!keywords) {
    return ALL_USERS;
  }
  // eslint-disable-next-line @typescript-eslint/no-shadow
  return ALL_USERS.filter((user) => user.text.toLowerCase().indexOf(keywords.toLowerCase()) !== -1);
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
    lang: 'zh-CN',
    serverUrl: WsServerUrl,
    template,
    templateValues,
    titleInEditor: true,
    titlePlaceholder: '请输入页面标题',
    contentPlaceholder: '请输入页面正文',
    previewFiles: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'], // demo环境不支持预览，生产环境可以支持
    lineNumber: false,
    allowDarkMode: false,
    showBlockCommandsInTextToolBar: true,
    // disableMindmap: true,
    // scrollIntoViewIfNeeded: true,
    callbacks: {
      onSave: handleSave,
      onRemoteUserChanged: handleRemoteUserChanged,
      onLoad: handleLoad,
      onError: handleError,
      onStatusChanged: handleStatusChanged,
      onReauth: getAccessTokenFromServer,
      onCommentInserted: handleCommentInserted,
      onCommentReplied: handleCommentReplied,
      onCommandStatusChanged: handleCommandStatusChanged,
      onCheckboxChanged: handleCheckboxChanged,
      onGetMentionItems: fakeGetMentionItems,
    },
  };

  const token = await getAccessTokenFromServer(user.userId, docId, 'w');
  const auth: AuthMessage = {
    appId: AppId,
    userId: user.userId,
    permission: 'w',
    docId,
    token,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    userData: '',
  };

  const editor = createEditor(document.getElementById('editor') as HTMLElement, options, auth);
  currentEditor = editor;
  (window as any).editor = editor;
  //
}

document.getElementById('create-button')?.addEventListener('click', () => {
  const id = genId();
  loadDocument(id);
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
  currentEditor.insertCode(-2, '');
});

document.getElementById('focus-mode')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.setFocusMode(!currentEditor.isFocusMode());
  if (currentEditor.isFocusMode()) {
    domUtils.addClass(document.getElementById('focus-mode')!, 'checked');
  } else {
    domUtils.removeClass(document.getElementById('focus-mode')!, 'checked');
  }
});

document.getElementById('typewriter-mode')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.setTypewriterMode(!currentEditor.isTypewriterMode());
  //
  if (currentEditor.isTypewriterMode()) {
    domUtils.addClass(document.getElementById('typewriter-mode')!, 'checked');
  } else {
    domUtils.removeClass(document.getElementById('typewriter-mode')!, 'checked');
  }
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
  const detail = currentEditor.getSelectionDetail();
  if (detail.startBlock && !detail.collapsed) {
    currentEditor.executeTextCommand('link', {});
  } else if (detail.startBlock && blockUtils.isTextTypeBlock(detail.startBlock)) {
    //
    const doc = RichTextDocument.createWithAttributes('link text', {
      link: 'https://www.wiz.cn',
    });
    //
    assert(detail.startOffset !== undefined);
    currentEditor.insertBlockText(detail.startBlock, detail.startOffset, doc);
  }
});

(document.getElementById('image') as HTMLInputElement)?.addEventListener('change', (event: Event): void => {
  assert(event);
  assert(event.target);
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    Array.from(input.files).forEach((file) => {
      assert(currentEditor);
      currentEditor.insertImage(null, file, -2, {
        breakText: true,
      });
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

document.getElementById('drawio')?.addEventListener('click', () => {
  assert(currentEditor);
  currentEditor.insertDrawIO(null, -2, '');
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

loadDocument(pageId);
