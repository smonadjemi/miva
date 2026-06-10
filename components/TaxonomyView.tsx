"use client";

import { colorsAtom, papersAtom } from '@/atoms/global_atoms';
import { Group, Avatar, Text, Accordion, AccordionItem, AccordionControl, AccordionPanel, Box, Badge, UnstyledButton } from '@mantine/core';
import { IconBrackets, IconPointFilled } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';


interface AccordionLabelProps {
    label: string;
    icon: string | null;
    description: string | null;
    iconColor: string;
    badgeColor: string;
    isLeaf?: boolean;
    count?: number;
    showCount?: boolean;
    active?: boolean;
}

function AccordionLabel({ label, icon, description, iconColor, badgeColor, isLeaf, count, showCount = true, active }: AccordionLabelProps) {
    return (
        <Group wrap="nowrap" align="flex-start">
            <Avatar src={icon ? `.${icon}` : null} radius="xl" size="md" variant="filled" color={iconColor} bg={iconColor}>
                {!icon && !isLeaf && <IconBrackets />}
                {!icon && isLeaf && <IconPointFilled />}
            </Avatar>
            <Box w="100%">
                <Group w="100%" justify={'space-between'}>
                    <Text fw={active ? 700 : 500}>{label}</Text>
                    {showCount &&
                        <Badge color={badgeColor} variant={active ? "filled" : "light"} size="sm">{count}</Badge>
                    }
                </Group>
                <Text size="sm" c="var(--mantine-color-gray-7)" fw={300} lineClamp={2}>
                    {description}
                </Text>
            </Box>
        </Group>
    );
}


type Node = {
    id: string;
    label: string;
    description: string;
    color_code: string | null;
    icon: string | null;
    children?: Node[];
}

export default function TaxonomyView({
    node,
    inheritedColorCode,
    selectedIds,
    onToggle,
    depth = 0
}: {
    node: Node,
    inheritedColorCode?: string | null,
    selectedIds?: string[],
    onToggle?: (id: string) => void,
    depth?: number
}) {

    const colors = useAtomValue(colorsAtom)
    const papers = useAtomValue(papersAtom)


    const items = node?.children?.map((item) => {

        const col = (colors && item.color_code && item.color_code in colors) ? colors[item.color_code] :
            (inheritedColorCode && colors && inheritedColorCode in colors) ? colors[inheritedColorCode] : { light: '#EEE', dark: '#333' };
        const count = papers.filter(paper => paper.tags.includes(item.id)).length;
        const isLeaf = !item.children || item.children.length === 0;
        const active = isLeaf && (selectedIds?.includes(item.id) ?? false);
        const borderColor = active ? col.dark : 'var(--mantine-color-gray-3)';
        const showCount = depth > 0;

        if (isLeaf) {
            return (
                <UnstyledButton
                    key={item.id}
                    onClick={(event) => {
                        event.stopPropagation();
                        onToggle?.(item.id);
                    }}
                    style={{
                        width: '100%',
                        display: 'block',
                        borderRadius: 8,
                    }}
                >
                    <Box
                        bg={active ? col.light : 'white'}
                        p="sm"
                        mb="xs"
                        style={{
                            borderTop: `1px solid ${borderColor}`,
                            borderRight: `1px solid ${borderColor}`,
                            borderBottom: `1px solid ${borderColor}`,
                            borderLeft: `5px solid ${col.dark}`,
                            borderRadius: 8,
                        }}
                    >
                        <AccordionLabel {...item} iconColor={col.light} badgeColor={col.dark} isLeaf count={count} showCount={showCount} active={active} />
                    </Box>
                </UnstyledButton>
            )
        }

        return <AccordionItem
            value={item.id}
            key={item.id}
            bg={active ? col.light : 'white'}
            style={{
                borderTop: `1px solid ${borderColor}`,
                borderRight: `1px solid ${borderColor}`,
                borderBottom: `1px solid ${borderColor}`,
                borderLeft: `5px solid ${col.dark}`,
                overflow: 'hidden',
            }}
        >
            <AccordionControl
                aria-label={item.label}
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >
                <AccordionLabel {...item} iconColor={col.light} badgeColor={col.dark} isLeaf={false} count={count} showCount={showCount} active={active} />
            </AccordionControl>
            <AccordionPanel onClick={(event) => event.stopPropagation()}>
                <TaxonomyView
                    node={item}
                    inheritedColorCode={inheritedColorCode ? inheritedColorCode : item.color_code}
                    selectedIds={selectedIds}
                    onToggle={onToggle}
                    depth={depth + 1}
                />
            </AccordionPanel>
        </AccordionItem>
    });

    return (
        <Accordion chevronPosition="right" multiple={true} variant="separated" radius="md">
            {items}
        </Accordion>
    );
}
