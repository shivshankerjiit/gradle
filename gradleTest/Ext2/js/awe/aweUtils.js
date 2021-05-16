/**
 * A helper function used as a converter on nested model properties. ExtJs'
 * models break if we specify fields which are nested properties of a null
 * object. This method, when used as a "convert" attribute fixes that.
 *
 * @param nestedProperty
 *            The property that should be returned from a given object only if
 *            it is not null
 * @returns {Function} A converter which will get the property passed to it in a
 *          null-safe way
 */
function nullsafeNestedConvertor(nestedProperty) {
	return function(obj) {
		if (!Ext.isEmpty(obj) && obj[nestedProperty]) {
			return obj[nestedProperty];
		}
		return null;
	};
}

/**
 * A function which is used as a stopper so that ExtJs stores don't load data
 * more than once.
 */
function checkStoreLoaded(store) {
	return !store.count() > 0;
}

/**
 * Clears an object by removing its properties which are contained in the
 * "values" list.
 */
function clearObject(object, values) {
	for ( var i in object) {
		if (values.indexOf(object[i]) >= 0) {
			delete object[i];
		}
	}
}

/**
 * Clears an object of any type by removing its properties which are contained
 * in the "values" list.
 */
function fullClearObject(object, values) {
	if (object instanceof Array) {
		for (var j = 0; j < object.length; j++) {
			clearObject(object[j], values);
		}
	} else if (object instanceof Object) {
		for ( var i in object) {
			if (values.indexOf(object[i]) >= 0) {
				delete object[i];
			} else if (object[i] instanceof Object
					|| object[i] instanceof Array) {
				clearObject(object[i], values);
			}
		}
	}
}

function renderMultipleSelectCombobox(value, metaData, record, row, col, store,
		gridView, fieldName) {

	if (record && record.betroffeneBereichen()
			&& record.betroffeneBereichen().data
			&& record.betroffeneBereichen().data.items) {
		var arrayBereichen = record.betroffeneBereichen().data.items;

		if (arrayBereichen.size() > 1) {
			var tooltipText = '';

			for (var i = 0; i < arrayBereichen.size(); i++) {
				if (i == arrayBereichen.size() - 1) {
					tooltipText += arrayBereichen[i].raw.bereich.name;
				} else {
					tooltipText += arrayBereichen[i].raw.bereich.name + ', ';
				}
			}
			metaData.tdAttr = 'data-qtip="' + tooltipText + '"';
			return arrayBereichen[0].raw.bereich.name + ', ...';
		} else if (arrayBereichen.size() == 1) {
			return '' + arrayBereichen[0].raw.bereich.name;
		} else {
			return '';
		}
	}

}

function createZgsStore(initVal) {
	var input = parseInt(initVal);
	var values = [];
	while (input > 0) {
		if (input < 10) {
			values.push({
				'zgs' : '000' + input
			});
		} else if (input < 100) {
			values.push({
				'zgs' : '00' + input
			});
		} else {
			values.push({
				'zgs' : '0' + input
			});
		}
		input--;
	}
	return Ext.create('Ext.data.Store', {
		fields : [ 'zgs' ],
		data : values
	});
}

function getCorrectValueType(value, key) {
	if (key != 'werkWerk' && value !== null && value !== "undefined" && value !== undefined) {
		if (Ext.isNumeric(value) ) {
			value = Number(value);
		} else if (Ext.isBoolean(value)) {
			value = Boolean(value);
		} else if (Ext.isArray(value) && !Ext.isEmpty(value, false) && value.length > 0) {
			var items = value;
			value = [];
			for (var i = 0; i < items.length; i++) {
				var item = getCorrectValueType(items[i]);
				value.push(item);
			}
		} else if (Ext.isString(value)) {
			value = Ext.String.trim(value);
		}
	}

	return value;
}

function bzaTypConverter(bzaTyp) {
	var value = '';

	if (bzaTyp) {
		value = i18n.awe.enums.bzatyp[bzaTyp]();
	}

	return value;
}

/* right now grid only*/
function bzaTypGridConverter(bzaTyp) {
	var value = '';

	if (bzaTyp) {
		var res = bzaTyp.split(",");
		if(res.length > 0) {
			 var x = [];
			for (var i = 0; i < res.length; i++) {
				x.push(i18n.awe.enums.bzatyp[res[i]]());
			}
		 value = x.toString();
		}
	}

	return value;
}

function getDataFromField(dataField, dataLable) {
	if (dataField.getValue()) {
		return {
			dataLable : dataField.getValue()
		};
	} else {
		return {
			dataLable : null
		};
	}
}

function getDataForDates(dataField) {
	if (dataField) {
		if (dataField.getValue()) {
			return dataField.getValue();
		}
	}
}

/*
 * This method is for validating the three fields Q-Planner,
 * Kem-Verantwortlicher and AbweichungsGrund which are required in the database.
 * If the three fields are valid and the page is not the first one, then we
 * enable the save button.
 *
 * @author - sidney.agib@cellent.de @date - 25.06.2015
 *
 * @param - currentPage (The currentPage object of the Wizzard). @param - form
 * (the form from the wizzard). @param - fromWzBtn (The boolean flag which
 * determines if this is called from the button controllers from the wizzard, or
 * initial validation). @return - a boolean value if all the fields are valid
 * and the page is not the first one.
 */
