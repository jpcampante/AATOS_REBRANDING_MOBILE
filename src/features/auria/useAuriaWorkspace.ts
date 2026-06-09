import { useMemo, useReducer } from 'react';
import {
  AuriaPanel,
  AuriaProject,
  AuriaProjectVisibility,
  AuriaSidebarProjectRow,
  PROJECT_ACCENT_PALETTE,
  auriaConversations,
  auriaProjects,
  auriaSidebarProjects,
} from '../../data/auriaMockData';
import type { AuriaChatMessage } from './types';

type WorkspaceState = {
  panel: AuriaPanel;
  showWelcome: boolean;
  composerText: string;
  activeConversationId: string | null;
  projects: AuriaProject[];
  projectRows: AuriaSidebarProjectRow[];
  messages: AuriaChatMessage[];
  newProjectOpen: boolean;
};

type WorkspaceAction =
  | { type: 'set-composer'; value: string }
  | { type: 'open-panel'; panel: AuriaPanel }
  | { type: 'new-chat' }
  | { type: 'send-message'; text: string; id: number }
  | { type: 'open-conversation'; conversationId: string }
  | { type: 'open-project-modal' }
  | { type: 'close-project-modal' }
  | { type: 'create-project'; name: string; visibility: AuriaProjectVisibility; id: number };

const initialState: WorkspaceState = {
  panel: 'chat',
  showWelcome: true,
  composerText: '',
  activeConversationId: null,
  projects: [...auriaProjects],
  projectRows: [...auriaSidebarProjects],
  messages: [],
  newProjectOpen: false,
};

function buildAssistantReply(text: string): string {
  const normalized = text.toLowerCase();
  if (normalized.includes('task') || normalized.includes('priority')) {
    return 'I can turn that into a prioritized task plan. The task service is not connected yet, so this remains a draft.';
  }
  if (normalized.includes('report') || normalized.includes('summary')) {
    return 'I can prepare that summary. The reporting service is not connected yet, so I am using the current workspace mock data.';
  }
  if (normalized.includes('email') || normalized.includes('follow-up')) {
    return 'I can draft the follow-up. Email delivery is not connected yet, so nothing will be sent.';
  }
  if (normalized.includes('create an image') || normalized.includes('image brief')) {
    return 'The image request is ready with the selected proportion. Image generation will begin when the media service is connected.';
  }
  if (
    normalized.includes('create a document') ||
    normalized.includes('create a presentation') ||
    normalized.includes('create a spreadsheet')
  ) {
    return 'The document workspace is ready. I will keep the content editable and preserve the requested structure when the document service is connected.';
  }
  if (normalized.includes('shared conversation with')) {
    return 'The teammate AI context has been added to this conversation. Cross-employee AI sync will activate when the workspace service is connected.';
  }
  if (normalized.includes('attached files')) {
    return 'The selected files are ready for analysis. File ingestion will start when the workspace storage service is connected.';
  }
  return 'I understand the request. Auria is currently running with local workspace data while the backend connection is pending.';
}

function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'set-composer':
      return { ...state, composerText: action.value };
    case 'open-panel':
      return {
        ...state,
        panel: action.panel,
        showWelcome: action.panel === 'chat' && state.messages.length === 0,
      };
    case 'new-chat':
      return {
        ...state,
        panel: 'chat',
        showWelcome: true,
        composerText: '',
        activeConversationId: null,
        messages: [],
      };
    case 'send-message': {
      const text = action.text.trim();
      if (!text) return state;
      return {
        ...state,
        panel: 'chat',
        showWelcome: false,
        composerText: '',
        messages: [
          ...state.messages,
          { id: `m-${action.id}`, role: 'user', text },
          { id: `m-${action.id}-a`, role: 'assistant', text: buildAssistantReply(text) },
        ],
      };
    }
    case 'open-conversation': {
      const conversation = auriaConversations.find((item) => item.id === action.conversationId);
      return {
        ...state,
        panel: 'chat',
        showWelcome: false,
        activeConversationId: action.conversationId,
        messages: [
          {
            id: `history-${action.conversationId}`,
            role: 'assistant',
            text: conversation
              ? `Loaded "${conversation.title}". This local preview will be replaced when conversation sync is connected.`
              : 'Loaded the selected conversation preview.',
          },
        ],
      };
    }
    case 'open-project-modal':
      return { ...state, newProjectOpen: true };
    case 'close-project-modal':
      return { ...state, newProjectOpen: false };
    case 'create-project': {
      const accent = PROJECT_ACCENT_PALETTE[state.projects.length % PROJECT_ACCENT_PALETTE.length];
      const project: AuriaProject = {
        id: `p-${action.id}`,
        name: action.name,
        owner: action.name,
        emoji: action.name.charAt(0).toUpperCase() || 'P',
        accent,
        visibility: action.visibility,
        updatedLabel: 'Created just now',
        fileCount: 0,
        chatCount: 0,
      };
      const moreIndex = state.projectRows.findIndex((row) => row.kind === 'more');
      const row: AuriaSidebarProjectRow = { id: project.id, name: project.name, kind: 'folder' };
      const projectRows =
        moreIndex === -1
          ? [...state.projectRows, row]
          : [
              ...state.projectRows.slice(0, moreIndex),
              row,
              ...state.projectRows.slice(moreIndex),
            ];

      return {
        ...state,
        panel: 'projects',
        showWelcome: false,
        newProjectOpen: false,
        projects: [...state.projects, project],
        projectRows,
      };
    }
    default:
      return state;
  }
}

export function useAuriaWorkspace() {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  return useMemo(
    () => ({
      ...state,
      isWelcomeHome: state.showWelcome && state.panel === 'chat' && state.messages.length === 0,
      showComposer: state.panel === 'chat',
      setComposerText: (value: string) => dispatch({ type: 'set-composer', value }),
      openPanel: (panel: AuriaPanel) => dispatch({ type: 'open-panel', panel }),
      newChat: () => dispatch({ type: 'new-chat' }),
      sendMessage: (text: string) => dispatch({ type: 'send-message', text, id: Date.now() }),
      openConversation: (conversationId: string) =>
        dispatch({ type: 'open-conversation', conversationId }),
      openProjectModal: () => dispatch({ type: 'open-project-modal' }),
      closeProjectModal: () => dispatch({ type: 'close-project-modal' }),
      createProject: (input: { name: string; visibility: AuriaProjectVisibility }) =>
        dispatch({ type: 'create-project', ...input, id: Date.now() }),
    }),
    [state],
  );
}
