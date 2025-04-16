// src/types/venom.d.ts
declare module 'venom' {
    export interface VenomClient {
      onQRCode(callback: (qrCode: string) => void): void;
      onStateChange(callback: (state: string) => void): void;
      onMessage(callback: (message: any) => void): void;
      sendText(to: string, message: string): Promise<void>;
    }
  
    export function create(): Promise<VenomClient>;
  }
  