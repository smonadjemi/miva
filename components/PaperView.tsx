import { colorsAtom, leafNodesAtom, taxonomyAtom } from "@/atoms/global_atoms";
import { Paper } from "@/types/types";
import { Anchor, Avatar, Badge, Box, Divider, Flex, Group, Indicator, Stack, Text, Tooltip } from "@mantine/core";
import { useAtomValue } from "jotai";


export default function PaperView({ papers }: { papers: Paper[] | null }) {

    if (!papers) {
        return <div>Loading papers...</div>;
    }

    return (
        <Stack gap="sm">
            {[...papers].sort((a, b) => a.title.localeCompare(b.title)).map((paper: Paper) => (
                <Box
                    key={paper.citation}
                    p="md"
                    onClick={(event) => event.stopPropagation()}
                    style={{
                        border: '1px solid var(--mantine-color-gray-3)',
                        borderRadius: 8,
                        background: 'white',
                    }}
                >
                    <Group justify="space-between" align="flex-start" gap="md">
                        <Box style={{ flex: 1 }}>
                            <Text fw={650} c="var(--mantine-color-gray-9)" size="md" lh={1.3}>{paper.title}</Text>
                            <Group gap={6} mt={6}>
                                <Badge variant="light" color="gray">{paper.year}</Badge>
                                <Text c="var(--mantine-color-gray-7)" size="sm">{paper.venue}</Text>
                            </Group>
                        </Box>
                        <Anchor href={paper.url} target="_blank" rel="noopener noreferrer" size="sm" fw={600}>
                            Paper
                        </Anchor>
                    </Group>
                    <Tags tags={paper.tags} />
                </Box>
            ))}
        </Stack>
    );
}


function Tags({ tags }: { tags: string[] }) {

    const leafNodes = useAtomValue(leafNodesAtom)
    const colors = useAtomValue(colorsAtom)
    const taxonomy = useAtomValue(taxonomyAtom)

    const groups = tags.reduce((acc: { [key: string]: string[] }, tag: string) => {
        const key: string | undefined = (leafNodes && leafNodes[tag] && leafNodes[tag].path.split('/')[1]) || undefined;
        if (key) {
            acc[key] = acc[key] || [];
            acc[key].push(tag);
        }

        return acc;
    }, {});

    return <Flex wrap="wrap" gap={'xs'} pt={'md'}>
        {
            taxonomy?.children.map((group) => (
                groups[group.id]?.length > 0 ?
                    <Box key={group.id} px={'0'}>
                        <Tooltip

                            bg={colors && group.color_code in colors ? colors[group.color_code].light : ''}
                            label={<TagTooltip category={group.label} tags={groups[group.id]} />}
                            position="bottom"
                            withArrow>
                            <Indicator inline label={<Text size="xs" fw={200}>{groups[group.id].length}</Text>} size={'xs'} offset={1}
                                color={colors && group.color_code in colors ? colors[group.color_code].dark : ''} >
                                <Avatar
                                    size={'sm'}
                                    radius="xl"
                                    variant="filled"
                                    bg={colors && group.color_code in colors ? colors[group.color_code].light : ''}
                                    src={group.icon ? `.${group.icon}` : undefined}
                                    style={{ marginRight: 4, verticalAlign: 'middle' }}
                                />
                            </Indicator>

                        </Tooltip> </Box> :
                    <Box key={group.id} px={'0'}>
                        <Tooltip
                            key={group.id}
                            label={<Text c={'var(--mantine-color-gray-8)'} size="sm">No tags for {group.label}</Text>}
                            bg={colors && group.color_code in colors ? colors[group.color_code].light : ''}
                            position="bottom"
                            withArrow>
                            <Avatar
                                size={'sm'}
                                radius="xl"
                                opacity={0.1}
                                variant="filled"
                                bg={colors && group.color_code in colors ? colors[group.color_code].light : ''}
                                src={group.icon ? `.${group.icon}` : undefined}
                                color={colors && group.color_code in colors ? colors[group.color_code].light : ''}
                                style={{ marginRight: 4, verticalAlign: 'middle' }}
                            />
                        </Tooltip>
                    </Box>
            ))
        }
    </Flex>
}

function TagTooltip({ category, tags }: { category: string, tags: string[] }) {

    const leafNodes = useAtomValue(leafNodesAtom)

    return (
        <div>
            <Text
                size="sm"
                fw={500}
                c={"var(--mantine-color-gray-9)"}
            >{category}</Text>
            {
                tags.map((tag) => (
                    <div key={tag}>
                        <Text fw={400} c="var(--mantine-color-gray-8)" mt={4} size="xs">
                            {leafNodes && leafNodes[tag] && leafNodes[tag].label ? leafNodes[tag].label : tag}
                            {leafNodes && leafNodes[tag] && leafNodes[tag].description && `:${leafNodes[tag].description}`}
                        </Text>
                        <Divider my={12} size={0.2} color="gray.7" />
                    </div>
                ))
            }

        </div >
    )
}
