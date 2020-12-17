# 演示：在编辑器里面插入日历事件

运行demo

```
cd h5
npm run calendar
```

[查看源码](../../h5/src/box_calendar.ts)

主要代码

```ts
const CALENDAR_IMAGE_URL = 'https://www.wiz.cn/wp-content/new-uploads/b75725f0-4008-11eb-8f21-01eb48012b63.jpeg';
const CALENDAR_BOX_TYPE = 'calendar';

interface CalendarBoxData extends BoxData {
  text: string;
};

function createNode(data: BoxData): BoxNode {
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

function handleBoxItemSelected(editor: Editor, item: BoxItemData): void {
  //
  const pos = editor.saveCaretPos();
  //
  if (item.id === 'selectEvent') {
    alert('select one event');
    //
  } else if (item.id === 'createEvent') {
    alert('create one event');
    //
  }
  //
  if (!editor.tryRestoreCaretPos(pos)) {
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
```

插入calendar事件例子中，实现了根据用户选择的item，进行不同的响应，然后插入不同（或者相同）的box。
