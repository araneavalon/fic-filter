'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import jss from 'react-jss';

import _ from 'lodash';

import { Button } from 'av/elements';


@jss( ( $ ) => ( {
	container: {
		textAlign: 'center',
		display: 'flex',
		justifyContent: 'space-between',
		padding: [ $.margin.small, '.75em' ],
	},
	numbered: {
		'& > *': {
			'&:not(:last-child)': {
				marginRight: $.margin.small,
			},
		},
		'& > .spacer': {
			userSelect: 'none',
		},
	},
} ) )
export class Pages extends React.Component {
	static displayName = __filename;

	static propTypes = {
		page: PropTypes.number.isRequired,
		onChange: PropTypes.func.isRequired,
		classes: PropTypes.object.isRequired,
	};

	render() {
		const { classes, page, onChange } = this.props;
		return <div className={ classes.container }>
			<Button selected={ page === 1 } disabled={ page < 2 } onClick={ onChange.bind( null, page - 1 ) }>Previous</Button>
			<div className={ classes.numbered }>
				<Button selected={ page === 1 } disabled={ page === 1 } onClick={ onChange.bind( null, 1 ) }>1</Button>
				<Button selected={ page === 2 } disabled={ page === 2 } onClick={ onChange.bind( null, 2 ) }>2</Button>
				{ page >= 9 &&
					<span className="spacer">...</span> }
				{ _.range( ( page < 9 ) ? 3 : page - 4, Math.max( 9, page + 4 ) + 1 ).map( ( n ) =>
					<Button key={ n } selected={ page === n } disabled={ page === n } onClick={ onChange.bind( null, n ) }>{ n }</Button> ) }
			</div>
			<Button selected={ false } onClick={ onChange.bind( null, page + 1 ) }>Next</Button>
		</div>;
	}
}
