"use client";
import { colorsAtom, leafNodesAtom, taxonomyAtom } from '@/atoms/global_atoms';
import PaperView from '@/components/PaperView';
import TaxonomyView from '@/components/TaxonomyView';
import { Box, Button, Grid, Group, ScrollArea, Text, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

interface TreeNode {
  id: string;
  label?: string;
  description?: string;
  color_code?: string;
  icon?: string;
  children?: TreeNode[];
}

interface LeafInfo {
  id: string;
  path: string;
  color_code: string | null;
  icon: string | null;
  label: string | null;
  description: string | null;
}

function getLeafInfo(
  node: TreeNode,
  path: string[] = [],
  inheritedColor: string | null = null,
  inheritedIcon: string | null = null,
  results: LeafInfo[] = []
): LeafInfo[] {
  const currentPath = [...path, node.id];

  // Choose node color if present, otherwise inherit
  const currentColor = node.color_code ?? inheritedColor;
  const currentIcon = node.icon ?? inheritedIcon;

  const isLeaf = !node.children || node.children.length === 0;

  if (isLeaf) {
    results.push({
      id: node.id,
      path: currentPath.join("/"),
      color_code: currentColor,
      icon: inheritedIcon,
      label: node.label ?? null,
      description: node.description ?? null
    });
    return results;
  }

  // Recurse into children
  for (const child of node.children!) {
    getLeafInfo(child, currentPath, currentColor, currentIcon, results);
  }

  return results;
}


export default function MainLayout() {

  const [data, setData] = useAtom<any>(taxonomyAtom);
  const [papers, setPapers] = useState<any>(null);
  const [colors, setColors] = useAtom(colorsAtom);
  const [leafNodes, setLeafNodes] = useAtom(leafNodesAtom)

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`); // treat sm and below as mobile
  const [active, setActive] = useState<'left' | 'right'>('left');

  useEffect(() => {
    fetch('/data/taxonomy.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        const leaves = getLeafInfo(json);

        const leafMap: { [key: string]: LeafInfo } = {};
        leaves.forEach((leaf) => {
          leafMap[leaf.id] = leaf;
        });
        setLeafNodes(leafMap);
      });
  }, []);

  useEffect(() => {
    fetch('/data/papers.json')
      .then((res) => res.json())
      .then((json) => setPapers(json));
  }, []);

  useEffect(() => {
    fetch('/data/colors.json')
      .then((res) => res.json())
      .then((json) => setColors(json));
  }, []);

  return (

    <Box style={{ position: 'relative', height: 'calc(100vh - 60px)' }}>
      {/* Desktop: two columns; Mobile: show only active column (full width/height) */}
      <Box
        style={{
          display: isMobile ? 'block' : 'flex',
          height: '100%',
        }}
      >
        {/* Left Sidebar */}
        <ScrollArea
          style={{
            width: isMobile ? '100%' : '35%',
            backgroundColor: 'var(--mantine-color-gray-0)',
            padding: 24,
            display: isMobile && active !== 'left' ? 'none' : undefined,
            height: '100%',
          }}
        >
          <Text fw={500} size="lg" mb="sm">
            Integrated Taxonomy
          </Text>
          <TaxonomyView node={data} />
        </ScrollArea>

        {/* Right Section */}
        <ScrollArea
          style={{
            flex: 1,
            padding: 24,
            display: isMobile && active !== 'right' ? 'none' : undefined,
            height: '100%',
          }}
        >
          <Text fw={500} size="lg" mb="sm">
            List of Papers {
              papers ? `(${papers.length})` : ''
            }
          </Text>
          <PaperView papers={papers} />
        </ScrollArea>
      </Box>

      {/* Mobile bottom toggle */}
      {isMobile && (
        <Group
          style={{
            position: 'fixed',
            bottom: 12,
            left: 12,
            right: 12,
            zIndex: 2000,
            background: 'rgba(255,255,255,0.9)',
            padding: 8,
            borderRadius: 12,
            boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
          }}
        >
          <Button
            variant={active === 'left' ? 'filled' : 'light'}
            onClick={() => setActive('left')}
            style={{ flex: 1 }}
          >
            Taxonomy
          </Button>
          <Button
            variant={active === 'right' ? 'filled' : 'light'}
            onClick={() => setActive('right')}
            style={{ flex: 1 }}
          >
            Papers
          </Button>
        </Group>
      )}
    </Box>

  );
}
