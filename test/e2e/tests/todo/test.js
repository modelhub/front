var page = require('./page.js');

'use strict';

describe('todo', function() {

    beforeEach(function(){
        page.get();
    });

    it('should show TODO on the page', function() {
        expect(element(by.css('.todo')).getText()).toEqual('TODO');
    });

});
