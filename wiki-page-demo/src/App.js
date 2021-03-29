import React, { useEffect, useMemo, useCallback } from 'react'
import { WizEditor, genId } from 'wiz-editor-react';
import './App.css';

const AppId = '_LC1xOdRp';

function App() {
  const [docId, setDocId] = React.useState('');
  const [token, setToken] = React.useState('');
  const [remoteUsers, setRemoteUsers] = React.useState([]);

  const toolbars = [
    ['undo', 'redo'],
    ['heading'],
    ['fontFamily'],
    ['color', 'background'],
    ['bold', 'italic', 'underline', 'link'],
    ['list', 'list'],
    ['image', 'file', 'table', 'code'],
  ];

  const handleRemoteUserChanged = (editor, remoteUsers) => {
    setRemoteUsers(remoteUsers);
  }

  const userId = useMemo(() => getUserId(), []);

  const options = useMemo(() => ({
    local: false,
    lineNumber: false,
    titleInEditor: true,
    titlePlaceholder: '标题',
    serverUrl: 'ws://localhost:9000',
    user: {
      userId,
      displayName: userId,
    },
    callbacks: {
      onReauth: fakeGetAccessTokenFromServer,
      onRemoteUserChanged: handleRemoteUserChanged,
    },
  }), [userId]);

  function getUserId() {
    return new Date().getTime().toString(16).slice(5);
  }

  async function fakeGetAccessTokenFromServer(userId, docId) {
    const res = await fetch(`//${window.location.host}/token/${AppId}/${docId}/${userId}`);
    const ret = await res.json();
    return ret.token;
  }

  function handleCreateDoc() {
    const docId = genId();
    setToken('');
    setDocId(docId);
    localStorage.setItem('lastDocId', docId);
    window.location.replace(`/?id=${docId}`);
  }

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const localDocId = localStorage.getItem('lastDocId');
    if (query.has('id')) {
      setDocId(query.get('id'));
      localStorage.setItem('lastDocId', query.get('id'));
    } else if (localDocId) {
      setDocId(localDocId);
      window.location.replace(`/?id=${localDocId}`);
    } else {
      handleCreateDoc();
    }
  }, []);

  useEffect(() => {
    const getToken = async () => {
      if (docId) {
        const t = await fakeGetAccessTokenFromServer('test-user', docId);
        setToken(t);
      }
    }

    getToken();
  }, [docId]);

  const OnlineUser = (props) => {
    const src = props.user ? props.user.avatarUrl : '';
    const userName = props.user ? props.user.displayName : '';
    return (
      <span className="avatar">
        <img src={src} alt={userName}/>
      </span>
    );
  }

  const renderFeat = (feat) => {
    return <div>{feat}</div>;
  };

  return (
    <div>
      <header>
        <div className="logo">Wiki</div>
        <div className="btn-create-doc" onClick={handleCreateDoc}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.58959 12.9922C7.0974 12.9922 7.51928 12.5625 7.51928 12.0938V7.60156H11.9021C12.3943 7.60156 12.8162 7.17969 12.8162 6.67188C12.8162 6.17188 12.3943 5.75 11.9021 5.75H7.51928V1.25781C7.51928 0.765625 7.0974 0.351562 6.58959 0.351562C6.08959 0.351562 5.66772 0.765625 5.66772 1.25781V5.75H1.27709C0.800528 5.75 0.363028 6.17188 0.363028 6.67188C0.363028 7.17969 0.800528 7.60156 1.27709 7.60156H5.66772V12.0938C5.66772 12.5625 6.08959 12.9922 6.58959 12.9922Z" fill="white"/>
          </svg>
          <span>新建</span>
        </div>
        <div className="remote-user-container">
          {remoteUsers.map((user) => (<OnlineUser key={user.userId} user={user} />))}
        </div>
        <div className="btn-share-doc">
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 11.5781C7.41406 11.5781 7.74219 11.25 7.74219 10.8516V3.48438L7.67969 2.39062L8.11719 2.94531L9.10938 4C9.23438 4.14062 9.41406 4.21875 9.60156 4.21875C9.95312 4.21875 10.25 3.96094 10.25 3.58594C10.25 3.39844 10.1797 3.25781 10.0469 3.125L7.57031 0.742188C7.38281 0.554688 7.20312 0.492188 7 0.492188C6.80469 0.492188 6.625 0.554688 6.4375 0.742188L3.96094 3.125C3.82812 3.25781 3.75 3.39844 3.75 3.58594C3.75 3.96094 4.04688 4.21875 4.39844 4.21875C4.58594 4.21875 4.77344 4.14062 4.89844 4L5.89062 2.94531L6.32812 2.39062L6.26562 3.48438V10.8516C6.26562 11.25 6.59375 11.5781 7 11.5781ZM2.73438 17.5312H11.2578C12.8906 17.5312 13.7422 16.6797 13.7422 15.0703V7.85156C13.7422 6.24219 12.8906 5.39062 11.2578 5.39062H9.29688V6.99219H11.1328C11.7812 6.99219 12.1484 7.32812 12.1484 8.01562V14.9062C12.1484 15.5938 11.7812 15.9297 11.1328 15.9297H2.86719C2.21094 15.9297 1.85156 15.5938 1.85156 14.9062V8.01562C1.85156 7.32812 2.21094 6.99219 2.86719 6.99219H4.72656V5.39062H2.73438C1.11719 5.39062 0.25 6.24219 0.25 7.85156V15.0703C0.25 16.6797 1.11719 17.5312 2.73438 17.5312Z" fill="white"/>
          </svg>
          <span>分享</span>
        </div>
      </header>
      <nav className="tool-container">
        {toolbars.map((item) => (
          <React.Fragment>
            {item.map((feat) => renderFeat(feat))}
            <span className="split-line"></span>
          </React.Fragment>
        ))}
      </nav>
      {token && AppId && docId && (
        <WizEditor
          userId={userId}
          displayName={userId}
          avatarUrl={'https://www.live-editor.com/wp-content/new-uploads/a0919cb4-d3c2-4027-b64d-35a4c2dc8e23.png'}
          appId={AppId}
          docId={docId}
          options={options}
          permission={'w'}
          accessToken={token}
          containerStyle={{
            maxWidth: '100%',
            minHeight: 800,
            margin: '0px 50px'
          }}
        />
      )}
    </div>
  );
}

export default App;
