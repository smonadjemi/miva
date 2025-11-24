import { colorsAtom, leafNodesAtom, taxonomyAtom } from "@/atoms/global_atoms";
import { Paper } from "@/types/types";
import { Avatar, Box, Divider, Flex, Group, Indicator, Text, Tooltip } from "@mantine/core";
import { useAtomValue } from "jotai";


export default function PaperView({ papers }: { papers: Paper[] | null }) {

    if (!papers) {
        return <div>Loading papers...</div>;
    }

    return (
        <div>
            {papers.sort((a, b) => a.title.localeCompare(b.title)).map((paper: any) => (
                <Box key={paper.citation} mb="md" p="md" style={{ border: '1px solid var(--mantine-color-gray-4)', borderRadius: 8 }}>
                    <Text fw={500} c={"var(--mantine-color-gray-8)"} size="lg">{paper.title}</Text>
                    <Group justify="space-between">
                        <Text c="var(--mantine-color-gray-7)" size="sm" mb="sm">{paper.venue} - {paper.year}</Text>
                        <Text c="var(--mantine-color-blue-7)" component="a" href={paper.url} target="_blank" rel="noopener noreferrer" size="sm" mb="sm">Link to paper</Text>
                    </Group>
                    <Tags tags={paper.tags} />
                </Box>
            ))}
        </div>
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

    return <Flex wrap="wrap" gap={0} pt={'md'}>
        {
            taxonomy?.children.map((group) => (
                groups[group.id]?.length > 0 ?
                    <Box key={group.id} px={'xs'}>
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
                    <Box key={group.id} px={'xs'}>
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
                            {leafNodes && leafNodes[tag] && leafNodes[tag].label ? leafNodes[tag].label : tag}:
                        </Text>
                        <Text c="var(--mantine-color-gray-7)" size="xs" mb={6}>
                            {leafNodes && leafNodes[tag] && leafNodes[tag].description ? leafNodes[tag].description : 'No description available.'}
                        </Text>
                        <Divider my={12} size={0.2} color="gray.7" />
                    </div>
                ))
            }

        </div >
    )
}
