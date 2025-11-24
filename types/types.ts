export type Paper = {
    title: string;
    url: string;
    venue: string;
    year: number;
    phase1: boolean;
    phase2: boolean;
    citation: string;
    tags: string[];
}

export type LeafInfo = {
    id: string;
    path: string;
    color_code: string | null;
    icon: string | null;
    label: string | null;
    description: string | null;
}

export type TaxonomyNode = {
    id: string;
    label: string;
    description: string;
    color_code: string;
    icon: string;
    children: TaxonomyNode[];
}


/**
 * 
 * {
"id": "miva",
"label": "Mixed-Initiative Visual Analytics",
"description": "",
"color_code": "",
"icon": "",
"children": [
{
  "id": "human_contri
 */