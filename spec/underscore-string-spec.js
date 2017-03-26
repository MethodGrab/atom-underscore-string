'use babel';

import UnderscoreString from '../lib/underscore-string';
import { hasCommand }   from './helpers';
import getMethods       from '../lib/get-methods';
import { commands }     from '../helper/build-activation-commands';

// :: ([ [method, input, expected] ])
const libMethodTests = [
	[ 'camelize', 'foo bar baz', 'fooBarBaz' ],
	[ 'capitalize', 'foo', 'Foo' ],
	[ 'chars', 'foo', '["f","o","o"]' ],
	[ 'classify', 'foo_bar_baz', 'FooBarBaz' ],
	[ 'clean', '  foo   bar  ', 'foo bar' ],
	[ 'cleanDiacritics', 'föö', 'foo' ],
	[ 'dasherize', 'foo', 'foo' ],
	[ 'decapitalize', 'foo', 'foo' ],
	[ 'escapeHTML', 'foo', 'foo' ],
	[ 'escapeRegExp', 'foo', 'foo' ],
	[ 'humanize', '  capitalize dash-CamelCase_underscore trim  ', 'Capitalize dash camel case underscore trim' ],
	[ 'lines', 'foo\nbar', '["foo","bar"]' ],
	[ 'ltrim', '  foo  ', 'foo  ' ],
	[ 'pred', 'b', 'a' ],
	[ 'quote', 'foo', '"foo"' ],
	[ 'reverse', 'foo', 'oof' ],
	[ 'rtrim', '  foo  ', '  foo' ],
	[ 'slugify', 'föö \\bar ^^baz', 'foo-bar-baz' ],
	[ 'stripTags', 'a <a href="#">link</a>', 'a link' ],
	[ 'succ', 'a', 'b' ],
	[ 'swapCase', 'fOo', 'FoO' ],
	[ 'titleize', 'foo bar baz', 'Foo Bar Baz' ],
	[ 'toNumber', '2.556', '3' ],
	[ 'trim', '  foo  ', 'foo' ],
	[ 'underscored', 'fooBar', 'foo_bar' ],
	[ 'unescapeHTML', '&lt;div&gt;Blah&nbsp;blah blah&lt;/div&gt;', '<div>Blah blah blah</div>' ],
	[ 'unquote', '"foo"', 'foo' ],
	[ 'words', 'foo    bar baz', '["foo","bar","baz"]' ],
];

describe( 'underscore-string', _ => {
	let workspaceElement;
	let activationPromise;
	let editor;

	beforeEach( _ => {
		workspaceElement = atom.views.getView( atom.workspace );
		activationPromise = atom.packages.activatePackage( 'underscore-string' );

		waitsForPromise( _ => {
			return atom.workspace.open().then(e => {
				editor = e;
			});
		});
	});

	describe( 'activate', _ => {
		it( 'creates the commands', _ => {
			commands.forEach(command => {
				expect( hasCommand( workspaceElement, command ) ).toBeTruthy();
			});
		});
	});

	describe( 'deactivate', _ => {
		beforeEach( _ => {
			atom.packages.deactivatePackage( 'underscore-string' );
		});

		it( 'destroys the commands', _ => {
			commands.forEach(command => {
				expect( hasCommand( workspaceElement, command ) ).toBeFalsy();
			});
		});
	});

	libMethodTests.forEach(([ name, input, expected ]) => {
		describe( `when the underscore-string:${name} event is triggered`, _ => {
			it( 'transforms a single selection', _ => {
				editor.insertText( input );
				editor.selectAll();

				atom.commands.dispatch( workspaceElement, `underscore-string:${name}` );
				waitsForPromise( _ => activationPromise );

				const actual = editor.getText();
				expect( actual ).toEqual( expected );
			});

			// FIXME: The multiple selection test relies on a new line for each selection
			// but the `lines` input string adds its own new lines
			const itFn = name === 'lines' ? xit : it;

			itFn( 'transforms multiple selections', _ => {
				input    = `${input}\n${input}`;
				expected = `${expected}\n${expected}`;

				editor.setCursorBufferPosition([ 0, 0 ]);
				editor.insertText( input );
				editor.setCursorBufferPosition([ 0, 0 ]);
				editor.addCursorAtBufferPosition([ 1, 0 ]);
				editor.selectToEndOfLine();

				atom.commands.dispatch( workspaceElement, `underscore-string:${name}` );
				waitsForPromise( _ => activationPromise );

				const actual = editor.getText();
				expect( actual ).toEqual( expected );
			});

			it( 'does nothing when nothing is selected', _ => {
				editor.insertText( input );

				atom.commands.dispatch( workspaceElement, `underscore-string:${name}` );
				waitsForPromise( _ => activationPromise );

				const actual = editor.getText();
				expect( actual ).toEqual( input );
			});
		});
	});

});
