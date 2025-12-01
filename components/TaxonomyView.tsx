"use client";

import { colorsAtom, papersAtom } from '@/atoms/global_atoms';
import { Paper } from '@/types/types';
import { Group, Avatar, Text, Accordion, AccordionItem, AccordionControl, AccordionPanel, Card, Title, Box, Badge } from '@mantine/core';
import { Icon12Hours, IconArrowRight, IconBrackets, IconPoint, IconPointFilled } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

const DEFAULT_IMG = '/icons/robot.png';
const DECAULT_DESC = 'No description available.';


interface AccordionLabelProps {
    label: string;
    icon: string;
    description: string;
    color: string;
    isLeaf?: boolean;
    count?: number;
}

function AccordionLabel({ label, icon, description, color, isLeaf, count }: AccordionLabelProps) {
    return (
        <Group wrap="nowrap">
            <Avatar src={icon ? `.${icon}` : null} radius="xl" size="md" variant="filled" color={color} bg={color}>
                {!icon && !isLeaf && <IconBrackets />}
                {!icon && isLeaf && <IconPointFilled />}
            </Avatar>
            <Box w="100%">
                <Group w="100%" justify={'space-between'}>
                    <Text>{label}</Text>
                    {
                        isLeaf && <Badge color={color} variant="light" size="sm">{count}</Badge>
                    }
                </Group>
                <Text size="sm" c="var(--mantine-color-gray-8)" fw={300}>
                    {description}
                </Text>
            </Box>
        </Group>
    );
}


function ExamplesList({ papers }: { papers: Paper[] }) {


    return (
        <>
            {
                papers.length > 0 ?
                <Text fw={800} c="var(--mantine-color-gray-8)" size="sm" mb="xs" px={'md'}>Example Papers:</Text> :
                <Text fw={400} c="var(--mantine-color-gray-7)" size="xs" mb="sm" px={'md'}>No example papers available for this category.</Text>
            }

            {
                papers.map((paper, i) => (
                    <Box key={paper.citation} mb="md" px="md" py={'xs'} >
                        <Text fw={500} c={"var(--mantine-color-gray-8)"} size="sm">{paper.title}</Text>
                        <Group justify="space-between">
                            <Text c="var(--mantine-color-gray-7)" size="xs" mb="sm">{paper.venue} - {paper.year}</Text>
                            <Text c="var(--mantine-color-blue-7)" component="a" href={paper.url} target="_blank" rel="noopener noreferrer" size="xs" mb="xs">Link to paper</Text>
                        </Group>
                    </Box>
                )

                )
            }
        </>
    )
}

type Node = {
    id: string;
    label: string;
    description: string;
    color_code: string;
    icon: string;
    children?: Node[];
}

export default function TaxonomyView({ node, inheritedColorCode }: { node: Node, inheritedColorCode?: string }) {

    const colors = useAtomValue(colorsAtom)
    const papers = useAtomValue(papersAtom)


    const items = node?.children?.map((item) => {

        const col = (colors && item.color_code in colors) ? colors[item.color_code] :
            (inheritedColorCode && colors && inheritedColorCode in colors) ? colors[inheritedColorCode] : { light: '#EEE', dark: '#333' };

        return <AccordionItem value={item.id} key={item.id} bg={col.light} bd={`0.25px solid ${col.dark}`}>
            <AccordionControl aria-label={item.label}>
                <AccordionLabel {...item} color={col.dark} isLeaf={!item.children || item.children.length === 0} count={papers.filter(paper => paper.tags.includes(item.id)).length} />
            </AccordionControl>
            <AccordionPanel>
                {
                    (!item.children || item.children.length === 0) &&
                    <ExamplesList papers={papers.filter(paper => paper.tags.includes(item.id))} />
                }
                <TaxonomyView node={item} inheritedColorCode={inheritedColorCode ? inheritedColorCode : item.color_code} />
            </AccordionPanel>
        </AccordionItem>
    });

    return (
        <Accordion chevronPosition="right" multiple={true} variant="separated" radius="md">
            {items}
        </Accordion>
    );
}


