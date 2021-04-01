/* eslint-disable no-alert */
// eslint-disable-next-line import/no-unresolved
import { saveAs } from 'file-saver';
import {
  Editor,
  createEditorPromise,
  assert,
  BlockElement,
  blockUtils,
  containerUtils,
  CommandItemData,
  MenuItem,
  domUtils,
  getEditor,
  AuthMessage,
  OnProgress,
  EditorOptions,
  SelectionDetail,
  EditorDoc,
} from 'wiz-editor/client';

const AppId = '';

const user1 = {
  avatarUrl: 'https://www.wiz.cn/wp-content/new-uploads/2285af20-4006-11eb-8f21-01eb48012b63.jpeg',
  userId: 'test',
  displayName: 'test',
};

// --------------------------- mention data ----------------

function createLoadDataMenuItem(block: BlockElement) {
  const menuItem = MenuItem.createElement(document.documentElement, {
    id: '',
    text: 'Load data...',
  });
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  domUtils.addClass(input, 'menu-item-input');
  //
  menuItem.appendChild(input);
  //
  input.onchange = (event: Event) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    assert(block);
    const editor = getEditor(block);
    const container = containerUtils.getParentContainer(block);
    const index = containerUtils.getBlockIndex(block);
    if (!blockUtils.isEmptyTextBlock(block)) {
      // eslint-disable-next-line no-param-reassign
      block = editor.insertTextBlock(container, index + 1, '');
    }
    //
    assert(event.target);
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const data = JSON.parse(reader.result as string);
        // eslint-disable-next-line no-use-before-define
        loadDocument(document.getElementById('editor') as HTMLElement, '', data);
      };
      input.files = null;
      input.value = '';
    }
  };
  return menuItem;
}

function handleGetBlockCommand(editor: Editor, block: BlockElement, detail: SelectionDetail, type: 'fixed' | 'hover' | 'menu'): CommandItemData[] {
  if (type === 'menu') {
    //
    const loadDataMenuItem = createLoadDataMenuItem(block);
    //
    return [{
      id: '',
      text: 'Load data',
      order: 200,
      element: loadDataMenuItem,
      onClick: () => {},
    }, {
      id: '',
      text: 'Save data',
      order: 200,
      onClick: () => {
        const editor = getEditor(block);
        const data = JSON.stringify(editor.data());
        const titleBlock = containerUtils.getBlockByIndex(editor.rootContainer(), 0);
        const title = blockUtils.getBlockPlainText(titleBlock);
        const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `${title}.json`);
      },
    }];
  }
  return [];
}

function replaceUrl(docId: string) {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const now = window.location.href;
  if (now.endsWith(docId)) return;
  //
  const newUrl = `${window.location.origin}${window.location.pathname}?id=${docId}`;
  window.history.pushState({}, '', newUrl);
  //
  localStorage.setItem('lastDocId', docId);
}

function handleUploadResource(editor: Editor, file: File, onProgress: OnProgress): Promise<string> {
  onProgress!;
  return domUtils.fileToDataUrl(file);
}
//

async function loadDocument(element: HTMLElement, docId: string, initLocalData?: EditorDoc): Promise<Editor> {
  //
  const auth: AuthMessage = {
    appId: AppId,
    ...user1,
    permission: 'w',
    docId,
    token: '',
  };

  //
  const options: EditorOptions = {
    local: true,
    initLocalData,
    serverUrl: '',
    placeholder: 'Please enter document title',
    // markdownOnly: true,
    lineNumber: true,
    titleInEditor: true,
    hideComments: true,
    callbacks: {
      onGetBlockCommand: handleGetBlockCommand,
      onUploadResource: handleUploadResource,
    },
  };
  const editor = await createEditorPromise(element, options, auth);
  assert(editor);
  return editor;
}

loadDocument(document.getElementById('editor') as HTMLElement, '').then((editor) => {
  replaceUrl(editor.auth.docId);
});
