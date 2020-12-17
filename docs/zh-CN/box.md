# wiz-editor 自定义box方法

wiz-editor里面，可以在文本中插入自定义类型数据，例如用户提醒（@xxx），日历事件，等等。
box类型，在html里面，由一个span标签包含，可以在这个span里面，包含image和文字。
这个span，将会作为一个整体出现在编辑器里面，不可以对里面的内容进行编辑。


## box定义：

```ts
interface Box {
  prefix?: string;
  suggestPlaceholder?: string;
  createNode: (data: BoxData) => BoxNode,
  getItems?: (editor: Editor, keywords: string) => Promise<BoxItemData[]>;
  createBoxDataFromItem?: (editor: Editor, item: BoxItemData) => BoxTemplateData;
  createBoxData?: (editor: Editor) => Promise<BoxTemplateData | null>;
  handleBoxInserted?: (editor: Editor, data: BoxData) => void;
  handleBoxClicked?: (editor: Editor, data: BoxData) => void;
  handleBoxItemSelected?: (editor: Editor, item: BoxItemData) => void;
};
```

### prefix:（可选）
是指触发输入box的文字，例如对于提醒类型的box，prefix为@。当用户在键盘输入@之后，会自动触发插入提醒的操作。
prefix可以是一个或者多个字符，也可以没有。如果没有prefix，则用户只能通过工具栏/菜单来插入box。

### suggestPlaceholder:（可选）
在通过键盘触发插入box事件之后，编辑器可能会自动显示一个auto suggest（依赖于是否实现了getItems方法）。
在用户继续输入内容的时候，auto suggest会自动过滤items，如果没有找到匹配的items，则会显示这个placeholder。

### createNode：（必要）
用来向编辑器描述如何创建一个box。该方法返回BoxNode类型。

```ts

interface BoxChild {
  type: 'text' | 'image';
  classes?: string[];
  attributes?: {
    [index: string]: string
  };
};

interface BoxTextChild extends BoxChild {
  text: string;
};

interface BoxImageChild extends BoxChild {
  src: string;
  alt?: string;
};

interface BoxNode {
  classes?: string[];
  attributes?: {
    [index: string]: string
  };
  children?: BoxChild[];
};
```

### getItems， createBoxDataFromItem: (可选)
如果提供了getItems方法，在用户输入prefix之后，将会调用这个方法，获取一个auto suggest列表，并显示给用户进行选择。
如果用户继续输入内容，那么编辑器会不断调用这个方法（传入的keywords不同）。该方法应该根据keywords，返回相应的数据。

```ts
interface BoxItemData {
  iconUrl: string;
  text: string;
  id: string;
  data: any,
};
```

如果用户通过auto suggest选择了一个item，那么编辑器会调用createBoxDataFromItem方法，来获取一个box数据。
应用需要实现该方法，将用户选择的item，转换为一个box数据。

```ts
interface BoxTemplateData {
  [index: string]: string | boolean | number | undefined,
};
```

如果没有提供getItems方法，并且提供了prefix，那么在用户输入prefix之后，会自动调用createBoxData方法，创建一个box并且自动插入。其中没有任何交互。

### createBoxData (可选)

要求创建一个box数据，该方法为异步方法。如果无法创建，可以返回null。


### handleBoxInserted, handleBoxClicked, handleBoxItemSelected: (可选)

响应用户交互事件。

例如当某一个box被插入的时候，可能会触发某些消息的产生。可以在相应的方法里面进行处理。

## 向编辑器注册box

```ts
import {
  boxUtils,
} from 'wiz-editor/client';

const someBox = {
  ...
};

boxUtils.registerBoxType('some_box_type' as BOX_TYPE, someBox);
```

其中box的类型需要唯一。如果使用typescript，需要显示将类型字符串转换为BOX_TYPE类型。

## 相关例子

1. [增加插入日历事件功能](./calendar.md) （通过用户选择的item，创建不同的box）
2. [增加插入日期功能](./date.md) （通过快捷指令，输入当前日期）
3. [增加插入label功能](./label.md) （通过用户选择，插入不同的label）
