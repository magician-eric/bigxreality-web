import type { PluginDescriptor } from "emdash";
export declare const REVIEWED: string[];
export declare function bxrCmsPlugin(options?: { url?: string }): PluginDescriptor<{ url?: string }>;
export declare function publishDecision(collection: string, content: Record<string, unknown>, actor?: { role: number }): { cancel: true; reason: string } | undefined;
export declare function saveRule(collection: string, content: Record<string, unknown>, actor?: { role: number }): Record<string, unknown> | undefined;
export declare function nextRun(now: number, firstPending: number | null, delayMinutes: number, maxDelayMinutes: number): string;
export declare function createPlugin(options?: { url?: string }): unknown;
export default createPlugin;
