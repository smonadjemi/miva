"use client";

import { colorsAtom } from '@/atoms/global_atoms';
import { Group, Avatar, Text, Accordion, AccordionItem, AccordionControl, AccordionPanel } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

const DEFAULT_IMG = '/icons/robot.png';
const DECAULT_DESC = 'No description available.';


interface AccordionLabelProps {
    label: string;
    icon: string;
    description: string;
    color: string;
}

function AccordionLabel({ label, icon, description, color }: AccordionLabelProps) {
    console.log(color)
    return (
        <Group wrap="nowrap">
            <Avatar src={icon? icon: null} radius="xl" size="md" variant="filled" color={color} bg={color}>
                {!icon && <IconArrowRight />}
            </Avatar>
            <div>
                <Text>{label}</Text>
                <Text size="sm" c="var(--mantine-color-gray-8)" fw={300}>
                    {description}
                </Text>
            </div>
        </Group>
    );
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

    const items = node?.children?.map((item) => {

        const col = (colors && item.color_code in colors) ? colors[item.color_code] :
            (inheritedColorCode && colors && inheritedColorCode in colors) ? colors[inheritedColorCode] : { light: '#EEE', dark: '#333' };

        return <AccordionItem value={item.id} key={item.id} bg={col.light} bd={`0.25px solid ${col.dark}`}>
            <AccordionControl aria-label={item.label}>
                <AccordionLabel {...item} color={col.dark} />
            </AccordionControl>
            <AccordionPanel>
                <TaxonomyView node={item} inheritedColorCode={inheritedColorCode? inheritedColorCode: item.color_code} />
            </AccordionPanel>
        </AccordionItem>
    });

    return (
        <Accordion chevronPosition="right" multiple={true} variant="separated" radius="md">
            {items}
        </Accordion>
    );
}