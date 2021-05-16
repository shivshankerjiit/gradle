Ext.define('Awe.model.ProdStru', {
	extend : 'Ext.data.Model',
	// the actual model here has more properties but for now we need just these
	fields : [ 'pdsId', 'pdsKBez', 'pdsBez', 'slBez', {
		name : 'bez',
		// a custom computed property that shows the pdsBez in case it exists and
		// fallbacks to slBez if not. This is because of the different objects loaded
		// and in the Anlauf dropdown - ProdStru objects from the Ajax and Stueckliste
		// object from the Awe model
		convert : function(_, model) {
			if (model.get('pdsBez')) {
				return model.get('pdsBez');
			}

			return model.get('slBez');
		}
	} ]
});