export interface ProjectState {
    idea_summary: string | null;
    target_user: string | null;
    problem_statement: string | null;
    app_type: string | null;
    resolved_decisions: Record<string, any>;
    unresolved_decisions: string[];
    manual_prerequisites: string[];
    assumptions: string[];
    history: Array<{ question: string; answer: string }>;
    queue?: AIResponse[]; // Queue of next steps
    is_complete: boolean;
}

export type UITemplate =
    | 'free_text'
    | 'single_choice'
    | 'multi_choice'
    | 'explanation_only'
    | 'manual_action'
    | 'summary'
    | 'final_output';

export interface ChoiceOption {
    value: string;
    label: string;
    explanation?: string;
}

export interface UIContent {
    question_text: string;
    explanation?: string;
    options?: ChoiceOption[]; // For single_choice, multi_choice
    action_title?: string; // For manual_action
    action_description?: string; // For manual_action
    summary_text?: string; // For summary

    // V3: Auto-Decisions notification
    auto_decisions?: Array<{ decision: string; reason: string }>;

    // For final_output
    project_name?: string;
    app_tagline?: string;
    features_list?: string[];
    tech_stack_recommendation?: string[];
    mega_prompt?: string;
    agents_md?: string;

    // V3: Collected Guides
    manual_guides?: Array<{ title: string; steps: string[] }>;
}

export interface AIResponse {
    type: 'question' | 'final_output' | 'error';
    template: UITemplate;
    content: UIContent;
    project_state_updates?: Partial<ProjectState>;
    // queue_updates removed in V4
    is_educational?: boolean; // For star icon
    progress?: {
        current: number;
        total: number;
    };
}

export interface ClientState {
    projectId: string;
    projectState: ProjectState;
    currentScreen: AIResponse;
}
