import { RmgFieldsField } from '@railmapgen/rmg-components';
import { LineId } from './constants';
import { SimplePathAttributes } from '../components/svgs/lines/paths/simple';
import { DiagonalPathAttributes } from '../components/svgs/lines/paths/diagonal';
import { PerpendicularPathAttributes } from '../components/svgs/lines/paths/perpendicular';
import { SingleColorAttributes } from '../components/svgs/lines/styles/single-color';
import { ShmetroVirtualIntAttributes } from '../components/svgs/lines/styles/shmetro-virtual-int';
import { GzmtrVirtualIntAttributes } from '../components/svgs/lines/styles/gzmtr-virtual-int';
import { ChinaRailwayAttributes } from '../components/svgs/lines/styles/china-railway';
import { BjsubwayTramAttributes } from '../components/svgs/lines/styles/bjsubway-tram';
import { DualColorAttributes } from '../components/svgs/lines/styles/dual-color';
import { RiverAttributes } from '../components/svgs/lines/styles/river';

export enum LinePathType {
    Diagonal = 'diagonal',
    Perpendicular = 'perpendicular',
    Simple = 'simple',
}

export interface ExternalLinePathAttributes {
    [LinePathType.Simple]?: SimplePathAttributes;
    [LinePathType.Diagonal]?: DiagonalPathAttributes;
    [LinePathType.Perpendicular]?: PerpendicularPathAttributes;
}

export enum LineStyleType {
    SingleColor = 'single-color',
    ShmetroVirtualInt = 'shmetro-virtual-int',
    GzmtrVirtualInt = 'gzmtr-virtual-int',
    ChinaRailway = 'china-railway',
    BjsubwayTram = 'bjsubway-tram',
    DualColor = 'dual-color',
    River = 'river',
}

export interface ExternalLineStyleAttributes {
    [LineStyleType.SingleColor]?: SingleColorAttributes;
    [LineStyleType.ShmetroVirtualInt]?: ShmetroVirtualIntAttributes;
    [LineStyleType.GzmtrVirtualInt]?: GzmtrVirtualIntAttributes;
    [LineStyleType.ChinaRailway]?: ChinaRailwayAttributes;
    [LineStyleType.BjsubwayTram]?: BjsubwayTramAttributes;
    [LineStyleType.DualColor]?: DualColorAttributes;
    [LineStyleType.River]?: RiverAttributes;
}

/* ----- Below are core types for all lines, DO NOT TOUCH. ----- */

export interface LineWrapperComponentProps {
    id: LineId;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    /**
     * Indicate whether or not this line is created in progress.
     * If yes, we need to set pointer-events to none
     * so elementsFromPoint will return the underlying station instead of this line.
     * https://stackoverflow.com/a/49174322
     */
    newLine: boolean;
    handleClick: (edge: LineId, e: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
    type: LinePathType;
    attrs: ExternalLinePathAttributes[keyof ExternalLinePathAttributes];
    styleType: LineStyleType;
    styleAttrs: ExternalLineStyleAttributes[keyof ExternalLineStyleAttributes];
}

export interface LineStyleComponentProps<
    T extends NonNullable<ExternalLineStyleAttributes[keyof ExternalLineStyleAttributes]>
> {
    id: LineId;
    type: LinePathType;
    path: `${'m' | 'M'}${string}`;
    styleAttrs: T;
    /**
     * Indicate whether or not this line is created in progress.
     * If true, we need to set pointer-events to none
     * so elementsFromPoint will return the underlying station instead of this line.
     * ONLY NEEDED IN SINGLE-COLOR AS USERS WILL ONLY DRAW LINES IN THIS STYLE.
     * https://stackoverflow.com/a/49174322
     */
    newLine: boolean;
    handleClick: (edge: LineId, e: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
}

/**
 * The base interface of both line path and line style.
 */
interface LineBase<T extends LinePathAttributes> {
    /**
     * The icon displayed in the tools panel.
     */
    icon: JSX.Element;
    /**
     * Default attributes for this component.
     */
    defaultAttrs: T;
    /**
     * Changeable actions in the details panel.
     * In a slightly different RmgFieldsField format that hides some internal implementation.
     * Attrs should be obtained via this wrapper instead of window.graph or redux.
     */
    fields: (Omit<RmgFieldsField, 'value' | 'onChange'> & {
        value: (attrs?: T) => string;
        disabledOptions: (attrs?: T) => (string | number)[];
        onChange: (val: string | number, attrs_?: T) => T;
    })[];
}

export interface LinePathAttributes {}
/**
 * The type a line path should export.
 */
export interface LinePath<T extends LinePathAttributes> extends LineBase<T> {
    /**
     * The line path component.
     */
    generatePath: GeneratePathFunction<T>;
    /**
     * Metadata for this line path.
     */
    metadata: {
        /**
         * The name displayed in the tools and details panels. In react-i18next index format.
         */
        displayName: string;
    };
}

export interface LineStyleAttributes {}
/**
 * The type a line style should export.
 */
export interface LineStyle<T extends LineStyleAttributes> extends Omit<LineBase<T>, 'icon'> {
    /**
     * The line style component.
     */
    component: (props: LineStyleComponentProps<T>) => JSX.Element;
    /**
     * Metadata for this line style.
     */
    metadata: {
        /**
         * The name displayed in the details panel. In react-i18next index format.
         */
        displayName: string;
        /**
         * Indicate which LinePathType will this style support.
         */
        supportLinePathType: LinePathType[];
    };
}

/**
 * The generator type of a line path.
 */
export type GeneratePathFunction<T> = (x1: number, x2: number, y1: number, y2: number, attrs?: T) => `M ${string}`;
