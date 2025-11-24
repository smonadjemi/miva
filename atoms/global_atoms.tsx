import { LeafInfo, TaxonomyNode } from "@/types/types";
import { atom } from "jotai";

export const colorsAtom = atom<{[key: string]: {light: string, dark: string}}>()
export const taxonomyAtom = atom<TaxonomyNode>()



export const leafNodesAtom = atom<{[key: string]: LeafInfo}>()