export enum CodeLanguage {
  PHP = 'PHP',
  JAVASCRIPT = 'JavaScript',
  PYTHON = 'Python'
}

export enum ProcessMode {
  OBFUSCATE = '混淆/加密',
  DEOBFUSCATE = '解密/还原'
}

export interface ProcessingState {
  isLoading: boolean;
  error: string | null;
}