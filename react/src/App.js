import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import * as WizEditor from 'wiz-editor/client';

//
let tagCount = 0;

//
const MermaidText = `
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
`;

// 定义AppID，AppSecret, AppDomain。在自带的测试服务器中，下面三个key不要更改
const AppId = '_LC1xOdRp';

async function fakeGetAccessTokenFromServer(userId, docId) {
  const res = await fetch(`http://${window.location.host}/token/${AppId}/${docId}/${userId}`);
  const ret = await res.json();
  return ret.token;
}


const NAMES = [
  '龚光杰',
  '褚师弟',
  '容子矩',
  '干光豪',
  '葛光佩',
  '郁光标',
  '吴光胜',
  '唐光雄',
  '枯荣大师',
  '本因大师',
  '本观',
  '本相',
  '本参',
  '本尘',
  '玄愧',
  '玄念',
  '玄净',
  '慧真',
  '慧观',
  '慧净',
  '慧方',
  '慧镜',
  '慧轮',
  '虚清',
  '虚湛',
  '虚渊',
  '摘星子',
  '摩云子',
  '天狼子',
  '出尘子',
  '段延庆',
  '叶二娘',
  '岳老三',
  '云中鹤',
];

const ALL_USERS = [];

NAMES.forEach((name) => {
  const user = {
    iconUrl: 'http://www.wiz.cn/wp-content/new-uploads/2285af20-4006-11eb-8f21-01eb48012b63.jpeg',
    text: name,
    id: name,
    data: name,
  };
  ALL_USERS.push(user);
});

async function fakeGetMentionItems(keywords) {
  WizEditor.assert(keywords !== undefined);
  console.log(keywords);
  if (!keywords) {
    return ALL_USERS;
  }
  return ALL_USERS.filter((user) => user.text.toLowerCase().indexOf(keywords.toLowerCase()) !== -1);
}

function handleMentionInserted(boxData) {
  console.log(`mention ${JSON.stringify(boxData)} inserted`);
}

function handleMentionClicked(boxData) {
  alert(`you clicked ${boxData.text} (${boxData.mentionId})`);
}

