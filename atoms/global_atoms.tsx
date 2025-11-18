import { atom } from "jotai";

export const colorsAtom = atom<{[key: string]: {light: string, dark: string}}>()
export const taxonomyAtom = atom<any>()

interface LeafInfo {
  id: string;
  path: string;
  color_code: string | null;
  icon: string | null;
  label: string | null;
  description: string | null;
}

export const leafNodesAtom = atom<{[key: string]: LeafInfo}>()