# wiz-editor-examples

直接从git clone或者下载代码，解压缩到磁盘。

## 运行react 例子

1. 安装和运行

```sh
cd react-demo
npm install
npm start
```

2. 打开浏览器

```
localhost:9000
```

## 运行原生js例子

1. 安装和运行

```sh
cd h5
npm install
npm start
```

2. 打开浏览器

```
localhost:9000
```

## 在自己的项目中使用wiz-editor

### 通过npm安装wiz-editor
npm i wiz-editor

### 在项目中使用wiz-editor

```ts
import {
  createEditor,
  Editor,
} from 'wiz-editor/client';

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
// accessToken采用gwt规范，里面应该包含用户的userId，文档的docId，以及编辑应用的AppId。
// 下面是一个演示例子。在正常强况下，AccessToken应该通过用户自己的应用服务器生成。
// 因为在前段使用GWT加密规范的时候，必须在https协议下面的网页才可以使用。为了演示，
// 我们的自带的测试服务器会提供一个虚拟的token生成功能。（启动服务的时候，需要指定--enable-fake-token-api 参数）
// 

async function fakeGetAccessTokenFromServer(userId: string, docId: string): Promise<string> {
  //
  const data = {
    userId,
    docId,
    appId: AppId,
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
const docId = 'my-test-doc-id';

(async function loadDocument() {
  // 验证身份，获取accessToken
  const token = await fakeGetAccessTokenFromServer(user.userId, docId);

  // 生成编辑服务需要的认证信息
  const auth = {
    appId: AppId,
    userId: user.userId,
    docId,
    token,
  };

  // 创建编辑器并加载文档
  const editor = createEditor(document.getElementById('editor') as HTMLElement, options, auth);
})();

```

通过上面的代码，就可以在自己的应用中，创建一个多人实时协同编辑器。
上面的代码，可以通过在h5例子下面，运行npm run simple来查看效果。


### 增加提醒（@xxx人）功能

wiz-editor内置了提醒功能。如果需要使用这个功能，那么在初始化编辑起的时候，至少需要提供一个方法，用来获取用户列表。
下面是一个演示例子：

```ts

// 生成一些人名
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

const ALL_USERS: BoxItemData[] = [];

// 生成用户列表数据
NAMES.forEach((name) => {
  const user = {
    iconUrl: 'http://www.wiz.cn/wp-content/new-uploads/2285af20-4006-11eb-8f21-01eb48012b63.jpeg',
    text: name,
    id: name,
    data: name,
  };
  ALL_USERS.push(user);
});

// 模拟从用户的应用服务器获取用户列表。如果没有关键字，默认返回全部数据
async function fakeGetMentionItems(keywords: string): Promise<BoxItemData[]> {
  assert(keywords !== undefined);
  console.log(keywords);
  if (!keywords) {
    return ALL_USERS;
  }
  return ALL_USERS.filter((user) => user.text.toLowerCase().indexOf(keywords.toLowerCase()) !== -1);
}

```

然后在创建编辑器的时候，设置callback方法：

```ts
// 设置编辑器选项
const options = {
  serverUrl: WsServerUrl,
  user,
  callbacks: {
    onGetMentionItems: fakeGetMentionItems,
  },
};

```

就可以在用户输入@的时候，出现一个下拉列表，并提醒用户选择一个用户进行提醒。

业务程序可能会需要在用户创建一个提醒，或者点击提醒的时候进行相应的处理。
例如，您可以在创建一个提醒的时候，通过消息系统，向相关用户发送一条消息。

同样，可以在创建编辑器的时候，设置相应的回调方法：

```ts
function handleMentionInserted(boxData: MentionBoxData) {
  console.log(`mention ${JSON.stringify(boxData)} inserted`);
}

function handleMentionClicked(boxData: MentionBoxData) {
  alert(`you clicked ${boxData.text} (${boxData.mentionId})`);
}

// 设置编辑器选项
const options = {
  serverUrl: WsServerUrl,
  user,
  callbacks: {
    onGetMentionItems: fakeGetMentionItems,
    onMentionInserted: handleMentionInserted,
    onMentionClicked: handleMentionClicked,
  },
};
```

这样在创建一个提醒，或者点击提醒的时候，就会调用相应的方法。