//
function App() {

  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);

  const user = {
    userId: `${new Date().valueOf()}`,
    displayName: 'Hunter',
  };

  function replaceUrl(docId) {
    const now = window.location.href;
    if (now.endsWith(docId)) return;
    //
    const newUrl = `${window.location.origin}/?id=${docId}`;
    window.history.pushState({}, '', newUrl);
  }
  
  function handleSave(docId, data) {
    const text = JSON.stringify(data, null, 2);
    console.log('------------------- document data --------------------');
    console.log(text);
    console.log('------------------------------------------------------');
  }

  const [otherUserNames, setOtherUserNames] = useState();
  
  function handleRemoteUserChanged(docId, users) {
    const userNames = [...users].map((u) => u.displayName).join(', ');
    setOtherUserNames(userNames);
  }
  
  function handleLoad(docId, data) {
    replaceUrl(docId);
  };
  
  function handleError(docId, error) {
    console.log(`${docId} error: ${error}`);
    // eslint-disable-next-line no-alert
    alert(error);
  };

  const [isDirty, setDirty] = useState(false);
  
  function handleStatusChanged(docId, dirty) {
    setDirty(dirty);
  }

  async function loadDocument(docId) {

    const token = await fakeGetAccessTokenFromServer(user.userId, docId);

    // 生成编辑服务需要的认证信息
    const auth = {
      appId: AppId,
      userId: user.userId,
      docId,
      token,
      permission: 'w',
    };

    const WsServerUrl = `ws://${window.location.host}`;
    const options = {
      // lang: LANGS.ZH_CN,class
      serverUrl: WsServerUrl,
      user,
      callbacks: {
        onSave: handleSave,
        onRemoteUserChanged: handleRemoteUserChanged,
        onLoad: handleLoad,
        onError: handleError,
        onStatusChanged: handleStatusChanged,
        onReauth: fakeGetAccessTokenFromServer,
        onGetMentionItems: fakeGetMentionItems,
        onMentionInserted: handleMentionInserted,
        onMentionClicked: handleMentionClicked,
        },
    };
    editorRef.current = WizEditor.createEditor(editorContainerRef.current, options, auth);
  }

  useEffect(() => {
    if (!editorContainerRef.current || editorRef.current) {
      return;
    }
    const docId = '_e9kD3NTs';
    loadDocument(docId);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //

  function handleNewPage() {
    const id = WizEditor.genId();
    loadDocument(id);
  }

  function handleUndo() {
    editorRef.current.undo();
  }

  function handleRedo() {
    editorRef.current.redo();
  }

  function handleBold() {
    editorRef.current.executeTextCommand('bold');
  }

  function handleItalic() {
    editorRef.current.executeTextCommand('italic');
  }

  function handleTable() {
    editorRef.current.insertTable(-2, 5, 3);
  }

  function handleTag() {
    editorRef.current.insertBox(WizEditor.BOX_TYPE.TAG, null, { text: `tag-${(tagCount += 1)}` });
  }

  function handleImage() {
    editorRef.current.insertEmbed(null, -2, WizEditor.EMBED_TYPE.IMAGE, {
      src: 'https://www.wiz.cn/static/images/docker.svg?v=1',
    });
  }

  function handleMermaid() {
    editorRef.current.insertMermaid(-2, MermaidText);
  }

  function handleLink() {
    editorRef.current.executeTextCommand('link', {
      link: 'https://www.wiz.cn',
    });
  }

  function handleRemoveLink() {
    editorRef.current.executeTextCommand('unlink');
  }

  function handleComment() {
    editorRef.current.executeTextCommand('comment', {
      commentId: '12345',
    });
  }


  return (
    <>
      <div className="App">
        <div id="header" className="tools">
          <div id="curUserNames" style={{
            display: 'inline-block',
          }}>{user.displayName}</div>
          <div id="otherUserNames" style={{
            display: 'inline-block',
          }}>{otherUserNames}</div>
          &nbsp;
        </div>
        <div id="toolbar" className="tools">
          <div id="addPage" className="toolbar-button icon-button" title="New Page" onClick={handleNewPage}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"/></svg>
          </div>

          <div className='split-line'></div>
          <div id="undo" className="toolbar-button icon-button" title="Undo" onClick={handleUndo}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>
          </div>
          <div id="redo" className="toolbar-button icon-button" title="Redo" onClick={handleRedo}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>
          </div>
          <div id="bold" className="toolbar-button icon-button" title="Bold" onClick={handleBold}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
          </div>
          <div id="italic" className="toolbar-button icon-button" title="Italic" onClick={handleItalic}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
          </div>
          <div id="table" className="toolbar-button icon-button" title="Insert Table" onClick={handleTable}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z"/></svg>
          </div>
          <div id="tag" className="toolbar-button icon-button" title="Insert Tag" onClick={handleTag}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM13 20.01L4 11V4h7v-.01l9 9-7 7.02z"/><circle cx="6.5" cy="6.5" r="1.5"/></svg>
          </div>
          <div id="image" className="toolbar-button icon-button" title="Insert Image" onClick={handleImage}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2V4zm6 9l-4 5h12l-3-4-2.03 2.71L10 13zm7-4.5c0-.83-.67-1.5-1.5-1.5S14 7.67 14 8.5s.67 1.5 1.5 1.5S17 9.33 17 8.5zM20 2h-7v2h7v7h2V4c0-1.1-.9-2-2-2zm0 18h-7v2h7c1.1 0 2-.9 2-2v-7h-2v7zM4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7z"/></svg>
          </div>
          <div id="mermaid" className="toolbar-button icon-button" title="Insert Mermaid Graph" onClick={handleMermaid}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M15 7v4h1v2h-3V5h2l-3-4-3 4h2v8H8v-2.07c.7-.37 1.2-1.08 1.2-1.93 0-1.21-.99-2.2-2.2-2.2-1.21 0-2.2.99-2.2 2.2 0 .85.5 1.56 1.2 1.93V13c0 1.11.89 2 2 2h3v3.05c-.71.37-1.2 1.1-1.2 1.95 0 1.22.99 2.2 2.2 2.2 1.21 0 2.2-.98 2.2-2.2 0-.85-.49-1.58-1.2-1.95V15h3c1.11 0 2-.89 2-2v-2h1V7h-4z"/></svg>
          </div>
          <div id="link" className="toolbar-button icon-button" title="Add Link" onClick={handleLink}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
          </div>
          <div id="unlink" className="toolbar-button icon-button" title="Remove Link" onClick={handleRemoveLink}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zm-1 4h-2.19l2 2H16zM2 4.27l3.11 3.11C3.29 8.12 2 9.91 2 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73L13 15.27V17h1.73l4.01 4L20 19.74 3.27 3 2 4.27z"/><path d="M0 24V0" fill="none"/></svg>
          </div>
          <div id="comment" className="toolbar-button icon-button" title="Insert Comments" onClick={handleComment}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17l-.59.59-.58.58V4h16v12zM6 12h2v2H6zm0-3h2v2H6zm0-3h2v2H6zm4 6h5v2h-5zm0-3h8v2h-8zm0-3h8v2h-8z"/></svg>
          </div>

          <div className='split-line'></div>

          <div id="docStatus" className="toolbar-button icon-button" title="Status" style={{
            color: isDirty ? 'rgb(237, 227, 79)' : 'green',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <circle cx="12" cy="12" r="12" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'initial',
      }}>
        <div id="editor" ref={editorContainerRef} style={{
            width: '100%',
            maxWidth: 800,
            border: 'solid 1px #ccc',
            margin: 8,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          Editor001
        </div>
      </div>
    </>
  );
}

export default App;
