# 向在线的用户发送自定义消息

利用这个功能，可以给正在编辑同一文档的用户发送自定义的消息

```ts

function handleLoad(editor: Editor, data: any): void {
  console.log(`${editor.docId()} loaded`);
  // 发送一个自定义消息
  editor.postCustomMessage('I\' am in.');
}

function handleCustomMessage(editor: Editor, data: string) {
  console.log(data);
}


const options: EditorOptions = {
  serverUrl: WsServerUrl,
  callbacks: {
    // 编辑器成功加载文档
    onLoad: handleLoad,
    // 接收到远程自定义消息
    onCustomMessage: handleCustomMessage,
  },
};
```