# 演示：在编辑器里面插入日期

运行demo

```
cd h5
npm run label
```

[查看源码](../../h5/src/label_box.ts)

主要代码

```ts
const LABEL_BOX_TYPE = 'label';

interface LabelBoxData extends BoxData {
  color: string;
};

function createNode(data: BoxData): BoxNode {
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

const labelBox = {
  prefix: 'll',
  createNode,
  getItems,
  createBoxDataFromItem,
  handleBoxInserted,
  handleBoxClicked,
};

boxUtils.registerBoxType(LABEL_BOX_TYPE as BOX_TYPE, labelBox);
```

在这个例子中，演示了如何通过item，来插入一个不同的box。

