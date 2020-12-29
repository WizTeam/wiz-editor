/* eslint-disable no-alert */
// eslint-disable-next-line import/no-unresolved
import EncryptJWT from 'jose/jwt/encrypt';
import {
  createEditor,
  assert,
  boxUtils,
  BoxData,
  BoxNode,
  BoxTemplateData,
  BoxTextChild,
  Editor,
  AutoSuggestData,
  BOX_TYPE,
} from 'wiz-editor/client';
import { AuthMessage } from 'wiz-editor/commons/auth-message';

function hideElement(id: string) {
  const elem = document.getElementById(id);
  if (!elem) return;
  elem.style.display = 'none';
}

hideElement('header');
hideElement('toolbar');


// -------------------create a custom label item----------
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

function handleBoxInserted(editor: Editor, data: BoxData): void {
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
  userId: `${new Date().valueOf()}`,
  displayName: 'test user',
};

// 设置编辑器选项
const options = {
  serverUrl: WsServerUrl,
  user,
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
const docId = 'my-test-doc-id-box-label';

(async function loadDocument() {
  // 验证身份，获取accessToken
  const token = await fakeGetAccessTokenFromServer(user.userId, docId);

  // 生成编辑服务需要的认证信息
  const auth: AuthMessage = {
    appId: AppId,
    userId: user.userId,
    docId,
    token,
    permission: 'w',
  };

  // 创建编辑器并加载文档
  const editor = createEditor(document.getElementById('editor') as HTMLElement, options, auth);
})();
