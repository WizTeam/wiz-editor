/* eslint-disable no-alert */
// eslint-disable-next-line import/no-unresolved
import {
  EditorUser,
  LANGS,
  createEditor,
  assert,
  AutoSuggestData,
  docData2Text,
} from 'wiz-editor/client';
import { AuthMessage, AuthPermission } from 'wiz-editor/commons/auth-message';

function hideElement(id: string) {
  const elem = document.getElementById(id);
  if (!elem) return;
  elem.style.display = 'none';
}

hideElement('header');
hideElement('toolbar');


const AppId = '_LC1xOdRp';

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

const urlQuery = new URLSearchParams(window.location.search);

const WsServerUrl = window.location.protocol !== 'https:'
  ? `ws://${window.location.host}`
  : `wss://${window.location.host}`;

const user: EditorUser = {
  avatarUrl: 'https://www.wiz.cn/wp-content/new-uploads/2285af20-4006-11eb-8f21-01eb48012b63.jpeg',
  userId: `${new Date().valueOf()}`,
  displayName: NAMES[new Date().valueOf() % NAMES.length],
};

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

async function fakeGetAccessTokenFromServer(userId: string, docId: string, permission: AuthPermission): Promise<string> {
  //
  const res = await fetch(`http://${window.location.host}/token/${AppId}/${docId}/${userId}`);
  const ret = await res.json();
  return ret.token;
}

async function loadDocument(docId: string, template?: any,
  templateValues?: { [index : string]: string}) {
  const options = {
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
      onGetMentionItems: fakeGetMentionItems,
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

  createEditor(document.getElementById('editor') as HTMLElement, options, auth);
}

const docId = urlQuery.get('id') || '_ny1Adsk2';
loadDocument(docId);
