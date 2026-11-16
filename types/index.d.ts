export type LewyClock = { isWalking: boolean; offsetMs: number; sinceMs: number }

declare module 'claude-code' {
  interface PluginState {
    'lewell-theme': { lewy: Shaped<LewyClock> }
  }
}