// TODO: not in use
function validateDbRequiredField(currentPage, nextPage, form, fromWzBtn) {
	if (Ext.isEmpty(currentPage)
			|| (Ext.isEmpty(nextPage) && fromWzBtn)
			|| !form
			|| (currentPage == 'awesnrfset' && !fromWzBtn)
			|| (currentPage == 'awegeneralfset' && fromWzBtn && nextPage == 'awesnrfset')) {
		return false;
	}

	var qsVerantwortlicher = form.findField('qsVerantwortlicherId');
	var kemVerantwortlicher = form.findField('kemVerantwortlicherId');
	var ersteller = form.findField('erstellerId');
	var abweichung = form.findField('abweichungsGrund');

	return (qsVerantwortlicher.validate() && kemVerantwortlicher.validate() && abweichung.validate() && ersteller.validate());
}

/*
 * This method is for checking the validity of the three fields Q-Planner,
 * Kem-Verantwortlicher and AbweichungsGrund which are required in the database.
 *
 * @param - currentPage (The currentPage object of the Wizzard). @param - form
 * (the form from the wizzard). @param - fromWzBtn (The boolean flag which
 * determines if this is called from the button controllers from the wizzard, or
 * initial validation). @return - a boolean value if there is a error.
 */

function hasDbRequiredFieldsError(currentPage, nextPage, form, fromWzBtn) {
	if (Ext.isEmpty(currentPage)
			|| (Ext.isEmpty(nextPage) && fromWzBtn)
			|| !form
			|| (currentPage == 'awesnrfset' && !fromWzBtn)
			|| (currentPage == 'awegeneralfset' && fromWzBtn && nextPage == 'awesnrfset')
			|| (currentPage == 'awesnrfset' && nextPage == 'awesnrfset')) {
		return true;
	}

	var qsVerantwortlicher = form.findField('qsVerantwortlicherId');
	var kemVerantwortlicher = form.findField('kemVerantwortlicherId');
	var ersteller = form.findField('erstellerId');
	var abweichung = form.findField('abweichungsGrund');

	return (qsVerantwortlicher.getActiveErrors().length != 0)
			&& (kemVerantwortlicher.getActiveErrors().length != 0)
			&& (ersteller.getActiveErrors().length != 0)
			&& (abweichung.getActiveErrors().length != 0);
}

function popupWindowNoHide(titeMsg, infoMsg, iconClass, winWidth) {
	var windowMsg = Ext.create("Ext.Window", {
		title : titeMsg,
		iconCls : iconClass,
		bodyStyle : 'text-align: center',
		width : winWidth ? winWidth : 600,
		html : infoMsg,
		closable : true
	}).show();
}

function popupWindow(titeMsg, infoMsg, iconClass, time, winWidth) {
	if ( time === null || time === undefined ) {
		time = 2500;
	}
	if ( winWidth === null || winWidth === undefined ) {
		winWidth = 250;
	}

	var windowMsg = Ext.create("Ext.Window", {
		title : titeMsg,
		iconCls : iconClass,
		bodyStyle : 'text-align: center',
		width : winWidth,
		html : infoMsg,
		listeners : {
			show : function(popupWindow) {
				setTimeout(function() {
					popupWindow.hide()
				}, time);
			},
			scope : this
		}
	}).show();
}


/**
 * Finds extjs component, given html element; if not found instantly this method
 * goes up through the DOM tree trying to match html element with extjs
 * component until it reaches the document body, then null is returned
 *
 * @param -
 *            html element
 * @return - ExtJs component
 */
function findComponentByElement(node) {
	var topmost = document.body, target = node, cmp;

	while (target && target.nodeType === 1 && target !== topmost) {
		cmp = Ext.getCmp(target.id);

		if (cmp) {
			return cmp;
		}

		target = target.parentNode;
	}

	return null;
}

/**
 * This method checks if all checkboxes are unchecked; it is used in
 * Awe.view.awe.AweMultiCreateDialog
 *
 * @param -
 *            list of html elements
 * @return - boolean: true if all checkboxes are unchecked, false if there is at
 *         least one checked
 */
function checkIfAllUnchecked(list) {
	for (var i = 0; i < list.size(); i++) {
		if (list[i].getElementsByTagName('input')[0]
				&& list[i].getElementsByTagName('input')[0].getValue() === 'on') {
			return false;
		}
	}

	return true;
}

/**
 * This method converts string to boolean
 *
 * @param -
 *            the string value
 * @returns - boolean value if it can be cast to true, else if it is imposible,
 *          or null
 *
 * @author: sidney.elagib
 */
function convertStringToBoolean(value) {

	if (!Ext.isEmpty(value)) {
		return (value === '1' || value === 'true' || value === true);
	}

	return null;
}

/**
 * This method converts value to an array
 * @param value
 * @returns {Array}
 */
function convertValueToArray(value) {
	if( value ) {
		if( !Ext.isArray(value) ) {
			value = [value];
		}
	}

	return value;
}

/**
 * This function is converting int to boolean and the opposite way.
 * @param value
 * @param isBoolean
 * @returns {Number}
 */
function switchIntBoolean(value, isBoolean) {
	if(isBoolean) {
		value = new Boolean(value);
	} else if(Ext.isBoolean(value) || !value) {
		if(value) {
			return 1;
		} else {
			return 0;
		}
	}
}