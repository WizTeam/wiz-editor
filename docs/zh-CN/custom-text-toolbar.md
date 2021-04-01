# 自定义文字浮动工具栏

wiz editor允许您自己定义选中文字后显示的浮动工具栏。具体方式如下：

```ts
class CustomTextToolbar extends TextToolbar {
  div: HTMLElement;

  events = new EventEmitter();

  constructor() {
    super();
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.width = '200px';
    div.style.height = '44px';
    div.style.backgroundColor = '#f0f0f0';
    div.style.border = '1px solid #cccccc';
    div.innerText = 'Custom text toolbar';
    this.div = div;
    document.body.appendChild(div);
  }

  hide(forcedToHide?: boolean): void {
    console.log('hide toolbar', forcedToHide);
    this.div.style.display = 'none';
    this.events.emit('hide');
  }

  isVisible(): boolean {
    return this.div.style.display !== 'none';
  }

  handleMouseMove(event: MouseEvent): boolean {
    console.log(event);
    return false;
  }

  on(event: 'hide' | 'show', callback: (...args: any[]) => void): void {
    console.log(event, callback);
    this.events.on(event, callback);
  }

  isVisibleForTextBlock(): boolean {
    return false;
  }

  isMyPopover(popover: Popover): boolean {
    console.log(popover);
    return false;
  }

  update(editor: Editor, force: boolean): void {
    console.log('update toolbar', force);
    // 当鼠标在一个block上面移动的时候，就会调用这个方法
    // 获得当前选中的内容
    const sel = editor.getSelectionDetail();
    if (sel.collapsed) {
      // 是否选中文字
      if (this.isVisible()) {
        this.hide();
      }
      return;
    }
    //
    // 当前是否已经显示
    if (this.isVisible()) {
      return;
    }
    //
    // 获取选中部分区域
    const rect = sel.range.getBoundingClientRect();
    // 显示自定义工具栏
    this.div.style.display = '';
    this.div.style.left = `${rect.left}px`;
    this.div.style.top = `${rect.top - 44}px`;
    // 触发显示事件
    this.events.emit('show');
  }

  // 更新工具栏状态。例如当用户点击工具栏上面的某些按钮（粗体/斜体等）
  // 此时文字样式已经发生变化，编辑器将会调用这个方法，
  // 并且将新的状态传入 （status）
  updateStatus(editor: Editor, status: CommandStatus): void {
    console.log('update toolbar status', status);
  }
}
```

创建编辑器的时候，将自定义的工具栏传递给编辑器：

```ts
const options: EditorOptions = {
  serverUrl: WsServerUrl,
  template,
  templateValues,
  textToolbar: new CustomTextToolbar(),
  ...
};
```

通过这种方式，您就可以用自己的工具栏，来代替编辑器内置的工具栏。
