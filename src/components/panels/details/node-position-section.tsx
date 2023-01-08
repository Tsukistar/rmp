import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Heading } from '@chakra-ui/react';
import { RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { saveGraph } from '../../../redux/param/param-slice';
import { setRefresh } from '../../../redux/runtime/runtime-slice';

export default function NodePositionSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();
    const hardRefresh = React.useCallback(() => {
        dispatch(setRefresh());
        dispatch(saveGraph(graph.current.export()));
    }, [dispatch, setRefresh, saveGraph]);
    const {
        selected,
        refresh: { all: refreshAll },
    } = useRootSelector(state => state.runtime);
    const selectedFirst = selected.at(0);
    const graph = React.useRef(window.graph);

    const [pos, setPos] = React.useState({ x: 0, y: 0 });
    React.useEffect(() => {
        const selectedFirst = selected.at(0);
        if (selectedFirst?.startsWith('stn') || selectedFirst?.startsWith('misc_node_')) {
            const x = graph.current.getNodeAttribute(selectedFirst, 'x');
            const y = graph.current.getNodeAttribute(selectedFirst, 'y');
            setPos({ x, y });
        }
    }, [refreshAll, selected]);

    const fields: RmgFieldsField[] = [
        {
            type: 'input',
            label: t('panel.details.nodePosition.pos.x'),
            value: pos.x.toString(),
            validator: val => !Number.isNaN(val),
            onChange: val => {
                graph.current.mergeNodeAttributes(selectedFirst, { x: Number(val) });
                hardRefresh();
            },
        },
        {
            type: 'input',
            label: t('panel.details.nodePosition.pos.y'),
            value: pos.y.toString(),
            validator: val => !Number.isNaN(val),
            onChange: val => {
                graph.current.mergeNodeAttributes(selectedFirst, { y: Number(val) });
                hardRefresh();
            },
        },
    ];

    return (
        <Box p={1}>
            <Heading as="h5" size="sm">
                {t('panel.details.nodePosition.title')}
            </Heading>

            <RmgFields fields={fields} minW={130} />
        </Box>
    );
}
