'use strict';

import request from 'request-promise-native';
import _ from 'lodash';

import { Query } from 'fic-request-2/query';


// TODO Add qs filtering, when available.
export class FFQuery extends Query {
	parseTitle( { not, value } ) {
		return ( work ) => not( work.title === value );
	}
	parseAuthor( { not, value } ) {
		// ff works can only have one author.
		return ( work ) => not( work.authors[ 0 ][ 0 ] === value );
	}
	parseRating( { not, name } ) {
		const isNone = ( name === 'Explicit' );
		if( isNone && !not() ) {
			this.invalid = true;
			return null;
		}
		return ( work ) => not( work.rating === name );
	}
	parseComplete( { not } ) {
		return ( work ) => not( work.chapters[ 0 ] === work.chapters[ 1 ] );
	}

	parseWarning( { not, name } ) {
		const isAll = ( name === 'Creator Chose Not To Use Archive Warnings' );
		if( ( isAll && not() ) || ( !isAll && !not() ) ) {
			this.invalid = true;
		}
		return null;
	}

	parseRelationship( { not, exact, characters } ) {
		return ( work ) => not( work.tags
			.filter( ( { type } ) => type === 'relationship' )
			.some( ( { characters: c } ) =>
				( exact ? _.xor : _.difference )( characters, c ).length <= 0 ) );
	}
	parseCharacter( { not, name } ) {
		// ff works can not have discrepencies between relationship characters and the character list.
		return ( work ) => not( work.tags
			.filter( ( { type } ) => type === 'character' )
			.find( ( { name: n } ) => n === name ) != null );
	}

	parseRarepairs( { not, relationships } ) {
		return ( work ) => not( work.tags
			.filter( ( { type } ) => type === 'relationship' )
			.some( ( { characters: c } ) =>
				relationships.find( ( p ) => _.xor( c, p ).length <= 0 ) == null ) );
	}

	request( page ) {
		if( this.invalid ) {
			return Promise.resolve( null );
		}
		return request( {
			method: 'GET',
			uri: 'https://www.fanfiction.net/anime/RWBY/',
			qs: { p: page, srt: 1, lan: 1, r: 10 },
		} );
	}
}
