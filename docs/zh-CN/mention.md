
# 增加提醒（@xxx人）功能

运行demo

```sh
cd h5
npm run mention
```

[查看源码](../../h5/src/mention.ts)

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

const ALL_USERS: AutoSuggestData[] = [];

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
// 在用户输入过程中，会不断的调用该方法。应用应该通过keywords进行过滤
async function fakeGetMentionItems(editor: Editor, keywords: string): Promise<AutoSuggestData[]> {
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
例如，您可以在创建一个提醒的时候，通过企业的消息系统，向相关用户发送一条消息。

同样，可以在创建编辑器的时候，设置相应的回调方法：

```ts
function handleMentionInserted(editor: Editor, boxData: MentionBoxData, block: BlockElement, pos: number) {
  console.log(`mention ${JSON.stringify(boxData)} inserted at ${pos}`);
  // 提醒前面的文字
  const leftText = blockUtils.toText(block, 0, pos);
  // 提醒后面的文字
  const rightText = blockUtils.toText(block, pos + 1, -1);
  // 定位锚点，可以用来给在文档中定位该提醒
  const anchorId = `M${boxData.id}`;
  alert(`anchor id: ${anchorId}\n\ncontext text:\n\n${leftText}\n\n${rightText}`);
}

function handleMentionClicked(editor: Editor, boxData: MentionBoxData) {
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

上面的代码，可以通过在h5例子下面，运行npm run mention来查看效果。


wiz-editor内置的editor，通过box来实现。具体原理，请参考[box](./box.md)。
