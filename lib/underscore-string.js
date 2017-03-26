'use babel';

import { CompositeDisposable } from 'atom';
import _s from 'underscore.string';
import getMethods from './get-methods';

const availableMethods = getMethods();

export default {

	subscriptions: null,

	activate( state ) {
		this.subscriptions = new CompositeDisposable();

		availableMethods.forEach( method => {
			this.subscriptions.add(atom.commands.add('atom-workspace', {
				[`underscore-string:${method}`]: _ => this.transform( method ),
			}));
		});
	},

	deactivate() {
		this.subscriptions.dispose();
	},

	transform( method ) {
		const editor = atom.workspace.getActiveTextEditor();

		if ( editor ) {
			editor.getSelections().forEach( selection => {
				const text = selection.getText();
				if ( text ) {
					let transformed = _s[ method ]( text );

					if ( typeof transformed !== 'string' ) {
						transformed = JSON.stringify( transformed );
					}

					selection.insertText( transformed, { select: true } );
				}
			});
		}
	},

};
