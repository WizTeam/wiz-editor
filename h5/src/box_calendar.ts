/* eslint-disable no-alert */
// eslint-disable-next-line import/no-unresolved
import EncryptJWT from 'jose/jwt/encrypt';
import {
  createEditor,
  assert,
  boxUtils,
  BoxData,
  BoxNode,
  BoxImageChild,
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


// -------------------create a custom calendar item----------
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

// 从应用服务器获取一个AccessToken。应用服务器许需要负责验证用户对文档的访问权限。
// accessToken采用jwt规范，里面应该包含用户的userId，文档的docId，以及编辑应用的AppId。
// 下面是一个演示例子。在正常强况下，AccessToken应该通过用户自己的应用服务器生成。
// 因为在前端使用JWT加密规范的时候，必须在https协议下面的网页才可以使用。为了演示，
// 我们的自带的测试服务器会提供一个虚拟的token生成功能。（启动服务的时候，需要指定--enable-fake-token-api 参数）
// 

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
const docId = 'my-test-doc-id-box-calendar';

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
