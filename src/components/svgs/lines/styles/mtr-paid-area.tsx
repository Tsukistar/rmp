import React from 'react';
import { LinePathAttributes, LinePathType, LineStyle, LineStyleComponentProps } from '../../../../constants/lines';

const MTRPaidArea = (props: LineStyleComponentProps<MTRPaidAreaAttributes>) => {
    const { id, path, handlePointerDown } = props;

    const onPointerDown = React.useCallback(
        (e: React.PointerEvent<SVGElement>) => handlePointerDown(id, e),
        [id, handlePointerDown]
    );

    return (
        <path
            id={id}
            d={path}
            fill="none"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            cursor="pointer"
            onPointerDown={onPointerDown}
        />
    );
};

/**
 * MTRPaidArea specific props.
 */
export interface MTRPaidAreaAttributes extends LinePathAttributes {}

const defaultMTRPaidAreaAttributes: MTRPaidAreaAttributes = {};

const attrsComponent = () => undefined;

const mtrPaidArea: LineStyle<MTRPaidAreaAttributes> = {
    component: MTRPaidArea,
    defaultAttrs: defaultMTRPaidAreaAttributes,
    attrsComponent,
    metadata: {
        displayName: 'panel.details.lines.mtrPaidArea.displayName',
        supportLinePathType: [
            LinePathType.Diagonal,
            LinePathType.Perpendicular,
            LinePathType.RotatePerpendicular,
            LinePathType.Simple,
        ],
    },
};

export default mtrPaidArea;
