# wiz-editor 多人实时编辑器使用说明

wiz-editor是一个支持多人实时协同编辑的网页富文本编辑。

1. 官网：[https://wiz-editor.com/](https://wiz-editor.com/)
2. 在线演示：[https://api.wiz-editor.com/demo.html](https://api.wiz-editor.com/demo.html)


## 编辑器主要特性

1. 支持多人实时协同编辑，单一文档可以支持多达1000人同时编辑器。
2. 支持扩展各种业务模块。可以自定义行内/行间模块。
3. 可以接入业务用户系统及权限，文档权限完全由业务控制。
4. 纯h5原生开发，可以直接嵌入各种web应用中
5. 允许脱离服务端直接使用（此时无多人实时协作能力，可作为传统网页编辑器使用）
6. 支持word文件导入，office文件预览
7. 支持markdown语法
8. 完整的二次开发支持。所有接口均有typescript定义。

## 适用场景

### 开发企业在线文档/wiki等应用。

wiz-editor转为在线文档而开发，已为多家企业提供集成服务。wiz-editor提供了强大的扩展能力，可以将企业的业务集成到文档里面。
例如，常规的提醒，任务，日历等整合，可以和企业内部的IM，任务系统进行整合。同时利用模版能力，可以快速的生成各种文档，例如合同，
周报等。

同时，wiz-editor可以无缝的和企业内部的用户和权限进行整合，无需用户多次登录。

利用wiz-editor多人实时协同编辑的特点，企业内共享的文档，无需担心版本冲突的问题，让文档永远保持最新版本。

### 作为富文本编辑器使用

wiz-editor可以替换传统的网页编辑器，例如各种博客的编辑器等。即使不需要多人实时协同编辑，
也可以单独使用wiz-editor客户端（无需依赖服务端）。这样可以充分利用wiz-editor强大的编辑功能。

### 作为markdown编辑器使用

wiz-editor提供了完整的markdown功能，可以利用markdown语法直接编写文档。同时支持markdown导入/导出功能。


## 编辑器详细功能

### 文字样式

* 标题（1-5）
* 有序/无需列表
* 任务清单 （可以在任务清单中设置截止日期，@相关成员）
* 文字引用
* 文字颜色/背景色
* 粗体，斜体，下划线，删除线等
* 任意的css样式

### 行内对象

* 链接
* latex公式
* 提醒
* 评论
* 其它自定义行内样式

### 块对象

* 文字（普通文字，标题，列表，任务清单）
* 图像，视频，音频
* 表格
* 网页（例如各种视频网站的视频，地图等）
* mermaid图形（Flowchart, Sequence Diagram, Class Diagram等）
* UML图表等（drawio）
* 各种复杂布局
* 图表（chart.js）
* office, pdf文件（支持office, pdf文件预览）
* 代码，支持语法高亮

### 块对象状态

* 锁定状态。可以锁定某些块，则这些块元素无法被删除和编辑
* 手写标记（可通过手写工具标注某些文字并保留记录）

### 编辑器功能

* 支持markdown语法
* 支持markdown only模式（仅支持markdown功能，此时可以作为一个markdown编辑器使用，并且保存数据为markdown）
* 支持离线模式（无需编辑服务，仅作为一个纯前端编辑器，可直接替换业务中原有的编辑器）
* 支持导入/导出markdown
* 支持导出html
* 支持导入docx文件
* 支持focus模式，支持打字机模式
* 支持将列表作为思维导图显示
* 支持theme，支持夜间模式（可自动切换，可禁用）

## 运行demo 

包含编辑器服务端，可以直接在本机测试运行。

直接从git clone或者下载代码，解压缩到磁盘。

注意：**需要nodejs 14或者更高的版本**

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

## 更多demo

```bash
cd h5
# 完整的自定义扩展例子，包含外部工具栏，各种自定义组件等
npm run custom
# 极简编辑器，无外部UI
npm run simple
# 各种自定义box
npm run calendar
npm run date
npm run mention
npm run label
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

// 定义一个用户。该用户应该是由应用服务器自动获取当前用户身份
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
    permission: 'w',
  };

  // 创建编辑器并加载文档
  const editor = createEditor(document.getElementById('editor') as HTMLElement, options, auth);
})();

```

通过上面的代码，就可以在自己的应用中，创建一个多人实时协同编辑器。
上面的代码，可以通过在h5例子下面，运行npm run simple来查看效果。

[查看源码](./h5/src/simple.ts)

## react 组件
[wiz-editor-react](https://github.com/WizTeam/wiz-editor-react)

## 直接在浏览器里面使用（无需npm）

```html
<script src='https://cdn.jsdelivr.net/npm/wiz-editor@0.0.44/client/src/index.js' charset="utf-8"></script>

<script>
const {
  EditorUser,
  Editor,
  createEditorPromise,
  assert,
  BlockElement,
  blockUtils,
  containerUtils,
  CommandItemData,
  MenuItem,
  domUtils,
  getEditor,
  AuthMessage,
  OnProgress,
  EditorOptions,
  SelectionDetail,
  EditorDoc,
} = window.WizEditor;
</script>
```

## 扩展编辑器功能

[编辑器结构](./docs/zh-CN/editor-structure.md)

### 自定义@xxx提醒用户功能

[增加插入提醒功能](./docs/zh-CN/mention.md)

### 响应评论消息

[响应评论消息](./docs/zh-CN/comment.md)

### 自定义inline的模块（box）

[自定义box说明](./docs/zh-CN/box.md)

### 自定义block按钮/菜单

[自定义block按钮/菜单](./docs/zh-CN/custom-context-menu.md)

### 自定义文字样式

[自定义文字样式](./docs/zh-CN/custom-style.md)

### 自定义模版

[自定义文档模版](./docs/zh-CN/custom-template.md)

### 自定义block

[编辑器结构](./docs/zh-CN/editor-structure.md)

[自定义Embed类型block](./docs/zh-CN/embed-block.md)

[自定义Complex类型block](./docs/zh-CN/complex-block.md)

## 服务端

[wiz-editor 服务端适配](./docs/zh-CN/server.md)

[wiz-editor 服务端架构介绍](./docs/zh-CN/server-architecture.md)


## 完全作为本地编辑器使用，无需依赖服务端
[local demo](/local)

## 通过cdn使用编辑器代码
[CDN demo](/cdn)


## 自定义UI
[自定义浮动工具栏](./docs/zh-CN/custom-text-toolbar.md)

## 响应编辑器事件
[响应编辑器事件](./docs/zh-CN/handle-message.md)

## 给在线用户发送自定义消息
[发送自定义消息](./docs/zh-CN/post-custom-message.md)