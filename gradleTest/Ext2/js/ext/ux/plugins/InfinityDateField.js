Ext.namespace("Ext.ux.form");

/**
 * @author prosenh
 * @author tkopp15
 * @version 0.1.1
 * @config passing an editor grid reference is mandatory!
 */

Ext.ux.form.InfinityDateField = function(config) {
    Ext.ux.form.InfinityDateField.superclass.constructor.apply(this, arguments);
};
Ext.extend(Ext.ux.form.InfinityDateField, Ext.form.DateField, {

    /***
     * initComponent
     */
    initComponent : function() {
        Ext.apply(this, this.fieldConfig);

        this.extraButtonsCfgs = this.extraButtonsCfgs || [];
        this.extraButtonsCfgs.push(this.fieldExtraButtonsCfgs);

        Ext.applyIf(field.editorConfig.listeners, this.fieldEditorConfig.listeners);

        Ext.ux.form.InfinityDateField.superclass.initComponent.apply(this, arguments);
    },

    fieldExtraButtonsCfgs: [ {
        name: 'infinity',
        text: '&infin;',
        show: true,
        cls: 'x-date-bottom-infinity',
        date: Ext.ux.form.InfinityDateField.infinityDate,
        disableFn: function(item, date) {
            return false;
        },
        handler: function() {
            Ext.isFirebug ? console.debug('infinity button hit.') : '';
            this.setValue(Ext.ux.form.InfinityDateField.infinityDate);
            this.fireEvent('select', this, '');
        },
        tooltip: 'Maximum, keine Terminbewertung'
    } ],

    fieldConfig: {

    },

    fieldEditorConfig: {
        listeners: {
            beforecomplete: this.onBeforeComplete,
            startedit: this.onStartEdit
        }
    },

    onStartEdit: function(boundEl, value) {
        if (value.clearTime(true).getTime() == Ext.ux.form.InfinityDateField.infinityDate.getTime()) {
            this.field.setValue('');
        }
    },

    onBeforeComplete: function(editor, value, startValue) {
        Ext.isFirebug ? console.debug('beforecomplete event of the editor hit ['+value+']['+startValue+']') : '';
        if (Ext.isEmpty(value)) {
            var grid = Ext.getCmp(this.gridId);
            if (Ext.isDate(startValue) && startValue.clearTime(true).getTime() == Ext.ux.form.InfinityDateField.infinityDate.getTime()) {
                grid.stopEditing(true);
            } else {
                var ed = editor;
                (function() {
                    this.value = Ext.ux.form.InfinityDateField.infinityDate;
                    this.startValue = Ext.ux.form.InfinityDateField.infinityDate;
                    this.field.value = Ext.ux.form.InfinityDateField.infinityDate;
                    this.ignoreNoChange = true;
                    this.on('complete', function(ed1, val1, startVal1) {
                        ed1.ignoreNoChange = false;
                    }, this, {single: true});
                    this.completeEdit();
                }).defer(50, this);
                return false;
            }
        }
    }

});

Ext.ux.form.InfinityDateField.prototype.infinityDate = new Date('2059/12/31').clearTime(true);

Ext.ux.form.InfinityDateField.prototype.infinityDateRenderer = function(format) {
    return function(v) {
        var dateVal = v;
        if (Ext.isDate(v)) {
            dateVal = v;
        } else if (Ext.type(v) == 'string') {
            Ext.isFirebug ? console.debug('formating value is of type string...'+v) : '';
            dateVal = Date.parseDate(v, 'Y-m-dTH:i:s');
        }
        if (dateVal >= Ext.ux.form.InfinityDateField.infinityDate) {
            return '--.--.--';
        }
        return Ext.util.Format.date(v, format);
    };
};

Ext.ux.form.InfinityDateField.prototype.getDateFormatByLanguage = function(lang) {
    switch (lang.toLowerCase()) {
        case 'de':
            return 'd.m.y';
            break;
        case 'en':
            return 'm/d/y';
            break;
        default:
            alert('LANGUAGE NOT SUPPORTED');
            return 'd.m.y';
            break;
    }
};