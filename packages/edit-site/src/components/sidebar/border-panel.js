/**
 * WordPress dependencies
 */
import {
	__experimentalBorderRadiusControl as BorderRadiusControl,
	__experimentalBorderStyleControl as BorderStyleControl,
	__experimentalColorGradientControl as ColorGradientControl,
} from '@wordpress/block-editor';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useSetting } from '../editor/utils';

const MIN_BORDER_WIDTH = 0;

// Defining empty array here instead of inline avoids unnecessary re-renders of
// color control.
const EMPTY_ARRAY = [];

export function useHasBorderPanel( { supports, name } ) {
	const controls = [
		useHasBorderColorControl( { supports, name } ),
		useHasBorderRadiusControl( { supports, name } ),
		useHasBorderStyleControl( { supports, name } ),
		useHasBorderWidthControl( { supports, name } ),
	];

	return controls.every( Boolean );
}

function useHasBorderColorControl( { supports, name } ) {
	return (
		useSetting( 'border.customColor', name ) &&
		supports.includes( 'borderColor' )
	);
}

function useHasBorderRadiusControl( { supports, name } ) {
	return (
		useSetting( 'border.customRadius', name ) &&
		supports.includes( 'borderRadius' )
	);
}

function useHasBorderStyleControl( { supports, name } ) {
	return (
		useSetting( 'border.customStyle', name ) &&
		supports.includes( 'borderStyle' )
	);
}

function useHasBorderWidthControl( { supports, name } ) {
	return (
		useSetting( 'border.customWidth', name ) &&
		supports.includes( 'borderWidth' )
	);
}

export default function BorderPanel( {
	context: { supports, name },
	getStyle,
	setStyle,
} ) {
	// To better reflect if the user has customized a value we need to
	// ensure the style value being checked is from the `user` origin.
	const createHasValueCallback = ( feature ) => () =>
		!! getStyle( name, feature, 'user' );

	const createResetCallback = ( feature ) => () =>
		setStyle( name, feature, undefined );

	const handleOnChange = ( feature ) => ( value ) => {
		setStyle( name, feature, value || undefined );
	};

	const units = useCustomUnits( {
		availableUnits: useSetting( 'spacing.units' ) || [ 'px', 'em', 'rem' ],
	} );

	const showBorderWidth = useHasBorderWidthControl( { supports, name } );
	const showBorderStyle = useHasBorderStyleControl( { supports, name } );
	const showBorderColor = useHasBorderColorControl( { supports, name } );
	const showBorderRadius = useHasBorderRadiusControl( { supports, name } );

	const colors = useSetting( 'color.palette' ) || EMPTY_ARRAY;
	const disableCustomColors = ! useSetting( 'color.custom' );
	const disableCustomGradients = ! useSetting( 'color.customGradient' );

	const hasBorderRadius = () => {
		const borderRadius = getStyle( name, 'borderRadius', 'user' );

		if ( typeof borderRadius === 'object' ) {
			return Object.entries( borderRadius ).some( Boolean );
		}

		return !! borderRadius;
	};

	const resetAll = () => {
		setStyle( name, 'borderColor', undefined );
		setStyle( name, 'borderRadius', undefined );
		setStyle( name, 'borderStyle', undefined );
		setStyle( name, 'borderWidth', undefined );
	};

	return (
		<ToolsPanel
			label={ __( 'Border options' ) }
			header={ __( 'Border' ) }
			resetAll={ resetAll }
		>
			{ showBorderWidth && (
				<ToolsPanelItem
					className="single-column"
					hasValue={ createHasValueCallback( 'borderWidth' ) }
					label={ __( 'Width' ) }
					onDeselect={ createResetCallback( 'borderWidth' ) }
					isShownByDefault={ true }
				>
					<UnitControl
						value={ getStyle( name, 'borderWidth' ) }
						label={ __( 'Width' ) }
						min={ MIN_BORDER_WIDTH }
						onChange={ handleOnChange( 'borderWidth' ) }
						units={ units }
					/>
				</ToolsPanelItem>
			) }
			{ showBorderStyle && (
				<ToolsPanelItem
					className="single-column"
					hasValue={ createHasValueCallback( 'borderStyle' ) }
					label={ __( 'Style' ) }
					onDeselect={ createResetCallback( 'borderStyle' ) }
					isShownByDefault={ true }
				>
					<BorderStyleControl
						value={ getStyle( name, 'borderStyle' ) }
						onChange={ handleOnChange( 'borderStyle' ) }
					/>
				</ToolsPanelItem>
			) }
			{ showBorderColor && (
				<ToolsPanelItem
					hasValue={ createHasValueCallback( 'borderColor' ) }
					label={ __( 'Color' ) }
					onDeselect={ createResetCallback( 'borderColor' ) }
					isShownByDefault={ true }
				>
					<ColorGradientControl
						label={ __( 'Color' ) }
						value={ getStyle( name, 'borderColor' ) }
						colors={ colors }
						gradients={ undefined }
						disableCustomColors={ disableCustomColors }
						disableCustomGradients={ disableCustomGradients }
						onColorChange={ handleOnChange( 'borderColor' ) }
					/>
				</ToolsPanelItem>
			) }
			{ showBorderRadius && (
				<ToolsPanelItem
					hasValue={ hasBorderRadius }
					label={ __( 'Radius' ) }
					onDeselect={ createResetCallback( 'borderRadius' ) }
					isShownByDefault={ true }
				>
					<BorderRadiusControl
						values={ getStyle( name, 'borderRadius' ) }
						onChange={ handleOnChange( 'borderRadius' ) }
					/>
				</ToolsPanelItem>
			) }
		</ToolsPanel>
	);
}
