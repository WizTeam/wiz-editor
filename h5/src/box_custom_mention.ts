/* eslint-disable no-alert */
// eslint-disable-next-line import/no-unresolved
import EncryptJWT from 'jose/jwt/encrypt';
import {
  createEditor,
  assert,
  AutoSuggestData,
  MentionBoxData,
  blockUtils,
  boxUtils,
  BlockElement,
  EditorOptions,
  Editor,
  BoxData,
  BoxNode,
  BoxTextChild,
  BOX_TYPE,
  AutoSuggestOptions,
} from 'wiz-editor/client';
import { AuthMessage } from 'wiz-editor/commons/auth-message';

function hideElement(id: string) {
  const elem = document.getElementById(id);
  if (!elem) return;
  elem.style.display = 'none';
}

hideElement('header');
hideElement('toolbar');

// 定义AppID，AppSecret, AppDomain。在自带的测试服务器中，下面三个key不要更改
const AppId = '_LC1xOdRp';
const AppSecret = '714351167e39568ba734339cc6b997b960ed537153b68c1f7d52b1e87c3be24a';
const AppDomain = 'wiz.cn';

// 初始化服务器地址
const WsServerUrl = window.location.protocol !== 'https:'
  ? `ws://${window.location.host}`
  : `wss://${window.location.host}`;

// 定义一个用户。该用户应该是有应用服务器自动获取当前用户身份
// 编辑服务需要提供用户id以及用户的显示名。
const user = {
  avatarUrl: 'https://www.wiz.cn/wp-content/new-uploads/2285af20-4006-11eb-8f21-01eb48012b63.jpeg',
  userId: `${new Date().valueOf()}`,
  displayName: 'test user',
};

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

const ALL_USERS: AutoSuggestData[] = [];

NAMES.forEach((name) => {
  const user = {
    iconUrl: 'http://www.wiz.cn/wp-content/new-uploads/2285af20-4006-11eb-8f21-01eb48012b63.jpeg',
    text: name,
    id: name,
    data: name,
  };
  ALL_USERS.push(user);
});



// -------------------create a custom calendar item----------
const CUSTOM_MENTION_BOX_TYPE = 'custom-mention';

interface CustomMentionData extends BoxData {
  customType: 'mention' | 'document',
  text: string;
};

function createNode(editor: Editor, data: BoxData): BoxNode {
  //
  const { customType, text } = data as CustomMentionData;
  //
  if (customType === 'document') {
    return {
      classes: ['box-custom-mention'],
      children: [{
        type: 'text',
        text: 'this is online document: ',
      } as BoxTextChild, {
        type: 'text',
        text,
      } as BoxTextChild],
    }
  }
  //
  return {
    classes: ['box-custom-mention'],
    children: [{
      type: 'text',
      text: 'this is mention: ',
    } as BoxTextChild, {
      type: 'text',
      text,
    } as BoxTextChild],
};
}

function handleBoxInserted(editor: Editor, data: BoxData): void {
  const calendarData = data as CustomMentionData;
  console.log('custom mention box inserted:', calendarData);
}

function handleBoxClicked(editor: Editor, data: BoxData): void {
  const calendarData = data as CustomMentionData;
  alert(`custom mention clicked: ${calendarData.text}`);
}

async function getItems(editor: Editor, keywords: string) {
  console.log(keywords);
  const elem = document.getElementById('custom-mention-item');
  if (elem) {
    elem.innerText = keywords;
  }
  // 响应键盘消息，如果返回空数组，autoSuggest将会关闭。
  //
  return [{
    iconUrl: '',
    text: '',
    id: 'custom-mention-item',
    data: '',
  }];
}

function handleBoxItemSelected(editor: Editor, item: AutoSuggestData): void {
}


let mentionBoxElement: HTMLElement | null = null;

// 渲染下拉框。 我们只有一个item，在这里返回item的内容
function renderAutoSuggestItem(editor: Editor, suggestData: AutoSuggestData, options: AutoSuggestOptions): HTMLElement {
  //
  if (!mentionBoxElement) {
    const elem = document.createElement('div');
    elem.style.width = '300px';
    elem.style.height = '300px';
    elem.style.border = '1px solid #ccc';
    elem.style.backgroundColor = '#f0f0f0';
    elem.id = 'custom-mention-item';
    mentionBoxElement = elem;
  }
  //
  return mentionBoxElement;
}

function handleAutoSuggestHidden() {
  if (mentionBoxElement) {
    mentionBoxElement.innerText = '';
  }
}

const customMentionBox = {
  prefix: '@',
  customSuggest: true,
  createNode,
  getItems,
  handleBoxItemSelected,
  handleBoxInserted,
  handleBoxClicked,
  renderAutoSuggestItem,
  handleAutoSuggestHidden,
};

boxUtils.registerBoxType(CUSTOM_MENTION_BOX_TYPE as BOX_TYPE, customMentionBox);

// 设置编辑器选项
const options: EditorOptions = {
  serverUrl: WsServerUrl,
  disableMentions: true,
  callbacks: {
  },
};

// 从应用服务器获取一个AccessToken。应用服务器需要负责验证用户对文档的访问权限。
// accessToken采用jwt规范，里面应该包含用户的userId，文档的docId，以及编辑应用的AppId。
// 下面是一个演示例子。在正常情况下，AccessToken应该通过用户自己的应用服务器生成。
// 因为在前端使用JWT加密规范的时候，必须在https协议下面的网页才可以使用。为了演示，
// 我们自带的测试服务器会提供一个虚拟的token生成功能。（启动服务的时候，需要指定--enable-fake-token-api 参数）
// 请勿在正式服务器上面，启用这个参数。

async function fakeGetAccessTokenFromServer(userId: string, docId: string): Promise<string> {
  //
  const data = {
    userId,
    docId,
    appId: AppId,
    permission: 'w',
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

// 文档id
const docId = 'my-test-doc-id-mention';

(async function loadDocument() {
  // 验证身份，获取accessToken
  const token = await fakeGetAccessTokenFromServer(user.userId, docId);

  // 生成编辑服务需要的认证信息
  const auth: AuthMessage = {
    appId: AppId,
    ...user,
    docId,
    token,
    permission: 'w',
  };

  // 创建编辑器并加载文档
  const editor = createEditor(document.getElementById('editor') as HTMLElement, options, auth);
})();
