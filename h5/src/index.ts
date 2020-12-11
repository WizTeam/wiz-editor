import {
  createEditor, genId, assert,
  EditorUser, LANGS,
  Editor, EMBED_TYPE, BOX_TYPE, boxUtils,
} from 'wiz-editor/client';

const urlQuery = new URLSearchParams(window.location.search);
const pageId = urlQuery.get('id') || '_e9kD3NTs';
console.log(`pageGuid: ${pageId}`);

const WsServerUrl = `ws://${window.location.host}`;

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
};

function handleError(docId: string, error: Error): void {
  console.log(`${docId} error: ${error}`);
  // eslint-disable-next-line no-alert
  alert(error);
};

function handleStatusChanged(docId: string, dirty: boolean) : void {
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
    },
  };

  const options2 = {
    // lang: LANGS.ZH_CN,
    serverUrl: WsServerUrl,
    user: user2,
  };

  const editor = createEditor(document.getElementById('editor') as HTMLElement, options, docId);
  let editor2: Editor | null = null;
  function startOtherUser() {
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
      editor2 = createEditor(document.getElementById('editor2') as HTMLElement, options2, docId);
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
      link: 'https://www.wiz.cn',
    });
  });

  let tagCount = 0;
  document.getElementById('tag')?.addEventListener('click', () => {
    const data = boxUtils.createBoxData(BOX_TYPE.TAG, null, { text: `tag-${tagCount += 1}` });
    editor.insertBox(data);
  });
  document.getElementById('image')?.addEventListener('click', () => {
    editor.insertEmbed(null, -2, EMBED_TYPE.IMAGE, {
      src: 'https://www.wiz.cn/static/images/docker.svg?v=1',
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
}

loadDocument(pageId);
