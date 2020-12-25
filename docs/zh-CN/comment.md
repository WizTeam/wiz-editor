# 响应评论消息

编辑器允许评论。可以通过callback来响应评论创建和回复。

```ts
function handleCommentInserted(commentId: string, commentDocText: string, commentText: string, selectedBlock: SelectedBlock): void {
  // commentDocText: 文档中被评论的文字内容
  // commentText: 评论内容
  console.log(`comment created: ${commentText}`);
  assert(selectedBlock);
}

function handleCommentReplied(toUserId: string, orgCommentText: string, commentText: string): void {
  assert(commentText);
  // toUserId：被评论的用户id
  // orgCommentText： 被回复的评论内容
  // commentText：评论内容
  console.log(`comment replied to ${toUserId}: ${commentText}`);
}

const options = {
  ...
  callbacks: {
    ...
    onCommentInserted: handleCommentInserted,
    onCommentReplied: handleCommentReplied,
  },
};
```
