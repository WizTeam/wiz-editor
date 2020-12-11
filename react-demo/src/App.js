import React, { useEffect, useRef } from 'react';
import './App.css';
import * as WizEditor from 'wiz-editor/client';

//
function App() {

  const editorRef = useRef();

  useEffect(() => {
    if (!editorRef.current || editorRef.current.editor) {
      return;
    }

    const WsServerUrl = `ws://${window.location.host}`;
    const docId = '_e9kD3NTs';
    const user = {
      userId: `${new Date().valueOf()}`,
      displayName: 'Hunter',
    };
    const options = {
      // lang: LANGS.ZH_CN,
      serverUrl: WsServerUrl,
      user,
    };
    editorRef.current.editor = WizEditor.createEditor(editorRef.current, options, docId);
  }, []);
  
  return (
    <div className="App">
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'initial',
      }}>
        <div id="editor" ref={editorRef} style={{
            width: '100%',
            maxWidth: 800,
            border: 'solid 1px #ccc',
            margin: 8,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}>
          Editor001
        </div>
      </div>
    </div>
  );
}

export default App;
