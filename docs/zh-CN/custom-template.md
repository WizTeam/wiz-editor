# 自定义模版-（模版临时解决方案，后期将会直接内置该功能）

1. 新建一篇文档
2. 按照要求进行编辑，然后将其中的某些内容替换成key，通过{{key}}定义需要替换的内容
3. 保存内容，获得文档json数据。这个json数据，就可以当成模版。
4. 下次新建文档的时候，将模版以及参数传递给编辑器。编辑器将会自动使用模版创建一篇新的文档。


例如模版json文件

```ts
const DocTemplate = `
{
  "blocks": [
    {
      "text": [
        {
          "insert": "{{meet-name}} 会议"
        }
      ],
      "id": "_HNsxMNUe",
      "type": "heading",
      "level": 1
    },
    {
      "text": [
        {
          "insert": "参会人: {{names}}"
        }
      ],
      "id": "_iSAuPm5m",
      "type": "text"
    },
    {
      "text": [
        {
          "insert": "会议日期: {{date}}"
        }
      ],
      "id": "_AgSRfkl_",
      "type": "text"
    },
    {
      "text": [
        {
          "insert": "会议内容:"
        }
      ],
      "id": "_t_xqxWwU",
      "type": "text"
    },
    {
      "text": [],
      "id": "_YZddVF5R",
      "type": "text"
    }
  ],
  "comments": {}
}`;
```

创建文档

```ts
// 生成模版参数
const DocTemplateValues = {
  "meet-name": 'XXX会议',
  names: 'Steve， zTree, OldHu',
  date: new Date().toLocaleDateString(),
};

// 设置创建编辑器参数
const options = {
  ...
  template: JSON.parse(DocTemplate),
  templateValues: DocTemplateValues,
};

// 创建编辑器
const editor = createEditor(document.getElementById('editor') as HTMLElement, options, auth);
```

通过这种方式，就可以自动通过模版创建一篇文档，并自动替换模版里面的参数。
