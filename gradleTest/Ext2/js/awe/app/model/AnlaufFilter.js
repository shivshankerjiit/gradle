Ext.define('Awe.model.AnlaufFilter', {
    extend : 'Ext.data.Model',
    // The actual model here has more properties but for now we need just these.
    fields : [ 'pdsId', 'pdsBez', 'pdsName', 'pdsTrmSb', {
	name : 'displayField',
	convert : function(_, model) {
	    var parentIndicatorId = -1;
	    if (model.get('pdsId') == parentIndicatorId) {
		return null;
	    }

	    return model.get('pdsBez') + ", " + model.get('pdsName');
	}
    }, {
	name : 'searchField',
	convert : function(_, model) {
	    var  parentIndicatorId = -1;

	    if ( model.get('pdsId') == parentIndicatorId ) {
		var childsSearchInfo = model.get('pdsName');
		return childsSearchInfo;
	    }

	    return model.get('displayField');
	}
    } ]
});