Ext.define('Awe.model.SNR', {
    extend: 'Ext.data.Model',
    // Due to serialization convention by saving the model some field types differ (i.e. bzaTyp not save as model)
    fields: ['id', 'teilebenennung', 'zgs', 'bzaTyp', 'zeichnungsDatum', 'sieheZeichnungTeil', 'isInformelleMassnahme', 'zieltermin', 'massnahmeDescription',
        // duplicated data
        'positions', 'lieferant', 'werk', 'ersetztesAltteil', 'teil', 'treiber',
        // The three fields below are used only for visual display
        'bzaTypValue',
        'snr',
        'ersAltteilText',
        'sicherheitsrelevant',
        'zertifizierungsrelevant',
        {
            name: 'countPos',
            persist: false/*,
            convert: function(v, model) {
                var val = 0;
                val = model.data.positions.length;
                return val;
            }*/
        }
    ],

    associations: [{
        type: 'hasMany',
        model: 'Awe.model.Position',
        name: 'positions'
    }, {
        type: 'hasOne',
        model: 'Awe.model.Lieferant',
        name: 'lieferant',
        foreignKey: 'lieferant',
        setterName: 'setLieferant'
    }, {
        type: 'hasOne',
        model: 'Awe.model.Werk',
        name: 'werk',
        foreignKey: 'werk',
        setterName: 'setWerk'
    }, {
        type: 'hasOne',
        model: 'Awe.model.Teil',
        name: 'ersetztesAltteil',
        foreignKey: 'ersetztesAltteil',
        setterName: 'setErsetztesAltteil'
    }, {
        type: 'hasOne',
        model: 'Awe.model.Teil',
        name: 'teil',
        foreignKey: 'teil',
        setterName: 'setTeil'
    }, {
        type: 'hasOne',
        model: 'Awe.model.Massnahme',
        name: 'massnahme',
        associationKey: 'massnahme'
    },{
        type: 'hasOne',
        name: 'treiber',
        model: 'Awe.model.Treiber',
        associationKey: 'treiber'
    }]
});