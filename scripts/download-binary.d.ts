#!/usr/bin/env node
export function main(): Promise<void>;
export function getPlatformInfo(): {
  platform: any;
  arch: any;
  binaryName: string;
  assetName: string;
};
