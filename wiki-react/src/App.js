import React, { useEffect, useMemo, useCallback } from 'react'
import { WizEditor, genId, EMBED_TYPE } from 'wiz-editor-react';
import { makeStyles } from '@material-ui/core/styles';
import isEqual from 'lodash.isequal';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import './App.css';

const AppId = '_LC1xOdRp';

const useStyles = makeStyles((theme) => ({
  headingSelect: {
    '&:before': {
      display: 'none',
    },
    '&:after': {
      display: 'none',
    },
    '&:hover': {
      backgroundColor: '#ECEFF4',
    },
    borderRadius: 4,
    padding: '0 5px',
  },
  selectContainer: {
    borderRadius: 4,
    '&:hover': {
      backgroundColor: '#ECEFF4',
    }
  },
  selectButton: {
    padding: '5px 0',
    borderRadius: 0,
  },
  colorBlock: {
    width: 15,
    height: 15,
    margin: 5,
    cursor: 'pointer',
    border: 0,
  },
  colorContainer: {
    display: 'flex',
    flexFlow: 'wrap',
    width: 100,
    padding: 5,
  },
}));

function App() {
  const classes = useStyles();
  const [docId, setDocId] = React.useState('');
  const [token, setToken] = React.useState('');
  const [remoteUsers, setRemoteUsers] = React.useState([]);
  const [toolStatus, setToolStatus] = React.useState({});
  const [activeStatus, setActiveStatus] = React.useState({});
  const [fontColorPosition, setFontColorPosition] = React.useState(null);
  const [fontBackgroundPosition, setFontBackgroundPosition] = React.useState(null);
  const wizEditorRef = React.useRef(null);
  const lastStatus = React.useRef(null);
  const focusedBlock = React.useRef(null);
  const fontColorBlock = React.useRef(null);
  const currentFontColor = React.useRef('style-color-0');
  const currentFontBackground = React.useRef('style-bg-color-0');

  const AVATAR_URLS = [
    'https://live-editor.com/wp-content/new-uploads/2f4c76a6-db63-4de1-a5c0-28cf36384b7e.png',
    'https://live-editor.com/wp-content/new-uploads/fc728217-55e3-4d09-b034-07a9960a6b39.png',
    'https://live-editor.com/wp-content/new-uploads/a0919cb4-d3c2-4027-b64d-35a4c2dc8e23.png',
    'https://live-editor.com/wp-content/new-uploads/edd02e17-0311-42f2-b6e4-f2182c9af669.png',
    'https://live-editor.com/wp-content/new-uploads/466fd22b-efa2-4aa9-afa2-2e7fd7e877c4.png',
    'https://live-editor.com/wp-content/new-uploads/ba347c05-ec29-4ebf-bca0-d95670c93df0.png',
    'https://live-editor.com/wp-content/new-uploads/200598ee-a746-403f-9908-a91949bc41c2.png',
  ];

  const toolbars = [
    ['undo', 'redo'],
    ['heading'],
    // ['fontFamily'],
    ['color', 'background'],
    ['style-bold', 'style-italic', 'style-underline', 'style-strikethrough', 'quote', 'link'],
    ['toOrderedList', 'toUnorderedList'],
    ['image', 'file', 'table', 'code'],
  ];

  const Icons = {
    undo: (props) => (
      <button {...props}>
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.65625 9.07031C16.0453 10.0055 19.2937 13.7602 20.2031 18.4453C17.925 15.1664 14.2125 12.5859 9.65625 12.5859V16.1016L3.79688 10.9453L9.65625 5.55469C9.65625 5.55469 9.65625 8.98359 9.65625 9.07031Z"/>
        </svg>
      </button>
    ),
    redo: (props) => (
      <button {...props}>
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.3438 5.55469L20.2031 10.9477L14.3438 16.1016V12.5859C9.7875 12.5859 6.075 15.1664 3.79688 18.4453C4.70625 13.7602 7.95469 10.0055 14.3438 9.07031C14.3438 8.98359 14.3438 5.55469 14.3438 5.55469Z"/>
        </svg>
      </button>
    ),
    'style-bold': (props) => (
      <button {...props}>
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5789 11.5102C15.8836 11.1305 16.6875 9.91641 16.6875 8.48438C16.6875 5.89453 14.5898 3.79688 12 3.79688C9.41015 3.79688 6.14062 3.79688 6.14062 3.79688V20.2031C6.14062 20.2031 10.582 20.2031 13.1695 20.2031C15.757 20.2031 17.8617 18.1055 17.857 15.5156C17.8547 12.9375 16.2703 11.8242 15.5789 11.5102ZM8.48437 6.14062C8.48437 6.14062 10.7062 6.14062 12 6.14062C13.2937 6.14062 14.3437 7.19062 14.3437 8.48438C14.3437 9.77812 13.2937 10.8281 12 10.8281C10.7062 10.8281 8.47499 10.8328 8.47499 10.8328L8.48437 6.14062ZM13.1719 17.8594C11.8781 17.8594 8.47499 17.8641 8.47499 17.8641L8.48437 13.1719C8.48437 13.1719 11.8781 13.1719 13.1719 13.1719C14.4656 13.1719 15.5156 14.2219 15.5156 15.5156C15.5156 16.8094 14.4656 17.8594 13.1719 17.8594Z" />
        </svg>
      </button>
    ),
    'style-italic': (props) => (
      <button {...props}>
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5156 3.79688H10.8281C10.1813 3.79688 9.65625 4.32187 9.65625 4.96875C9.65625 5.61563 10.1813 6.14062 10.8281 6.14062H11.7867L9.65625 17.8594H8.48438C7.8375 17.8594 7.3125 18.3844 7.3125 19.0312C7.3125 19.6781 7.8375 20.2031 8.48438 20.2031H13.1719C13.8187 20.2031 14.3438 19.6781 14.3438 19.0312C14.3438 18.3844 13.8187 17.8594 13.1719 17.8594H12L14.1305 6.14062H15.5156C16.1625 6.14062 16.6875 5.61563 16.6875 4.96875C16.6875 4.32187 16.1625 3.79688 15.5156 3.79688Z"/>
        </svg>
      </button>
    ),
    'style-underline': (props) => (
      <button {...props}>
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.6172 20.2031H4.38281C4.05937 20.2031 3.79688 20.4656 3.79688 20.7891C3.79688 21.1125 4.05937 21.375 4.38281 21.375H19.6172C19.9406 21.375 20.2031 21.1125 20.2031 20.7891C20.2031 20.4656 19.9406 20.2031 19.6172 20.2031ZM12 17.8594C15.2367 17.8594 17.8594 15.2367 17.8594 12V10.8281C17.8594 7.59141 17.8594 4.96875 17.8594 4.96875C17.8594 4.32187 17.3344 3.79688 16.6875 3.79688C16.0406 3.79688 15.5156 4.32187 15.5156 4.96875C15.5156 4.96875 15.5156 5.37187 15.5156 7.3125V12C15.5156 13.9406 13.9406 15.5156 12 15.5156C10.0594 15.5156 8.48438 13.9406 8.48438 12V7.3125C8.48438 5.37187 8.48438 4.96875 8.48438 4.96875C8.48438 4.32187 7.95937 3.79688 7.3125 3.79688C6.66563 3.79688 6.14062 4.32187 6.14062 4.96875C6.14062 4.96875 6.14062 7.59141 6.14062 10.8281V12C6.14062 15.2367 8.76328 17.8594 12 17.8594Z"/>
        </svg>
      </button>
    ),
    'style-strikethrough': (props) => (
      <button {...props}>
        <svg width="24" height="24" viewBox="0 0 20 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.3242 12H13.2293C12.3777 11.2786 11.2621 10.838 10.0395 10.8286C10.0264 10.8284 10.0133 10.8281 10.0002 10.8281C8.38223 10.8281 7.07051 9.77883 7.07051 8.48438C7.07051 7.18992 8.38223 6.14062 10.0002 6.14062C11.6182 6.14062 12.9299 7.18992 12.9299 8.48438C12.9299 9.1575 13.3885 9.65625 13.9064 9.65625C14.4443 9.65625 14.883 9.21516 14.883 8.48438C14.883 5.89547 12.6969 3.79688 10.0002 3.79688C7.30352 3.79688 5.11738 5.89547 5.11738 8.48438C5.11738 9.88453 5.75703 11.141 6.7709 12H2.67578C2.40625 12 2.1875 12.2625 2.1875 12.5859C2.1875 12.9094 2.40625 13.1719 2.67578 13.1719H10C11.618 13.1719 12.9297 14.2212 12.9297 15.5156C12.9297 16.8101 11.618 17.8594 10 17.8594C8.38203 17.8594 7.07031 16.8101 7.07031 15.5156C7.07031 14.865 6.63652 14.3646 6.08633 14.3646C5.59824 14.3646 5.11719 14.7619 5.11719 15.5156C5.11719 18.1045 7.30332 20.2031 10 20.2031C12.6967 20.2031 14.8828 18.1045 14.8828 15.5156C14.8828 14.6618 14.6449 13.8614 14.2295 13.1719H17.3242C17.5938 13.1719 17.8125 12.9094 17.8125 12.5859C17.8125 12.2625 17.5938 12 17.3242 12Z"/>
        </svg>
      </button>
    ),
    link: (props) => (
      <button {...props}>
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.832 8.15391C15.3328 7.65469 14.782 7.74375 14.332 8.19141C13.8117 8.70937 13.2914 9.225 12.7734 9.74062C12.0492 10.4601 13.3898 11.9672 14.0859 11.2664C14.6601 10.6875 15.2343 10.1062 15.8086 9.52499C16.1672 9.16875 16.2867 8.60859 15.832 8.15391Z"/>
          <path d="M16.8281 2.625C18.5672 2.72578 20.1352 3.58359 20.9414 5.49375C21.7641 7.43203 21.4008 9.23437 19.9758 10.7766C18.968 11.8641 17.8828 12.8859 16.8258 13.9289C16.3688 14.3836 15.6399 14.3953 15.2391 13.9781C14.8406 13.5563 14.8875 12.9773 15.368 12.4875C16.4039 11.4492 17.4586 10.4203 18.4828 9.37031C20.0344 7.78828 19.3453 5.27109 17.2078 4.70391C16.3196 4.46953 15.4664 4.63125 14.7891 5.26172C13.6969 6.27187 12.6727 7.35234 11.5899 8.3625C11.3602 8.57812 10.9805 8.76328 10.6828 8.74688C9.88362 8.69531 9.48284 7.73203 10.036 7.15781C11.2125 5.91562 12.4336 4.71797 13.7016 3.56953C14.4774 2.87109 15.4899 2.63203 16.8281 2.625ZM2.62504 16.5492C2.61098 15.2648 3.11723 14.0273 4.02895 13.1203C5.06019 12.0727 6.1055 11.0391 7.15082 10.0078C7.64535 9.51562 8.25706 9.47812 8.67659 9.9C9.11253 10.3383 9.068 10.8938 8.55238 11.4141C7.55863 12.4102 6.54847 13.3969 5.5641 14.4C4.34769 15.6469 4.29613 17.3227 5.41879 18.4523C6.49222 19.5305 8.26878 19.5375 9.39144 18.443C10.4086 17.4492 11.4024 16.425 12.4196 15.4313C13.0313 14.8359 13.9594 15.0492 14.1211 15.8531C14.168 16.1883 14.0742 16.5281 13.861 16.7906C12.7524 17.9578 11.6532 19.1273 10.4461 20.1914C8.97191 21.4828 7.24457 21.7031 5.44457 20.9203C3.71723 20.1539 2.61098 18.4383 2.62504 16.5492ZM15.8086 9.51562C15.8086 9.51562 12.9938 12.3609 11.5805 13.7789C10.9524 14.407 10.3266 15.0352 9.69612 15.6609C9.31644 16.0617 8.68363 16.0805 8.28285 15.7031C8.26644 15.6867 8.25003 15.6703 8.23363 15.6539C7.81878 15.2367 7.8305 14.6648 8.29222 14.2055C10.3008 12.1898 14.3344 8.18203 14.3344 8.18203L15.8086 9.51562Z"/>
        </svg>
      </button>
    ),
    toOrderedList: (props) => (
      <button {...props}>
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.65625 7.3125H19.0312C19.6781 7.3125 20.2031 6.7875 20.2031 6.14062C20.2031 5.49375 19.6781 4.96875 19.0312 4.96875H9.65625C9.00938 4.96875 8.48438 5.49375 8.48438 6.14062C8.48438 6.7875 9.00938 7.3125 9.65625 7.3125ZM19.0312 10.8281H9.65625C9.00938 10.8281 8.48438 11.3531 8.48438 12C8.48438 12.6469 9.00938 13.1719 9.65625 13.1719H19.0312C19.6781 13.1719 20.2031 12.6469 20.2031 12C20.2031 11.3531 19.6781 10.8281 19.0312 10.8281ZM19.0312 16.6875H9.65625C9.00938 16.6875 8.48438 17.2125 8.48438 17.8594C8.48438 18.5063 9.00938 19.0312 9.65625 19.0312H19.0312C19.6781 19.0312 20.2031 18.5063 20.2031 17.8594C20.2031 17.2125 19.6781 16.6875 19.0312 16.6875ZM6.14062 15.525H3.79688V16.6969H4.96875V19.0312H3.79688V20.2031H6.14062V19.0312V15.525ZM6.14062 13.1789H4.96875V12.007H3.79688V14.3508H6.14062V13.1789ZM6.14062 9.66328H3.79688V10.8352H4.96875V12.007H6.14062V9.66328ZM3.79688 4.96875H4.96875V8.48906H6.14062V3.79688H3.79688V4.96875Z"/>
        </svg>
      </button>
    ),
    toUnorderedList: (props) => (
      <button {...props}>
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.65625 7.3125H19.0312C19.6781 7.3125 20.2031 6.7875 20.2031 6.14062C20.2031 5.49375 19.6781 4.96875 19.0312 4.96875H9.65625C9.00938 4.96875 8.48438 5.49375 8.48438 6.14062C8.48438 6.7875 9.00938 7.3125 9.65625 7.3125ZM19.0312 10.8281H9.65625C9.00938 10.8281 8.48438 11.3531 8.48438 12C8.48438 12.6469 9.00938 13.1719 9.65625 13.1719H19.0312C19.6781 13.1719 20.2031 12.6469 20.2031 12C20.2031 11.3531 19.6781 10.8281 19.0312 10.8281ZM19.0312 16.6875H9.65625C9.00938 16.6875 8.48438 17.2125 8.48438 17.8594C8.48438 18.5063 9.00938 19.0312 9.65625 19.0312H19.0312C19.6781 19.0312 20.2031 18.5063 20.2031 17.8594C20.2031 17.2125 19.6781 16.6875 19.0312 16.6875ZM4.96875 4.96875C4.32187 4.96875 3.79688 5.49375 3.79688 6.14062C3.79688 6.7875 4.32187 7.3125 4.96875 7.3125C5.61563 7.3125 6.14062 6.7875 6.14062 6.14062C6.14062 5.49375 5.61563 4.96875 4.96875 4.96875ZM4.96875 10.8281C4.32187 10.8281 3.79688 11.3531 3.79688 12C3.79688 12.6469 4.32187 13.1719 4.96875 13.1719C5.61563 13.1719 6.14062 12.6469 6.14062 12C6.14062 11.3531 5.61563 10.8281 4.96875 10.8281ZM4.96875 16.6875C4.32187 16.6875 3.79688 17.2125 3.79688 17.8594C3.79688 18.5063 4.32187 19.0312 4.96875 19.0312C5.61563 19.0312 6.14062 18.5063 6.14062 17.8594C6.14062 17.2125 5.61563 16.6875 4.96875 16.6875Z"/>
        </svg>
      </button>
    ),
    image: (props) => (
      <span {...props}>
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.0312 3.79688H4.96875C4.32187 3.79688 3.79688 4.32187 3.79688 4.96875V19.0312C3.79688 19.6781 4.32187 20.2031 4.96875 20.2031H19.0312C19.6781 20.2031 20.2031 19.6781 20.2031 19.0312V4.96875C20.2031 4.32187 19.6781 3.79688 19.0312 3.79688ZM7.89844 6.14062C8.86875 6.14062 9.65625 6.92812 9.65625 7.89844C9.65625 8.86875 8.86875 9.65625 7.89844 9.65625C6.92812 9.65625 6.14062 8.86875 6.14062 7.89844C6.14062 6.92812 6.92812 6.14062 7.89844 6.14062ZM17.8594 17.8594H6.14062L8.48438 14.3438L10.8281 16.6875L14.3438 10.8281L17.8594 16.6875V17.8594Z"/>
        </svg>
      </span>
    ),
    file: (props) => (
      <span {...props}>
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.7575 11.2969C12.2803 10.7664 12.278 9.92296 11.7575 9.40246C11.238 8.88299 10.3959 8.88011 9.86308 9.40246L5.59979 13.6639C4.29322 14.9819 4.2966 17.0965 5.59979 18.3998C6.90362 19.7036 9.01822 19.7069 10.3358 18.3998L18.3869 10.3487C19.6939 9.04154 19.6939 6.91996 18.3869 5.61278C17.0802 4.30622 14.9581 4.3057 13.6509 5.61278L13.4151 5.85056C13.023 6.24267 12.3864 6.24267 11.9942 5.85056C11.6027 5.45882 11.6021 4.8228 11.9942 4.42971L12.2302 4.19205C14.3311 2.10152 17.7195 2.10389 19.8077 4.19205C21.8958 6.2801 21.899 9.6677 19.8077 11.7695L11.7561 19.8201C9.66238 21.8977 6.27899 21.893 4.19282 19.8068C2.10714 17.7212 2.10191 14.3373 4.18009 12.244L8.44236 7.98166C9.75704 6.6746 11.874 6.67745 13.1783 7.98166C14.4825 9.28597 14.4854 11.4029 13.1783 12.7176L9.15273 16.7432C8.76062 17.1353 8.12413 17.1353 7.732 16.7432C7.33989 16.351 7.33989 15.7145 7.732 15.3224L11.7575 11.2969Z"/>
        </svg>
      </span>
    ),
    code: (props) => (
      <span {...props}>
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.1953 11.1492L17.5383 6.49688C17.0672 6.02578 16.3031 6.02578 15.8344 6.49688C15.3656 6.96797 15.3656 7.72735 15.8344 8.19844L19.6383 12L15.832 15.8016C15.3633 16.2727 15.3633 17.0344 15.8344 17.5055C16.3031 17.9766 17.0672 17.9766 17.5359 17.5055L22.1953 12.8508C22.4156 12.6281 22.5469 12.3188 22.5469 12C22.5469 11.6813 22.418 11.3742 22.1953 11.1492ZM8.13281 6.49688C7.66406 6.02578 6.90469 6.02578 6.43828 6.49688L1.80234 11.1492C1.58203 11.3742 1.45312 11.6813 1.45312 12C1.45312 12.3164 1.58203 12.6258 1.80234 12.8508L6.43594 17.5032C6.90469 17.9742 7.66406 17.9742 8.13047 17.5032C8.59922 17.0321 8.59922 16.2727 8.13281 15.7992L4.34766 12L8.13281 8.19844C8.59922 7.72735 8.59922 6.96797 8.13281 6.49688ZM13.5516 6.22969C12.9281 6.06328 12.2812 6.44531 12.1102 7.08516L9.62812 16.3477C9.45703 16.9875 9.825 17.6414 10.4484 17.8078C11.0719 17.9742 11.7188 17.5922 11.8898 16.9524L14.3719 7.68985C14.543 7.05235 14.1773 6.39609 13.5516 6.22969Z"/>
        </svg>
      </span>
    ),
    table: (props) => (
      <span {...props}>
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.8594 3.79688H6.14062C4.84687 3.79688 3.79688 4.84687 3.79688 6.14062V17.8594C3.79688 19.1531 4.84687 20.2031 6.14062 20.2031H17.8594C19.1531 20.2031 20.2031 19.1531 20.2031 17.8594V6.14062C20.2031 4.84687 19.1531 3.79688 17.8594 3.79688ZM17.8594 6.14062V10.8281H13.1719V6.14062H17.8594ZM10.8281 6.14062V10.8281H6.14062V6.14062H10.8281ZM6.14062 17.8594V13.1719H10.8281V17.8594H6.14062ZM13.1719 17.8594V13.1719H17.8594V17.8594H13.1719Z"/>
        </svg>
      </span>
    ),
    quote: (props) => (
      <span  {...props}>
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.31719 4.96875C5.37188 4.96875 3.79688 6.54375 3.79688 8.48438C3.79688 10.425 5.37188 12 7.31719 12C7.75547 12 8.58516 11.9648 8.56406 11.7703C8.62266 12.3211 8.63437 13.6617 7.72969 15.375C6.9 16.943 4.89141 17.2734 4.67813 17.2734C4.19297 17.2734 3.79922 17.6672 3.79922 18.1523C3.79922 18.6375 4.21641 19.0312 4.67813 19.0312C9.19922 19.0312 10.8375 14.7047 10.8375 8.48438C10.8352 6.54375 9.26016 4.96875 7.31719 4.96875ZM16.6828 4.96875C14.7398 4.96875 13.1625 6.54375 13.1625 8.48438C13.1625 10.425 14.7375 12 16.6828 12C17.1234 12 17.9508 11.9648 17.9297 11.7703C17.9883 12.3211 18 13.6617 17.0953 15.375C16.2656 16.943 14.257 17.2734 14.0438 17.2734C13.5586 17.2734 13.1648 17.6672 13.1648 18.1523C13.1648 18.6375 13.582 19.0312 14.0438 19.0312C18.5648 19.0312 20.2031 14.7047 20.2031 8.48438C20.2031 6.54375 18.6281 4.96875 16.6828 4.96875Z"/>
        </svg>
      </span>
    ),
  };

  const handleBlockFocusChanged = (editor, block, focused) => {
    if (wizEditorRef.current) {
      const quote = wizEditorRef.current.isBlockQuoted(block);
      setActiveStatus({ ...activeStatus, quote });
    }
    
    if (focused) {
      focusedBlock.current = block;
    }
  }

  const handleCommandStatusChanged = (editor, status) => {
    if (!isEqual(lastStatus.current, status)) {
      lastStatus.current = status;
      setToolStatus({ ...status });
    }
  }

  const handleRemoteUserChanged = (editor, remoteUsers) => {
    setTimeout(() => {
      setRemoteUsers(remoteUsers);
    }, 0);
  }

  const getUserId = () => {
    return new Date().getTime().toString(16).slice(5);
  }

  // const userId = useMemo(() => getUserId(), []);

  const user = useMemo(() => {
    const userId = getUserId();
    const avaIndex = (new Date().getTime()) % AVATAR_URLS.length;
    const avatarUrl = AVATAR_URLS[avaIndex];
    return {
      userId,
      displayName: userId,
      avatarUrl
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(() => ({
    local: false,
    lineNumber: false,
    titleInEditor: true,
    titlePlaceholder: '标题',
    serverUrl: 'ws://localhost:9000',
    user: {
      userId: user.userId,
      displayName: user.displayName,
    },
    callbacks: {
      onReauth: fakeGetAccessTokenFromServer,
      onRemoteUserChanged: handleRemoteUserChanged,
      onCommandStatusChanged: handleCommandStatusChanged,
      onBlockFocusChanged: handleBlockFocusChanged,
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [user]);

  async function fakeGetAccessTokenFromServer(userId, docId) {
    const res = await fetch(`//${window.location.host}/token/${AppId}/${docId}/${userId}`);
    const ret = await res.json();
    return ret.token;
  }

  const handleCreateDoc = () => {
    const docId = genId();
    setToken('');
    setDocId(docId);
    localStorage.setItem('lastDocId', docId);
    window.location.replace(`/?id=${docId}`);
  }

  const handleInsertFIle = () => {
    const input = document.createElement('input');
    input.type = 'file';

    input.addEventListener('change', (event) => {
      if (input.files) {
        Array.from(input.files).forEach((file) => {
          let embedType = EMBED_TYPE.OFFICE;
          //
          if (/image/.test(file.type)) {
            embedType = EMBED_TYPE.IMAGE;
          } else if (/audio/.test(file.type)) {
            embedType = EMBED_TYPE.AUDIO;
          } else if (/video/.test(file.type)) {
            embedType = EMBED_TYPE.VIDEO;
          }
          //
          wizEditorRef.current.insertMediaFile(null, file, -2, embedType, {
            breakText: true,
          });
        });
        input.files = null;
        input.value = '';
      }
      //
      input.remove();
    });

    input.click();
  }

  const handleInsertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept='image/*';

    input.addEventListener('change', (event) => {
      if (input.files) {
        Array.from(input.files).forEach((file) => {
          wizEditorRef.current.insertImage(null, file, -2, {
            breakText: true,
          });
        });
        input.files = null;
        input.value = '';
      }
      //
      input.remove();
    });

    input.click();
  }

  const handleFeatureClick = (event, feature) => {
    if (wizEditorRef.current === null) return;

    if (feature === 'undo') {
      wizEditorRef.current.undo();
    } else if (feature === 'redo') {
      wizEditorRef.current.redo();
    } else if (feature.startsWith('style-')) {
      wizEditorRef.current.executeTextCommand(feature);
    } else if (feature === 'link') {
      wizEditorRef.current.executeTextCommand('link', {});
    } else if (feature === 'toOrderedList') {
      wizEditorRef.current.executeBlockCommand('toOrderedList');
    } else if (feature === 'toUnorderedList') {
      wizEditorRef.current.executeBlockCommand('toUnorderedList');
    } else if (feature === 'image') {
      handleInsertImage();
    } else if (feature === 'file') {
      handleInsertFIle();
    } else if (feature === 'code') {
      wizEditorRef.current.insertCode(-2, '');
    } else if (feature === 'table') {
      wizEditorRef.current.insertTable(-2, 3, 3);
    } else if (feature === 'quote') {
      if (focusedBlock.current) {
        const quoted = !wizEditorRef.current.isBlockQuoted(focusedBlock.current);
        wizEditorRef.current.setBlockQuoted(focusedBlock.current, quoted);
        setActiveStatus({ ...activeStatus, quote: quoted });
      }
    }
  }

  const handleShareWiki = () => {
    const copyText = window.location.href;
    const el = document.createElement('textarea');
    el.value = copyText;
    el.setAttribute('readonly', '');
    el.style = `
      position: absolute;
      top: -9999px;
      left: -9999px;
    `;
    //
    el.addEventListener('copy', () => {
      alert('copy success');
    });
    //
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  const handleHeadingChange = (event, child) => {
    if (wizEditorRef.current) {
      wizEditorRef.current.executeBlockCommand(child.props.value);
    }
  }

  const handleCurrentFontColorChange = (color) => {
    currentFontColor.current = color;
    handleChangeFontColor();
    handlePopoverClose();
  }

  const handleCurrentFontBackgroundChange = (color) => {
    currentFontBackground.current = color;
    handleChangeFontBackground();
    handlePopoverClose();
  }

  const handleChangeFontColor = () => {
    if (wizEditorRef.current) {
      wizEditorRef.current.executeTextCommand(currentFontColor.current);
    }
  }

  const handleChangeFontBackground = () => {
    if (wizEditorRef.current) {
      wizEditorRef.current.executeTextCommand(currentFontBackground.current);
    }
  }

  const handleOpenBackgroundPopover = (event) => {
    const rect = event.target.getBoundingClientRect();
    setFontBackgroundPosition({
      left: rect.left,
      top: rect.top + 24,
    });
  }

  const handleOpenFontColorPopover = (event) => {
    const rect = event.target.getBoundingClientRect();
    setFontColorPosition({
      left: rect.left,
      top: rect.top + 24,
    });
  }

  const handlePopoverClose = () => {
    setFontColorPosition(null);
    setFontBackgroundPosition(null);
  }

  const handleCreate = useCallback((editor) => {
    wizEditorRef.current = editor;
    window.wizE = editor;
  }, []);

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
      if (docId && user.userId) {
        const t = await fakeGetAccessTokenFromServer(user.userId, docId);
        setToken(t);
      }
    }
    getToken();
  }, [docId, user]);

  const OnlineUser = (props) => {
    const src = props.user ? props.user.avatarUrl : '';
    const userName = props.user ? props.user.displayName : '';
    return (
      <span className="avatar">
        <img src={src} alt={userName}/>
      </span>
    );
  }

  const DownIcon = () => (
    <svg width="20" height="12" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.14922 5.59687L0.664051 2.10938C0.192956 1.63828 0.192956 0.874219 0.664051 0.405469C1.13515 -0.0656248 1.89452 -0.0656242 2.36796 0.403126L5 3.0375L7.63439 0.403126C8.10548 -0.0656242 8.86486 -0.0656242 9.33595 0.403126C9.80705 0.874219 9.80705 1.63828 9.33595 2.10703L5.85079 5.59687C5.62579 5.81719 5.31641 5.94844 4.99766 5.94844C4.68125 5.94844 4.37188 5.81953 4.14922 5.59687Z" fill="#505F79"/>
    </svg>
  );

  const ColorSelectIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.6875 17.8594H19.0313L13.4063 3.79688C13.0472 3.15797 12.7767 2.625 12 2.625C11.2233 2.625 10.8853 3.14531 10.5938 3.79688L4.95822 17.8641L7.31252 17.8594L8.65619 14.3438H15.3438L16.6875 17.8594ZM9.55197 12L12 5.59453L14.4481 12H9.55197Z" fill="#505F79"/>
      <path d="M19.0312 20.2031H4.96875C4.32164 20.2031 3.79688 20.7279 3.79688 21.375V22.5469C3.79688 23.194 4.32164 23.7188 4.96875 23.7188H19.0312C19.6784 23.7188 20.2031 23.194 20.2031 22.5469V21.375C20.2031 20.7279 19.6784 20.2031 19.0312 20.2031Z" fill="#505F79"/>
    </svg>
  );

  const BackgroundSelectIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.1963 7.2804C17.1138 5.69555 13.9856 4.08703 12.3436 3.24258C11.4169 2.79445 10.9214 3.16805 10.5359 3.88617C9.45821 6.00867 7.38329 10.095 7.38329 10.095L9.42259 11.1434L8.37704 13.1883L9.39681 13.7124L7.30548 17.8024L12.4299 17.8545L13.4754 15.8095L14.4952 16.3338L15.5407 14.2889L17.5798 15.3375C17.5798 15.3375 19.695 11.1722 20.7633 9.06821C21.127 8.30227 20.978 7.79016 20.1963 7.2804ZM11.7363 16.6913L9.15798 16.6971L10.4159 14.2369L12.4552 15.2852L11.7363 16.6913Z" fill="#505F79"/>
      <path d="M19.0312 20.2031H4.96875C4.32164 20.2031 3.79688 20.7279 3.79688 21.375V22.5469C3.79688 23.194 4.32164 23.7188 4.96875 23.7188H19.0312C19.6784 23.7188 20.2031 23.194 20.2031 22.5469V21.375C20.2031 20.7279 19.6784 20.2031 19.0312 20.2031Z" fill="#505F79"/>
    </svg>
  );

  const SubMenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.1492 14.5969L7.66405 11.1094C7.19296 10.6383 7.19296 9.87422 7.66405 9.40547C8.13515 8.93438 8.89452 8.93438 9.36796 9.40313L12 12.0375L14.6344 9.40313C15.1055 8.93438 15.8649 8.93438 16.336 9.40313C16.8071 9.87422 16.8071 10.6383 16.336 11.107L12.8508 14.5969C12.6258 14.8172 12.3164 14.9484 11.9977 14.9484C11.6813 14.9484 11.3719 14.8195 11.1492 14.5969Z" fill="#505F79"/>
    </svg>
  );

  const FontColor = () => {
    return (
      <div ref={fontColorBlock} className={classes.selectContainer}>
        <IconButton
          onClick={handleChangeFontColor}
          className={classes.selectButton}
          disableRipple
          style={{
            paddingLeft: 3,
            paddingRight: 3,
          }}
        >
          <ColorSelectIcon />
        </IconButton>
        <IconButton
          onClick={handleOpenFontColorPopover}
          className={classes.selectButton}
          disableRipple
        >
          <SubMenuIcon />
        </IconButton>
      </div>
    );
  }

  const FontBackground = () => {
    return (
      <div className={classes.selectContainer}>
        <IconButton
          onClick={handleChangeFontBackground}
          className={classes.selectButton}
          disableRipple
          style={{
            paddingLeft: 3,
            paddingRight: 3,
          }}
        >
          <BackgroundSelectIcon />
        </IconButton>
        <IconButton
          onClick={handleOpenBackgroundPopover}
          className={classes.selectButton}
          disableRipple
        >
          <SubMenuIcon />
        </IconButton>
      </div>
    );
  }

  const HeadingSelect = () => {
    return (
      <Select
        className={classes.headingSelect}
        disabled={toolStatus.textStyle === 'disabled'}
        onChange={handleHeadingChange}
        IconComponent={DownIcon}
        displayEmpty
        renderValue={() => '正文'}
        value="">
        <MenuItem value="toBodyText">正文</MenuItem>
        <MenuItem value="toHeading1">h1</MenuItem>
        <MenuItem value="toHeading2">h2</MenuItem>
        <MenuItem value="toHeading3">h3</MenuItem>
        <MenuItem value="toHeading4">h4</MenuItem>
        <MenuItem value="toHeading5">h5</MenuItem>
      </Select>
    );
  }

  const renderFeature = (feature) => {
    let className = 'toolbar-icon';
    //
    if (feature === 'heading') {
      return <HeadingSelect key={feature} />
    }
    if (feature === 'color') {
      return <FontColor key={feature} />
    }
    if (feature === 'background') {
      return <FontBackground key={feature} />
    }
    if (Icons[feature]) {
      const Temp = Icons[feature];
      const isBlockFeature = feature === 'image' || feature === 'file';
      //
      if (toolStatus[feature] === 'disabled' || (toolStatus.insertBlock === 'disabled' && isBlockFeature)) {
        className += ' disabled';
      }
      //
      if (activeStatus[feature] || toolStatus[feature] === true) {
        className += ' active';
      }
      //
      return <Temp
        // 防止焦点转移
        onMouseDown={(event) => event.preventDefault()}
        onClick={(event) => handleFeatureClick(event, feature)}
        key={feature}
        className={className}
      />
    }
    //
    return <div key={feature}>{feature}</div>;
  };

  return (
    <div className="scroll-container">
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
        <div className="btn-share-doc" onClick={handleShareWiki}>
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 11.5781C7.41406 11.5781 7.74219 11.25 7.74219 10.8516V3.48438L7.67969 2.39062L8.11719 2.94531L9.10938 4C9.23438 4.14062 9.41406 4.21875 9.60156 4.21875C9.95312 4.21875 10.25 3.96094 10.25 3.58594C10.25 3.39844 10.1797 3.25781 10.0469 3.125L7.57031 0.742188C7.38281 0.554688 7.20312 0.492188 7 0.492188C6.80469 0.492188 6.625 0.554688 6.4375 0.742188L3.96094 3.125C3.82812 3.25781 3.75 3.39844 3.75 3.58594C3.75 3.96094 4.04688 4.21875 4.39844 4.21875C4.58594 4.21875 4.77344 4.14062 4.89844 4L5.89062 2.94531L6.32812 2.39062L6.26562 3.48438V10.8516C6.26562 11.25 6.59375 11.5781 7 11.5781ZM2.73438 17.5312H11.2578C12.8906 17.5312 13.7422 16.6797 13.7422 15.0703V7.85156C13.7422 6.24219 12.8906 5.39062 11.2578 5.39062H9.29688V6.99219H11.1328C11.7812 6.99219 12.1484 7.32812 12.1484 8.01562V14.9062C12.1484 15.5938 11.7812 15.9297 11.1328 15.9297H2.86719C2.21094 15.9297 1.85156 15.5938 1.85156 14.9062V8.01562C1.85156 7.32812 2.21094 6.99219 2.86719 6.99219H4.72656V5.39062H2.73438C1.11719 5.39062 0.25 6.24219 0.25 7.85156V15.0703C0.25 16.6797 1.11719 17.5312 2.73438 17.5312Z" fill="white"/>
          </svg>
          <span>分享</span>
        </div>
      </header>
      <nav className="tool-container">
        {toolbars.map((item, index) => (
          <React.Fragment key={`split-feature-${index}`}>
            {item.map((feature) => renderFeature(feature))}
            <span className="split-line"></span>
          </React.Fragment>
        ))}
      </nav>
      {token && AppId && docId && (
        <WizEditor
          onCreate={handleCreate}
          userId={user.userId}
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          appId={AppId}
          docId={docId}
          options={options}
          permission={'w'}
          accessToken={token}
          containerStyle={{
            maxWidth: '100%',
            height: '100%',
            padding: '0 50px 0'
          }}
        />
      )}
      <Popover
        open={!!fontColorPosition}
        anchorReference="anchorPosition"
        anchorPosition={fontColorPosition}
        onClose={handlePopoverClose}
      >
        <div className={classes.colorContainer}>
          {[0,1,2,3,4,5,6].map((color) => (
            <button
              key={`color-${color}`}
              onClick={() => handleCurrentFontColorChange(`style-color-${color}`)}
              className={classes.colorBlock}
              style={{ backgroundColor: `var(--style-color-${color})`}}
            />
          ))}
        </div>
      </Popover>

      <Popover
        open={!!fontBackgroundPosition}
        anchorReference="anchorPosition"
        anchorPosition={fontBackgroundPosition}
        onClose={handlePopoverClose}
      >
        <div className={classes.colorContainer}>
          {[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map((color) => (
            <button
              key={`background-${color}`}
              onClick={() => handleCurrentFontBackgroundChange(`style-bg-color-${color}`)}
              className={classes.colorBlock}
              style={{ backgroundColor: `var(--style-bg-color-${color})`}}
            />
          ))}
        </div>
      </Popover>
    </div>
  );
}

export default App;
