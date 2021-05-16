Ext.define('Awe.model.BzaTyp', {
    extend : 'Ext.data.Model',
    fields : [{
        name : 'name',
        type : 'string'
    }, {
        name : 'value',
        type : 'string'
    }],
    proxy : {
	type : 'ajax',
	url : 'awe.bzatyp.populate.action',
	simpleSortMode : true,
	reader : {
	    type : 'json',
	    root : 'data',
	    successProperty : 'success',
	    totalProperty : 'totalCount'
	}
    }
});
