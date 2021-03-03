# 响应编辑器事件

在创建编辑器的时候，可以现象编辑器事件：

```ts

export interface EditorOptions {
  lang?: LANGS;
  serverUrl: string;
  user: EditorUser;
  ...
  callbacks?: {
    onLoad?: (editor: Editor, data: EditorDoc) => void;
    onError?: (editor: Editor, error: Error) => void;
    onSave?: (editor: Editor, data: EditorDoc) => void;
    onChange?: (editor: Editor) => void;
    onRemoteUserChanged?: (editor: Editor, users: OnlineUsers, change: OnlineUserChange) => void;
    onStatusChanged?: (editor: Editor, isDirty: boolean) => void;
    onReauth?: (userId: string, docId: string, permission: AuthPermission) => Promise<string>;
    onGetMentionItems?: (editor: Editor, keywords: string) => Promise<AutoSuggestData[]>;
    onMentionInserted?: (editor: Editor, boxData: MentionBoxData, block: BlockElement, pos: number) => void;
    onMentionClicked?: (editor: Editor, boxData: MentionBoxData, block: BlockElement) => void;
    onGetTagItems?: (editor: Editor, keywords: string) => Promise<string[]>;
    onTagInserted?: (editor: Editor, tag: string, block: BlockElement, pos: number) => void;
    onTagClicked?: (editor: Editor, tag: string) => void;
    onCommentInserted?: (editor: Editor, commentId: string, commentDocText: string, commentText: string, selectedBlock: SelectedBlock) => void;
    onCommentReplied?: (editor: Editor, toUserId: string, orgCommentText: string, commentText: string) => void;
    onRenderAutoSuggestItem?: (editor: Editor, suggestData: AutoSuggestData) => HTMLElement;
    onGetBlockCommand?: (editor: Editor, block: BlockElement, detail: SelectionDetail, type: 'fixed' | 'hover' | 'menu') => CommandItemData[];
    onCommandStatusChanged?: (editor: Editor, status: CommandStatus) => void;
    onCheckboxChanged?: (editor: Editor, text: string, blockData: BlockData, mentions: BoxData[], calendars: BoxData[]) => void;
    onMarkerCreated?: (editor: Editor, text: string, blockData: BlockData) => void;
    onQuickInput?: (editor: Editor, event: KeyboardEvent | null, block: BlockElement, text: string, offset: number) => boolean;
    onUploadResource?: (editor: Editor, file: File, onProgress: OnProgress) => Promise<string>;
    onTitleChanged?: (editor: Editor, docId: string, title: string) => void;
    onGetChartJsData?: (editor: Editor, data: string) => Promise<any>;
    onUpdateToc?: (editor: Editor, toc: EditorDocToc) => void;
    onCustomMessage?: (editor: Editor, data: string) => void;
  };
};

```
