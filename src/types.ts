export interface Explain {
  pre?: string;
  post?: string;
}

export interface Section {
  start?: number;
  end?: number;
}

export interface Diff {
  file: string;
  explain?: Explain;
  section?: Section;
}

export interface Step {
  name: string;
  commit: string;
  explain?: Explain;
  outdated?: true;
  diff: Diff[];
}

export interface TutureMetadata {
  name: string;
  version: string;
  description?: string;
  maintainer?: string;
  topics?: string[];
}

export interface Tuture extends TutureMetadata {
  steps: Step[];
}
