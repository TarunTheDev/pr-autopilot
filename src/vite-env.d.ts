/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_GITHUB_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'jspdf' {
  export interface jsPDF {
    internal: {
      pageSize: {
        getWidth: () => number;
        getHeight: () => number;
      };
    };
    setFillColor: (r: number, g?: number, b?: number) => void;
    rect: (x: number, y: number, w: number, h: number, style?: string) => void;
    setTextColor: (r: number, g?: number, b?: number) => void;
    setFontSize: (size: number) => void;
    text: (text: string, x: number, y: number) => void;
    setDrawColor: (r: number, g?: number, b?: number) => void;
    setLineWidth: (width: number) => void;
    line: (x1: number, y1: number, x2: number, y2: number) => void;
    splitTextToSize: (text: string, size: number) => string[];
    addPage: () => void;
    save: (filename: string) => void;
    setFont: (name: string, style?: string) => void;
  }
}
