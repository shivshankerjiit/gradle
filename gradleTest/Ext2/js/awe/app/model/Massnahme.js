Ext.define('Awe.model.Massnahme', {
	extend : 'Ext.data.Model',
	fields : [ 'id', 'description', 'realizationOriginal', 'treiber' ],
	associations : [ {
		type : 'hasOne',
		model : 'Awe.model.Treiber',
		name : 'treiber',
		foreignKey : 'treiber',
		setterName: 'setTreiber'
	} ]
});