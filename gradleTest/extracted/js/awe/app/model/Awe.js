Ext.define('Awe.model.Awe', {
	extend: 'Ext.data.Model',
	fields: ["id", "aweId", "klassifikation", "prioritaet", "antragstatus", "dialogProjekt", "kem", "grundDetails",
		"betroffenerUmfang", "aenderungsArt", "aweStart", "aweEnde", "erstellungsDatum",
		"aenderungsDatum", "sicherheitsrelevant", "sicherheitsrelevanteAuswirkung",
		"zertifizierungsrelevant", "zertifizierungsrelevanteAuswirkung", "sonderprozessBemusterung", "aktionierungEmpfohlen",
		"menge", "dauer", "hinweisZeichnungsNr", "antragsnummer", "sammelbegriff", "beantragung", "erfassung", "genehmigung",
		"geprueftVon", "genehmigtVon", "dokumentiertVon", "deviationSheet", "notificationE1", "automatischBeendet", "betroffeneProduktionslinienstation", "paev", "ncmNummer", "abweichungsGrund", "betroffeneWerke", "aggregateId",
		/* SDR */
	       "kemStart",
	       "kemEnde",
	       "artAntrag",
	       "anwendungsfall",
	       "vorgenger",
	       "nachfolger",
	       "grundDetailEN",
	       "abweichungsGrundEN",
	    /* SDR */
		// duplicated data
		'qsVerantwortlicher', 'kemVerantwortlicher','windowPerson',
		{
    	    name: 'stueckzahlbegrenzung',
            useNull: true,
            convert: function(v, model) {
                var val = v;
                if (v == 0) {
                    val = null;
                }
                return val;
            }
		}, {
			name: 'kemVerantwortlicherId',
			mapping: 'kemVerantwortlicher',
			convert: nullsafeNestedConvertor('id')
		}, {
			name: 'kemVerantwortlicherCombinedNameAbteilung',
			mapping: 'kemVerantwortlicher',
			convert: nullsafeNestedConvertor('combinedNameAbteilung')
		}, {
			name: 'qsVerantwortlicherId',
			mapping: 'qsVerantwortlicher',
			convert: nullsafeNestedConvertor('id')
		}, {
		    name: 'erstellerId',
		    mapping: 'ersteller',
		    convert: nullsafeNestedConvertor('id')
		},{
            name: 'windowPersonId',
            mapping: 'windowPerson',
            convert: nullsafeNestedConvertor('id')
        }, {
			name: 'qsVerantwortlicherCombinedNameAbteilung',
			mapping: 'qsVerantwortlicher',
			convert: nullsafeNestedConvertor('combinedNameAbteilung')
		}, {
			name: 'erstellerCombinedNameAbteilung',
			mapping: 'ersteller',
			convert: nullsafeNestedConvertor('combinedNameAbteilung')
		}, {
			name: 'betrBaureihenText',
			mapping: 'betroffeneBaureihen',
			convert: nullsafeNestedConvertor('name')
		}, {
			name: 'betrBereichText',
			mapping: 'betroffeneBereichen',
			convert: nullsafeNestedConvertor('name')
		}, {
			name: 'betrProduktionslinieText',
			mapping: 'betroffeneProduktionslinien',
			convert: nullsafeNestedConvertor('name')
		}, {
			name: 'betrGewerkText',
			mapping: 'gewerk',
			convert: nullsafeNestedConvertor('name')
		}, {
			name: 'projektId',
			mapping: 'projekt',
			convert: nullsafeNestedConvertor('pdsId')
		}, {
			name: 'projektText',
			mapping: 'projekt',
			convert: nullsafeNestedConvertor('pdsKBez')
		}, {
			name: 'teilprojektId',
			mapping: 'teilprojekt',
			convert: nullsafeNestedConvertor('pdsId')
		}, {
			name: 'teilprojektText',
			mapping: 'teilprojekt',
			convert: nullsafeNestedConvertor('pdsKBez')
		}, {
			name: 'stuecklisteId',
			mapping: 'stueckliste',
			convert: nullsafeNestedConvertor('slId')
		}, {
			name: 'stuecklisteText',
			mapping: 'stueckliste',
			convert: nullsafeNestedConvertor('slBez')
		}, {
			// this field is only used for grouping Awes in AweMultiCreateDialog.js
			name: 'qsKemGroup',
			mapping: 'qsVerantwortlicherCombinedNameAbteilung',
			convert: function(value, record) {
				var kem = (record.data && record.data.kemVerantwortlicher && record.data.kemVerantwortlicher.combinedNameAbteilung) ? record.data.kemVerantwortlicher.combinedNameAbteilung : '';
				return value + kem;
			}
		}
	],

	associations: [{
		type: 'hasMany',
		name: 'kems',
		model: 'Awe.model.Kem',
		associationKey: 'kems'
	}, {
		type: 'hasMany',
		name: 'snrs',
		model: 'Awe.model.SNR',
		associationKey: 'snrs'
	}, {
		type: 'hasMany',
		name: 'verteiler',
		model: 'Awe.model.Verteiler',
		associationKey: 'verteiler'
	}, {
		type: 'hasMany',
		name: 'betroffeneBaureihen',
		model: 'Awe.model.BetroffeneBaureihen',
		associationKey: 'betroffeneBaureihen'
	}, {
		type: 'hasMany',
		name: 'betroffeneBereichen',
		model: 'Awe.model.BetroffeneBereich',
		associationKey: 'betroffeneBereichen'
	}, {
		type: 'hasMany',
		name: 'betroffeneProduktionslinien',
		model: 'Awe.model.BetroffeneProduktionslinie',
		associationKey: 'betroffeneProduktionslinien'
	}, {
		type: 'hasOne',
		name: 'gewerk',
		model: 'Awe.model.Gewerk',
		associationKey: 'gewerk'
	}, {
		type: 'hasOne',
		name: 'projekt',
		model: 'Awe.model.ProdStru',
		associationKey: 'projekt'
	}, {
		type: 'hasOne',
		name: 'teilprojekt',
		model: 'Awe.model.Teilprojekt',
		associationKey: 'teilprojekt'
	}, {
		type: 'hasOne',
		name: 'stueckliste',
		model: 'Awe.model.Stueckliste',
		associationKey: 'stueckliste'
	}, {
		type: 'hasOne',
		name: 'kemVerantwortlicher',
		model: 'Awe.model.KemVerantwortlicher',
		associationKey: 'kemVerantwortlicher',
		foreignKey: 'kemVerantwortlicher',
		setterName: 'setKemVerantwortlicher'
	}, {
		type: 'hasOne',
		name: 'qsVerantwortlicher',
		model: 'Awe.model.QsVerantwortlicher',
		associationKey: 'qsVerantwortlicher',
		foreignKey: 'qsVerantwortlicher',
		setterName: 'setQsVerantwortlicher'
	}, {
		type: 'hasOne',
		name: 'ersteller',
		model: 'Awe.model.Projektbeteiligter',
		associationKey: 'ersteller',
        foreignKey: 'ersteller',
        setterName: 'setErsteller'
	},{
        type: 'hasOne',
        name: 'windowPerson',
        model: 'Awe.model.WindowPerson',
        associationKey: 'windowPerson',
        foreignKey: 'windowPerson',
        setterName: 'setWindowPerson'
    }],

	validations: [{
		type: 'presence',
		field: 'klassifikation',
		message: i18n.awe.validation.klassifikationMessage()
	}, {
		type: 'presence',
		field: 'prioritaet',
		message: i18n.awe.validation.prioritaetMessage()
	}, {
		type: 'presence',
		field: 'grundDetails',
		//Changed label on AWEGeneralFSet
		message: i18n.awe.validation.grundDetailsMessage()
	}, {
		type: 'presence',
		field: 'betroffenerUmfang',
		message: i18n.awe.validation.betroffenerUmfangMessage()
	}, {
		type: 'presence',
		field: 'abweichungsGrund',
		message: i18n.awe.validation.aweAbweichungMessage()
	}, {
		type: 'presence',
		field: 'aweStart',
		message: i18n.awe.validation.aweStartMessage()
	}, {
		type: 'presence',
		field: 'aweEnde',
		message: i18n.awe.validation.aweEndeMessage()
	}, {
		type: 'presence',
		field: 'dauer',
		message: i18n.awe.validation.dauerMessage()
	}, {
		type: 'presence',
		field: 'aenderungsArt',
		message: i18n.awe.validation.aenderungsArtMessage()
	}, {
		type: 'presence',
		field: 'kemVerantwortlicherId',
		message: i18n.awe.validation.kemVerantwortlicherMessage()
	}, {
		type: 'presence',
		field: 'qsVerantwortlicherId',
		message: i18n.awe.validation.qsVerantwortlicherMessage()
	}, {
	    type: 'presence',
	    field: 'erstellerId',
	    message: i18n.awe.validation.erstellerMessage()
	}],

    proxy: {
        type: 'ajax',
        url: 'awe.load.action',
        simpleSortMode: true,
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty: 'totalCount',
            messageProperty: 'message'
        }
    }
});