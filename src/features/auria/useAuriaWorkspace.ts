import { useEffect, useMemo, useReducer } from 'react';
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
  pendingReply: { id: number; text: string } | null;
  newProjectOpen: boolean;
};

type WorkspaceAction =
  | { type: 'set-composer'; value: string }
  | { type: 'open-panel'; panel: AuriaPanel }
  | { type: 'new-chat' }
  | { type: 'send-message'; text: string; id: number }
  | { type: 'receive-reply'; text: string; id: number }
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
  pendingReply: null,
  newProjectOpen: false,
};

function buildAssistantReply(text: string): string {
  const normalized = text.toLowerCase();
  if (normalized.includes('task') || normalized.includes('priority')) {
    return 'Here is a practical priority structure:\n\n1. Define the outcome and deadline.\n2. Separate urgent work from important work.\n3. Assign an owner and next action to every task.\n4. Review blockers before starting execution.\n\nTell me the project or deadline and I will turn this into a specific task list.';
  }
  if (normalized.includes('report') || normalized.includes('summary')) {
    return 'I can prepare the summary. Send the notes, document, or key points and I will organize them into: executive summary, decisions, risks, and next actions.';
  }
  if (normalized.includes('email') || normalized.includes('follow-up')) {
    return 'I can draft that follow-up. Share the recipient, desired tone, and the action you want them to take. I will produce a concise subject line and editable email.';
  }
  if (normalized.includes('create an image') || normalized.includes('image brief')) {
    return 'Your image brief is ready. I will preserve the selected proportion and can help refine the subject, composition, lighting, and visual style before generation.';
  }
  if (
    normalized.includes('create a document') ||
    normalized.includes('create a presentation') ||
    normalized.includes('create a spreadsheet')
  ) {
    return 'The document workspace is ready. I can build the outline first, then draft each section while keeping the content editable.';
  }
  if (normalized.includes('shared conversation with')) {
    return 'The teammate AI has been added to this conversation. Describe the decision or question you want to work through together.';
  }
  if (normalized.includes('attached files')) {
    return 'The files are ready for analysis. Tell me whether you want a summary, comparison, risk review, data extraction, or action plan.';
  }
  if (normalized.includes('hello') || normalized.includes('hi ')) {
    return 'Hi Marta. What would you like to work on? I can help plan work, summarize information, draft content, or organize a decision.';
  }
  return `I understand. Here is how I would approach it:\n\n• Clarify the desired outcome.\n• Gather the relevant context and constraints.\n• Produce a first actionable version.\n• Refine it with your feedback.\n\nWhat result do you want from “${text.trim()}”?`;
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
        pendingReply: null,
      };
    case 'send-message': {
      const text = action.text.trim();
      if (!text) return state;
      return {
        ...state,
        panel: 'chat',
        showWelcome: false,
        composerText: '',
        activeConversationId: state.activeConversationId ?? `local-${action.id}`,
        pendingReply: { id: action.id, text },
        messages: [
          ...state.messages,
          { id: `m-${action.id}`, role: 'user', text },
        ],
      };
    }
    case 'receive-reply':
      if (state.pendingReply?.id !== action.id) return state;
      return {
        ...state,
        pendingReply: null,
        messages: [
          ...state.messages,
          { id: `m-${action.id}-a`, role: 'assistant', text: action.text },
        ],
      };
    case 'open-conversation': {
      const conversation = auriaConversations.find((item) => item.id === action.conversationId);
      return {
        ...state,
        panel: 'chat',
        showWelcome: false,
        activeConversationId: action.conversationId,
        pendingReply: null,
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

  useEffect(() => {
    if (!state.pendingReply) return;
    const { id, text } = state.pendingReply;
    const timer = setTimeout(() => {
      dispatch({ type: 'receive-reply', id, text: buildAssistantReply(text) });
    }, 700);
    return () => clearTimeout(timer);
  }, [state.pendingReply]);

  return useMemo(
    () => ({
      ...state,
      isWelcomeHome: state.showWelcome && state.panel === 'chat' && state.messages.length === 0,
      showComposer: state.panel === 'chat',
      isResponding: state.pendingReply !== null,
      setComposerText: (value: string) => dispatch({ type: 'set-composer', value }),
      openPanel: (panel: AuriaPanel) => dispatch({ type: 'open-panel', panel }),
      newChat: () => dispatch({ type: 'new-chat' }),
      sendMessage: (text: string) => {
        if (state.pendingReply) return;
        dispatch({ type: 'send-message', text, id: Date.now() });
      },
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
