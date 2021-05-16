Ext.define('Awe.model.Verteiler', {
	extend: 'Ext.data.Model',
	fields: ['aenderungsDatum', 'aweId', 'corpDirUserId', 'erstellungsDatum', 'id', 'verteilerTyp'],

	associations: [{
		type: 'hasOne',
		model: 'Awe.model.Projektbeteiligter',
		name: 'empfaenger',
		associationKey: 'empfaenger'
		// foreignKey: 'empfaenger',
		// setterName: 'setEmpfaenger'
	}]
});