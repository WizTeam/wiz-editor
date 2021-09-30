# WizEditor辑器更新历史

## 419
1. 修复粘贴excel无法粘贴文字的问题
2. 兼容空的表格

## 418
1. 修复粘贴表格可能丢失文字的问题

## 417
1. 允许appId长度为2个字符

## 416
1. 支持阿里云redis集群
2. 修复markdown转换可能有多余空行的问题
2. 允许drawio放弃编辑
2. 粘贴html，将pre转换为code

## 415
1. 优化粘贴html功能，不添加多余的空格
2. 修正drawio无法编辑的问题
2. 优化导出markdown功能
2. 调整图片loading样式

## 414
1. 给toc增加点击回调
2. 修复图片缩放按钮可能错位的问题
2. 优化图片loading样式
2. 优化导出docx功能

## 413
1. 给drawio增加loading状态

## 412
1. 修复包含code的文档转换为纯文本bug
2. 修复执行block menu的时候页面可能跳动的问题
2. 给预览的文件增加编辑按钮
2. 给文件box增加编辑功能
2. 导出markdown，支持导出评论
2. 修复部分快捷键在windows上面无法使用的问题（对齐，引用）
2. 优化表格宽度调整
2. 新建表格，默认输入文字不强制换行
2. 增加text转换为doc的功能
2. 输入数学公式，需要使用空格键进行确认再转换
2. 输出markdown，对于特殊字符进行转义
2. 在两个\`之间粘贴文字，尝试自动识别为code
2. 优化markdown导入导出，增加忽略空行选项
2. 导入markdown兼容typora的空行策略
2. 正在上传的图片增加占位
2. 移动端给文件card设置默认宽度
2. 修复下载图片可能失败的问题
2. 修复safari下面card，视频等无法撑起单元格的问题

## 411
1. 增加分割线之后，光标放在分割线下面
2. 移动端取消hover状态和样式
2. 增加评论禁止回复，禁止编辑选项
2. drawio支持控制语言
2. 修改drawio数据保存方式，不再把数据保存到json里面
2. 增加drawio保存数据错误回调
2. 修复drawio中文乱码问题

## 410
1. 修复导出word文字大小错误问题
2. 给空的drawio增加样式
2. 修复快捷方式可能无效的问题

## 409
1. 导出word支持字体，大小，颜色，背景色
2. 导出word支持自定义默认的字体大小
2. 支持导出markdown
2. 修复超大表格复制出错的问题

## 408
1. 修复表格工具栏显示逻辑

## 407
1. 支持右键复制图片

## 406
1. 修复无法修改锁定的表格内的input的问题
2. 支持右键菜单单独复制图片
2. 完善reload部分事件清理
2. 避免有多个编辑器的时候，tooltip重复的问题
2. 可以通过esc取消公式编辑对话框
2. 修复可能无法执行cut的问题
2. 修复表格分割线可能错位的问题
2. 增加Alt+T，Alt+B，Alt+H快捷键，可以快速设置颜色
2. 支持连续四个\$输入公式
2. 支持只读模式显示查找对话框

## 405
1. 修复插入数学公式错误进行编辑的问题
2. block锁定的情况下，允许修改input

## 404
1. 修复表格更改大小bug
2. 修复某些快捷键无效的问题
2. 修复文件拖放bug

## 403
1. 增加onFileCardClick点击事件
2. 点击box的时候自动选中整个box
2. 修复自动完成的bug
2. 禁止readonly模式下更改iframe大小

## 402
1. 禁止浏览器的右键菜单

## 401
1. 修复某些情况下编辑器可能变成只读的问题
2. 修复某些情况下锁定的表格内容仍然可以修改的问题

## 400
1. 优化手机样式

## 399
1. 提供禁用表格工具栏选项
2. box下拉框增加选项
2. \[服务端\]增加删除快照功能

## 398
1. 修复无法复制图文到其他应用的问题
2. 优化markdown转换功能

## 397
1. 修复滚动条可能无响应的问题
2. 修复在表格中可以插入code的问题
2. 增加导出markdown功能
2. 增加插入toc功能
2. 记住图片高度，避免页面加载的时候高度变化
2. 修复表格中图片缩放的一些bug
2. 优化右键菜单，显示快捷键
2. 插入code，记住最后选择的语言

## 396
1. 优化code的语言，常用语言放在最前面

## 395
1. 调整 list 中的 查看脑图、插入成员、插入时间 显示规则（移动端 或 宽度小于 512 时隐藏）
2. 更改语言后重新高亮
2. 编辑器增加行号

## 394
1. 避免复制code页面跳动

## 393
1. 增加导出为docx功能
2. 增加禁止下载office文件功能
2. 修改math输入框样式
2. 优化code语言选择框样式

## 392
1. 增加集群支持

## 391
1. 修正表格更改大小错误

## 390
1. bug修复：被锁定的内容可以进行文字替换
2. bug修复：表格里面的checkbox背景颜色错误
2. bug修复：修复表格被锁定的情况下仍然可以修改里面内容的问题
2. bug修复：修复表格被锁定的情况下仍然可以修改宽度，插入行列等问题
2. bug修复：修复某些情况下无法复制表格的问题
2. bug修复：修复文字和图片可能无法同时选中的问题
2. bug修复：修复可能无法调整表格列宽的问题
2. 允许在多选单元格的情况下插入行和列
2. 优化：表格命令状态
2. 优化：图片选择
2. 优化：数学公式渲染
2. 优化：优化粘贴html样式
2. 服务端：增加集群管理，当文档已经被另一个节点服务的时候，通知所有的集群节点使缓存失效

## 389
1. 优化表格粘贴操作
2. 修复表格列宽调整bug
2. code增加Racket语言
2. 删除最后一个评论的时候，触发onUpdateLayout
2. 增加onGetPreviewInfo回调，允许返回自定义的预览信息
2. bug修复：在文档标题前面回车无法换行的问题
2. bug修复：包含图片时，无法复制完整选中部分
2. bug修复：无法正确选择图片的问题（包含多个图片的block）
2. bug修复：可能无法删除某些文字的bug
2. 优化错误信息处理

## 388
1. 支持token里面包含用户名称，用户头像，增强安全性
2. op中允许包含del和create操作

## 387
1. 自动修复可能有问题的op
2. 修复表格粘贴可能不全的问题

## 386
1. bug fix: 中文输入法状态下标题可能无法正常删除的问题

## 385
1. 修改文字中空格渲染的方式
2. 从inline-code中删除serif字体
2. markdown转换识别br
2. 调整评论交互，优化ios下面的评论体验

## 383
1. 修复表格选中状态可能无法清除的问题

### 383
1. list block作为mindmap查看，取消focused显示，仅保留hover
2. bug fix: 复制代码粘贴的时候，将代码转换为纯文本
2. office 文件支持下载打开编辑
2. 增加save office回调
2. 支持通过键盘选中图片
2. \[服务端\]增加migrate api
2. 支持更新插入的文件
2. 更改text input渲染方式，增加inline style样式设置

text input 点击和更改数据方式：

```TypeScript
function handleInputClicked(editor: Editor, box: BoxData, event: Event): void {
  console.log(box, event);
  setTimeout(() => {
    const color = ['red', 'green', 'blue'][Date.now() % 3];
    editor.updateBoxData(box.id, {
      value: `clicked on ${new Date().toLocaleTimeString()}`,
      inlineStyle: `color: ${color}`,
    });
  }, 300);
}

