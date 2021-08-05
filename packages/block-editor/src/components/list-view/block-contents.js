/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useListViewContext } from './context';
import ListViewBlockSlot from './block-slot';
import ListViewBlockSelectButton from './block-select-button';
import { store as blockEditorStore } from '../../store';

const ListViewBlockContents = forwardRef(
	(
		{
			onClick,
			onToggleExpanded,
			block,
			isSelected,
			position,
			siblingBlockCount,
			level,
			...props
		},
		ref
	) => {
		const { __experimentalFeatures } = useListViewContext();

		const { clientId } = block;

		const { blockMovingClientId, selectedBlockInBlockEditor } = useSelect(
			( select ) => {
				const {
					getBlockRootClientId,
					hasBlockMovingClientId,
					getSelectedBlockClientId,
				} = select( blockEditorStore );
				return {
					rootClientId: getBlockRootClientId( clientId ) || '',
					blockMovingClientId: hasBlockMovingClientId(),
					selectedBlockInBlockEditor: getSelectedBlockClientId(),
				};
			},
			[ clientId ]
		);

		const isBlockMoveTarget =
			blockMovingClientId && selectedBlockInBlockEditor === clientId;

		const className = classnames( 'block-editor-list-view-block-contents', {
			'is-dropping-before': isBlockMoveTarget,
		} );

		return __experimentalFeatures ? (
			<ListViewBlockSlot
				ref={ ref }
				className={ className }
				block={ block }
				onToggleExpanded={ onToggleExpanded }
				isSelected={ isSelected }
				position={ position }
				siblingBlockCount={ siblingBlockCount }
				level={ level }
				{ ...props }
			/>
		) : (
			<ListViewBlockSelectButton
				ref={ ref }
				className={ className }
				block={ block }
				onClick={ onClick }
				onToggleExpanded={ onToggleExpanded }
				isSelected={ isSelected }
				position={ position }
				siblingBlockCount={ siblingBlockCount }
				level={ level }
				{ ...props }
			/>
		);
	}
);

export default ListViewBlockContents;
