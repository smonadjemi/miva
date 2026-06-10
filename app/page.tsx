"use client";
import { colorsAtom, leafNodesAtom, papersAtom, taxonomyAtom } from '@/atoms/global_atoms';
import PaperView from '@/components/PaperView';
import TaxonomyView from '@/components/TaxonomyView';
import { Anchor, Badge, Box, Button, Group, Paper, ScrollArea, SegmentedControl, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';

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

const resourceLinks = [
  { label: 'Paper', href: 'https://arxiv.org/abs/2509.19152' },
  { label: 'Supplemental Material', href: '/supplemental.pdf' },
];

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

  const [data, setData] = useAtom(taxonomyAtom);
  const [papers, setPapers] = useAtom(papersAtom);
  const [, setColors] = useAtom(colorsAtom);
  const [leafNodes, setLeafNodes] = useAtom(leafNodesAtom)

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`); // treat sm and below as mobile
  const [active, setActive] = useState<'left' | 'right'>('left');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const selectedLabels = useMemo(() => selectedTags.map((tag) => ({
    id: tag,
    label: leafNodes?.[tag]?.label ?? tag,
  })), [leafNodes, selectedTags]);

  const filteredPapers = useMemo(() => {
    if (!papers) return [];
    if (selectedTags.length === 0) return papers;
    return papers.filter((paper) => selectedTags.every((tag) => paper.tags.includes(tag)));
  }, [papers, selectedTags]);

  const toggleSelectedTag = (tag: string) => {
    setSelectedTags((current) => (
      current.includes(tag)
        ? current.filter((selectedTag) => selectedTag !== tag)
        : [...current, tag]
    ));
  };

  const yearRange = useMemo(() => {
    if (!papers?.length) return '';
    const years = papers.map((paper) => paper.year);
    return `${Math.min(...years)}-${Math.max(...years)}`;
  }, [papers]);

  const leafCount = leafNodes ? Object.keys(leafNodes).length : 0;

  useEffect(() => {
    fetch('./data/taxonomy.json')
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
    fetch('./data/papers.json')
      .then((res) => res.json())
      .then((json) => setPapers(json));
  }, []);

  useEffect(() => {
    fetch('./data/colors.json')
      .then((res) => res.json())
      .then((json) => setColors(json));
  }, []);

  return (

    <Box
      px={{ base: 'md', md: 'xl' }}
      py="lg"
      style={{ height: '100vh', overflow: 'hidden' }}
      onClick={() => setSelectedTags([])}
    >
      <Stack gap="md" h="100%">
        <Box>
          <Stack gap="sm">
            <Box>
              <Title order={1} fz={{ base: 28, md: 38 }} lh={1.05}>
                A Scoping Review of Mixed-Initiative Visual Analytics
              </Title>
              <Group gap="sm" mt="sm" onClick={(event) => event.stopPropagation()}>
                {resourceLinks.map((link) => (
                  <Anchor
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('#') ? undefined : '_blank'}
                    rel={link.href.startsWith('#') ? undefined : 'noopener noreferrer'}
                    size="sm"
                    fw={600}
                    c="dark"
                    underline="always"
                  >
                    {link.label}
                  </Anchor>
                ))}
              </Group>
            </Box>
            <Group gap="xs" visibleFrom="sm">
              <Badge size="lg" variant="outline" color="gray">{papers?.length ?? 0} papers</Badge>
              <Badge size="lg" variant="outline" color="gray">{leafCount} taxonomy leaves</Badge>
              {yearRange && <Badge size="lg" variant="outline" color="gray">{yearRange}</Badge>}
            </Group>
          </Stack>
          {isMobile && (
            <SegmentedControl
              fullWidth
              mt="md"
              value={active}
              onChange={(value) => setActive(value as 'left' | 'right')}
              onClick={(event) => event.stopPropagation()}
              data={[
                { label: 'Taxonomy', value: 'left' },
                { label: 'Papers', value: 'right' },
              ]}
            />
          )}
        </Box>

        <Paper
          withBorder
          radius="md"
          shadow="xs"
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            display: isMobile ? 'block' : 'grid',
            gridTemplateColumns: 'minmax(360px, 42%) minmax(0, 1fr)',
          }}
        >
          <ScrollArea
            style={{
              display: isMobile && active !== 'left' ? 'none' : undefined,
              height: '100%',
              borderRight: isMobile ? 0 : '1px solid var(--mantine-color-gray-3)',
              backgroundColor: '#fbfbfa',
            }}
          >
            <Box p={{ base: 'md', md: 'lg' }}>
              <Group justify="space-between" align="flex-start" mb="md">
                <Box>
                  <Text fw={700} size="lg">Integrated Taxonomy</Text>
                  <Text size="sm" c="gray.7">Click a leaf category to filter the example papers.</Text>
                </Box>
                {selectedTags.length > 0 && (
                  <Button
                    size="xs"
                    variant="subtle"
                    color="dark"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedTags([]);
                    }}
                  >
                    Clear all
                  </Button>
                )}
              </Group>
              {data && (
                <TaxonomyView
                  node={data}
                  selectedIds={selectedTags}
                  onToggle={toggleSelectedTag}
                />
              )}
            </Box>
          </ScrollArea>

          <ScrollArea
            style={{
              display: isMobile && active !== 'right' ? 'none' : undefined,
              height: '100%',
            }}
          >
            <Box p={{ base: 'md', md: 'lg' }}>
              <Group justify="space-between" align="flex-start" mb="md">
                <Box>
                  <Text fw={700} size="lg">Example Papers</Text>
                  <Text size="sm" c="gray.7">
                    {selectedTags.length > 0 ? 'Showing papers matching all selected filters' : 'Showing the full review corpus'}
                  </Text>
                </Box>
                <Group gap="xs">
                  {selectedTags.length > 0 && (
                    <Button
                      size="xs"
                      variant="subtle"
                      color="dark"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedTags([]);
                      }}
                    >
                      Clear all
                    </Button>
                  )}
                  <Badge size="lg" variant="filled" color="dark">
                    {filteredPapers.length}
                  </Badge>
                </Group>
              </Group>
              {selectedLabels.length > 0 && (
                <Group gap="xs" mb="md" onClick={(event) => event.stopPropagation()}>
                  {selectedLabels.map((filter) => (
                    <Badge
                      key={filter.id}
                      size="lg"
                      variant="light"
                      color="dark"
                      styles={{ root: { cursor: 'pointer' } }}
                      onClick={() => toggleSelectedTag(filter.id)}
                    >
                      {filter.label} x
                    </Badge>
                  ))}
                </Group>
              )}
              <PaperView papers={filteredPapers} />
            </Box>
          </ScrollArea>
        </Paper>
      </Stack>
    </Box>

  );
}