const options = {
  ...
  callbacks: {
    ...
    onInputClicked: handleInputClicked,
  },
};
```
## 382
1. 修复拖拽code可能出错的问题
2. 修复markdown表格支持
2. 避免 在 code 内移动鼠标时， BlockMenuButton 不断闪烁

## 381
1. 优化markdown支持，更符合markdown标准
2. 调整code样式
2. 允许上传任意文件
2. 支持通过客户端导出docx
2. 调整列表样式，避免列表折行后不对齐
2. Link 点击编辑按钮时，自动关闭 editableToolbar； 编辑器 destroy 时，自动关闭 editableToolbar
2. 修复markdown导入bug
2. 修正数学公式输入框样式
2. \[服务端\]上传文件错误包含错误代码

## 380
1. 支持markdown里面的html代码
2. 兼容firefox

## 379
1. \[服务端\]兼容旧版本node

## 378
1. 增加下载图片回调，可以让外部拦截下载图片功能（利用客户端跨域下载图片）
2. 调整数学公式夜间样式
2. 调整错误图片样式
2. \[服务端\]，修复复制文档时可能不是最新版本的问题

## 377
1. 调整code的样式
2. 增加复制code功能
2. 调整emit错误顺序
2. 支持代码换行
2. 修正 img 缺省图片位置，避免 裂图显示
2. 导出docx支持字体大小和颜色
2. 修复markdown2doc的错误
2. code增加kotlin支持
2. 修复代码输入可能的错误

## 376
1. 修复code里面可能错误识别快速输入的bug
2. 支持block内软回车
2. bug修复：修复在code前后删除内容报错的问题
2. bug修复：支持在code后面继续输入纯文本
2. 增强：如果编辑器最后是一个图片等block，点击最后面空白，自动添加空白文字行
2. 在列表内支持输入软回车
2. bug修复：修复表格工具栏错位问题
2. 修复firefox兼容问题
2. 支持粘贴office里面的本地图片
2. 增加disableAudio选项
2. 修复markdown转换的时候，没有decode html标签的问题

## 375
1. 修复@可能无效的bug

## 374
1. 调整提醒下拉框UI
2. toHeading命令，支持取消当前heading
2. \[服务端\]fake token api支持指定权限

## 373
1. \[服务端\]导出docx/pdf支持指定版本
2. \[服务端\]获取text支持指定版本
2. 修复表格bug：在合并的单元格前后插入列

## 372
1. 修正mindmap按钮问题
2. 给text input增加关闭autocommplete属性

## 371
1. 修复firefox崩溃的问题

## 370
1. 修正夜间模式问题
2. 修正新建评论可能报错的问题
2. 修正code block选中的问题
2. 增加复制粘贴是否保留offcie文件字体设置的开关：

```TypeScript
{
  ...
  officeConverter?: {
    convertList?: boolean;
    convertFont?: boolean;
  },
}
```
## 369
1. 修复某些导入的文档无法显示的问题

## 368
1. 修正表格选中部分命令状态问题

## 367
1. 修改表格选中判断逻辑
2. 修改图片失败的样式
2. 修正markdown转换为doc的错误

## 366
1. 修正有删除线的时候无法正常显示光标的问题
2. 修正部分样式

## 365
1. 修正错误处理逻辑

## 364
1. editor.~~executeTextCommand~~增加inline-style-命令支持，可以支持设置字体名称和字体大小。

```TypeScript
editor.executeTextCommand('inline-style-font-size', {'inline-style-font-size': '12px'});
editor.executeTextCommand('inline-style-font-family', {'inline-style-font-family': 'Times New Roman'});
```
获取当前样式：`editor.getDetailCommandStatus(editor.getSelectionDetail())`

2. 修正表格选中判断。
 

## 363
1. mindmap增加视图自适应按钮
2. 修正导出markdown后code类型无法识别的问题。
2. 错误图片增加选中outline
2. \[服务端\]增加wmf/emf导入功能

## 362
1. 修正删除表格按钮显示规则
2. \[服务端\]版本列表增加创建时间

## 361
1. 修复中文输入可能报错的问题
2. 修正可能无法点击block menu button的问题

## 360
1. \[服务端\]复制文档时，支持指定版本

## 359
1. 修正表格阴影显示

## 358
1. 兼容低版本safari（夜间模式）
2. 修正mermaid样式
2. fixed issue : 选中 TextBlock 内的 box 不应该显示 TextToolbar
2. 修正内存占用
2. 修改打字机模式，底部增加padding。
2. TextToolbar增加updatePosition方法
2. 增加keepalive 超时功能。

## 357
1. 调整text input大小策略
2. 修正mermaid的theme（夜间模式等）事件监听方式
2. 修复完整删除多行文字，没有保留空行的bug
2. 给编辑器增加adjustTextInputSize方法

## 356
1. 增加获取纯文本功能

## 355
1. 优化自动调整文字input大小功能

## 354
2. \[服务器\]，修复通过模版创建文档大小限制的问题
2. 优化内存占用
2. 修改websocket重连机制，心跳包没有回复3次后强制重连
2. 优化编辑器loader显示规则，超过300ms文档没有加载完成，再显示loader
2. 自动调整文字input大小
2. 增加checkbox可点击区域大小
2. 修复可能无法删除表格行/列的问题

## 353
1. 修复更改block类型后lock info丢失的问题
2. 修复列表继续编号可能会导致前面的list编号错误的问题
2. 无法显示的图片，显示占位图，同时增加错误回调:

```TypeScript
onImageError?: (editor: Editor, image: HTMLImageElement) => void;
```
2. 避免插入id相同的box，如果id相同则报错
2. \[服务端\]: 增加revoke token功能

## 352
1. 修改onRecognizeLink回调添加参数:

```TypeScript
onRecognizeLink?: (editor: Editor, text: string, block: BlockElement, options: { offset: number, count: number }) => Promise<{ text: string, link: string, processed?: boolean} | null>;
```
2. 添加参数 block和options，返回参数processed，支持外部拦截插入链接消息并进行处理。如果外部已经处理了插入链接消息，则返回processed为true。

## 349
2. 修复可以剪切锁定的block的问题
2. 调整只读模式下右键菜单显示规则

## 348
1. 添加编辑器选项readonlyTitlePlaceholder，readonly模式下显示标题placeholder
2. \[服务端\] 上传大文件不再强制关闭链接
2. \[服务端\] 导入doc文件，修正表格导入bug
2. 添加source到文档create消息，可以区分revert和主动create。

## 347
1. 修复移动端checkbox右边padding大的问题
2. block被锁定的时候禁止拖动图片

## 346
1. \[服务端\]docx支持input的导出
2. 修复表格工具栏按钮重复问题
2. markdown模式下禁止出现合并单元格按钮
2. 前端内存占用优化
2. wiki link选择框宽度限制

## 345
1. 执行文字命令，排除掉被锁定的block
2. 评论部分样式，修复名字超长引起日期显示不全的问题
2. 修复跨页表格无法多选的问题
2. 修复表格插入新行/新列位置可能错误的问题

## 344
1. 修复锁定block可能无效的问题

## 343
1. 修复mindmap样式的问题

## 342
1. online user增加用户权限数据
2. 调整日历样式（不可选择的日期样式）
2. 调整插入layout的逻辑，和table保持一致
2. \[服务端\] 超过2k的op保存成文件，避免数据库里面存储超大数据

## 341
1. 插入网页的时候，不再保留协议，默认采用//开头，和当前页面协议保持一致。

## 340
1. 增加单独清除文字格式命令
2. 修改保存/恢复选中部分状态功能，不再依赖dom
2. \[服务端\] 修复word导入表格数据可能有问题的bug

