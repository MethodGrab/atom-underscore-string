'use babel';

const fs         = require( 'fs' );
const path       = require( 'path' );
const getMethods = require( '../lib/get-methods' );
const pkg        = require( '../package' );

const commands = getMethods().map( method => `underscore-string:${method}` );

const activationCommands = {
	'atom-workspace': commands,
};

const update = _ => {
	const file = path.join( __dirname, '../package.json' );
	let data = pkg;
	data.activationCommands = activationCommands;
	data = `${JSON.stringify( data, true, 2 )}\n`;
	return fs.writeFileSync( file, data );
};

update();

module.exports = {
	commands,
	activationCommands,
	update,
};
