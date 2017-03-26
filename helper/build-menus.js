'use babel';

const fs         = require( 'fs' );
const path       = require( 'path' );
const getMethods = require( '../lib/get-methods' );

const menu = getMethods().map(method => {
	return {
		label: method,
		command: `underscore-string:${method}`,
	};
});

const submenu = [
	{
		label: 'underscore.string',
		submenu: menu,
	},
];

const menus = {
	'context-menu': {
		'atom-text-editor': submenu,
	},
	menu: [
		{
			label: 'Packages',
			submenu,
		},
	],
};

const update = _ => {
	const file = path.join( __dirname, '../menus/underscore-string.json' );
	const data = `${JSON.stringify( menus, true, 2 )}\n`;
	return fs.writeFileSync( file, data );
};

update();
