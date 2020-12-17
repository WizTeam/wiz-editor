# 演示：在编辑器里面插入日期

运行demo

```
cd h5
npm run date
```

[查看源码](../../h5/src/box_date.ts)


主要代码

```ts
const DATE_BOX_TYPE = 'date';

interface DateBoxData extends BoxData {
  text: string;
};

function createNode(data: BoxData): BoxNode {
  //
  const { text } = data as DateBoxData;
  //
  return {
    classes: ['box-mention'],
    children: [{
      type: 'text',
      text,
    } as BoxTextChild],
  };
}

async function createBoxData(editor: Editor): Promise<BoxTemplateData | null> {
  return {
    text: new Date().toLocaleDateString(),
  };
}

const dateBox = {
  prefix: 'dd',
  createNode,
  createBoxData,
};

boxUtils.registerBoxType(DATE_BOX_TYPE as BOX_TYPE, dateBox);
```

插入日期例子中，当用户输入dd，将会快速的插入当前日期。

