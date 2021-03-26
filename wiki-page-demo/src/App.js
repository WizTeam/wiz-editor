import React, { useEffect } from 'react'
import { WizEditor } from 'wiz-editor-react';
import './App.css';

const AppId = '_LC1xOdRp';

function App() {
  const [docId, setDocId] = React.useState('doc1');
  const [token, setToken] = React.useState('');
  //
  const options = {
    local: false,
    titleInEditor: true,
    serverUrl: 'ws://localhost:9000',
    user: {
      userId: 'test-user',
      displayName: 'Test User',
    },
    callbacks: {
      onError: (editor, err) => {
        console.log(err);
      },
    },
  };

  async function fakeGetAccessTokenFromServer(userId, docId) {
    const res = await fetch(`//${window.location.host}/token/${AppId}/${docId}/${userId}`);
    const ret = await res.json();
    return ret.token;
  }

  useEffect(() => {
    const getToken = async () => {
      const t = await fakeGetAccessTokenFromServer('test-user', docId);
      setToken(t);
    }

    getToken();
  }, [docId]);

  return (
    <div>
      <header>
        <div className="logo">Wiki</div>
        <div className="btn-create-doc">
          <span>新建</span>
        </div>
      </header>
      <div className="tool-container"></div>
      <WizEditor
        userId={'test-suer'}
        displayName={'Test User'}
        avatarUrl={'https://www.live-editor.com/wp-content/new-uploads/a0919cb4-d3c2-4027-b64d-35a4c2dc8e23.png'}
        appId={AppId}
        docId={docId}
        options={options}
        permission={'w'}
        accessToken={token}
        containerStyle={{
          border: '1px solid #f0f0f0',
          maxWidth: 800,
          minHeight: 800,
          margin: '40px auto 40px auto'
        }}
      />
    </div>
  );
}

export default App;
