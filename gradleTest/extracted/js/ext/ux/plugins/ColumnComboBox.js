/**
 * Ext.ux.plugins.ColumnComboBox plugin for Ext.form.Combobox
 *
 * @class     Ext.ux.plugins.ColumnComboBox
 * @extends   Ext.util.Observable
 *
 * @author    Philipp Rosenhagen
 * @date      2008-02-06
 * @version   0.1
 * @link      http://extjs.com/learn/Tutorial:Writing_Ext_2_Plugins
 *
 * @fileoverview
 *            It's absolutely neccessary to set the config parameter lazyInit of
 *            the combo to false! Otherwise this plugin cannot use highlighting
 *            of the search text in the drop down list.
 *            The config object must provide the following parameters:
 *            <code>columns: { name: '' }</code>
 *            @cfg {Config object} columns The columns of the dropdown list (config keys: name, width, ...)
 */

// create namespace for plugins
Ext.namespace('Ext.ux.plugins');

Ext.ux.plugins.ColumnComboBox = function(config) {
    Ext.apply(this, config);
};

/*
 * Plugin code
 *
 * Function init is called from the component constructor just after the function
 * initComponent. Function init is called with one argument: component object the plugin is configured for.
 * Function init runs in the context of the instance of the plugin (this variable inside of init points to that
 * instance).
 */
Ext.extend(Ext.ux.plugins.ColumnComboBox, Ext.util.Observable, {
    /**
     * @cfg {Config object} columns The columns of the dropdown list (config keys: name, width, ...)
     */
    columns: '',

    init: function(combo) {
        var columnsTemplate = '';
        var listInnerWidth = 0; // the width of the list without the scrollbar width

        var mainXTemplate;
        var mainXTemplateFunctions = {};

        //combo.afterMethod('render', this.doWidth, this);

        /**
         * Loop over the defined columns and create a cell in the template for each of them.
         */
        Ext.each(this.columns, function(item, index, allItems) {
            /**
             * We have to re-calculate the width of each column based on the provided
             * ones in the config. This is because of IEs box model behaviour (total width
             * of a div is calculated including padding and border). We can define those
             * values in the config of the plugin to tell the template to render nicely.
             * The borders and padding of the cells itself should be provided via css/classes
             * and will not applied via inline styles due to performance reasons.
             * @param cellBorder defines the border around each cell in the table .x-combo-list-item and .x-combo-list-item-empty
             * @param cellPaddingX defines the total padding applied to the .ux-combo-item-inner
             */
            var styleWidth = ' style="width: ' + (item.width-(2*(this.plugins.cellBorder||0))-(this.plugins.cellPaddingX||0)) + 'px"';

            /**
             * Apply the validator for this column/field to the template functions array.
             * We have to use evil eval here because the key in the object have to be dynamic
             * depending on the name of the column.
             */
            if (!Ext.isEmpty(item.validator)) {
                eval("var tmpItem = {validate"+Ext.util.Format.capitalize(item.name)+": item.validator}");
                Ext.applyIf(mainXTemplateFunctions, tmpItem);
            }
            columnsTemplate += '<td class="' +
                             (Ext.isEmpty(item.validator) ? 'x-combo-list-item ' : '') +
                             (item.validator ? '<tpl if="this.validate' + Ext.util.Format.capitalize(item.name) + '(values) == false">x-combo-list-item-empty </tpl>' : '') +
                             (item.validator ? '<tpl if="this.validate' + Ext.util.Format.capitalize(item.name) + '(values) == true">x-combo-list-item </tpl>' : '') +
                             'ux-combo-item ux-combo-item-column' + index + '"' +
                             (item.width ? styleWidth : '' ) +
                             (item.validator ? '<tpl if="this.validate' + Ext.util.Format.capitalize(item.name) + '(values) == true">'+(item.selectable === false ? ' ext:qtip="'+'Bitte wählen Sie ein Teilprojekt aus.'+'"' : '' )+'</tpl>' : '') +
                             '><div class="ux-combo-item-inner">' +
                             (item.validator ? '<tpl if="this.validate' + Ext.util.Format.capitalize(item.name) + '(values) == true"><div' + (item.width ? styleWidth : '' ) + '>{' + item.name + '}</div></tpl>' : '{' + item.name + '}') +
                             (item.validator ? '<tpl if="!this.validate' + Ext.util.Format.capitalize(item.name) + '(values) == true"><div' + (item.width ? styleWidth : '' ) + '>&nbsp;</div></tpl>' : '{' + item.name + '}') +
                             '</div></td>';
            listInnerWidth += item.width; // add the column width to the total width var
        }, combo);

        //Ext.apply(mainXTemplateFunctions, rowCounter);

        if (listInnerWidth === 0) {
            // use the standard value from the combo definition
            listInnerWidth = this.listWidth;
        }

        Ext.XYTemplate = function(){
            Ext.XTemplate.superclass.constructor.apply(this, arguments);
            var s = this.html;

            s = ['<tpl>', s, '</tpl>'].join('');

            var re = /<tpl\b[^>]*>((?:(?=([^<]+))\2|<(?!tpl\b[^>]*>))*?)<\/tpl>/;

            var nameRe = /^<tpl\b[^>]*?for="(.*?)"/;
            var ifRe = /^<tpl\b[^>]*?if="(.*?)"/;
            var execRe = /^<tpl\b[^>]*?exec="(.*?)"/;
            var m, id = 0;
            var tpls = [];

            while(m = s.match(re)){
               var m2 = m[0].match(nameRe);
               var m3 = m[0].match(ifRe);
               var m4 = m[0].match(execRe);
               var exp = null, fn = null, exec = null;
               var name = m2 && m2[1] ? m2[1] : '';
               if(m3){
                   exp = m3 && m3[1] ? m3[1] : null;
                   if(exp){
                       fn = new Function('values', 'parent', 'xindex', 'xcount', 'with(values){ return '+(Ext.util.Format.htmlDecode(exp))+'; }');
                   }
               }
               if(m4){
                   exp = m4 && m4[1] ? m4[1] : null;
                   if(exp){
                       exec = new Function('values', 'parent', 'xindex', 'xcount', 'with(values){ '+(Ext.util.Format.htmlDecode(exp))+'; }');
                   }
               }
               if(name){
                   switch(name){
                       case '.': name = new Function('values', 'parent', 'with(values){ return values; }'); break;
                       case '..': name = new Function('values', 'parent', 'with(values){ return parent; }'); break;
                       default: name = new Function('values', 'parent', 'with(values){ return '+name+'; }');
                   }
               }
               tpls.push({
                    id: id,
                    target: name,
                    exec: exec,
                    test: fn,
                    body: m[1]||''
                });
               s = s.replace(m[0], '{xtpl'+ id + '}');
               ++id;
            }
            for(var i = tpls.length-1; i >= 0; --i){
                this.compileTpl(tpls[i]);
            }
            this.master = tpls[tpls.length-1];
            this.tpls = tpls;
        };

        Ext.extend(Ext.XYTemplate, Ext.XTemplate, {
            compileTpl : function(tpl){
                var fm = Ext.util.Format;
                var useF = this.disableFormats !== true;
                var sep = Ext.isGecko ? "+" : ",";
                var fn = function(m, name, format, args, math){
                    if(name.substr(0, 4) == 'xtpl'){
                        return "'"+ sep +'this.applySubTemplate('+name.substr(4)+', values, parent, xindex, xcount)'+sep+"'";
                    }
                    var v;
                    if(name === '.'){
                        v = 'values';
                    }else if(name === '#'){
                        v = 'xindex';
                    }else if(name.indexOf('.') != -1){
                        v = name;
                    }else{
                        v = "values['" + name + "']";
                    }
                    if(math){
                        v = '(' + v + math + ')';
                    }
                    if(format && useF){
                        args = args ? ',' + args : "";
                        if(format.substr(0, 5) != "this."){
                            format = "fm." + format + '(';
                        }else{
                            format = 'this.call("'+ format.substr(5) + '", ';
                            args = ", values";
                        }
                    }else{
                        args= ''; format = "("+v+" === undefined ? '' : ";
                    }
                    return "'"+ sep + format + v + args + ")"+sep+"'";
                };
                var codeFn = function(m, code){
                    return "'"+ sep +'('+code+')'+sep+"'";
                };

                var body;
                // branched to use + in gecko and [].join() in others
                if(Ext.isGecko){
                    body = "tpl.compiled = function(values, parent, xindex, xcount){ return '" +
                           tpl.body.replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn).replace(this.codeRe, codeFn) +
                            "';};";
                }else{
                    body = ["tpl.compiled = function(values, parent, xindex, xcount){ return ['"];
                    body.push(tpl.body.replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn).replace(this.codeRe, codeFn));
                    body.push("'].join('');};");
                    body = body.join('');
                }
                eval(body);
                return this;
            }
        });

        /**
         * Create the main template consisting of multiple column (template-)source defined previously.
         * We also add the collected template functions to use (the validator for each column field).
         */
        mainXTemplate = new Ext.XYTemplate('<tpl for=".">' +
                 '<tpl if="values.hidden == false">' +
                 '<table class="ux-combo-list-row-table ux-combo-list-row ux-combo-list-row-{[values.cindex % 2 === 0 ? "even" : "odd"]}" border="0" cellspacing="0" cellpadding="0" style="width: ' + listInnerWidth + 'px">' +
                 '<tbody><tr>' +
                 columnsTemplate +
                 '</tr></tbody></table></tpl></tpl>',
        mainXTemplateFunctions);


        /**
         * TODO: This is adapted from the grid templating mechanism.
         * Check if this is necessary for performance reasons or if this is already
         * done later by the combo...
         */
        if (mainXTemplate && typeof mainXTemplate.compile == 'function' && !mainXTemplate.compiled) {
            mainXTemplate.disableFormats = true;
            mainXTemplate.compile();
        }

        /**
         * Now we are overwriting / applying some properties / methods of the combo.
         */
        Ext.apply(combo, {
            /**
             * Applying our custom column template to the combo's list.
             */
            tpl: mainXTemplate,

            hiddenFields: new Ext.util.MixedCollection(),

            /**
             * Extending the render event of the combo to add some custom behaviour.
             */
            onRender: combo.onRender.createSequence(function(ct, position) {
                /**
                 * We want multiple hidden fields to store more values in the dom
                 * after selection.
                 */
                if (this.plugins.hiddenDataFields) {
                    //this.hiddenFields = new Ext.util.MixedCollection();
                    var hdfPrefix = this.plugins.hiddenDataFieldsPrefix || '';
                    Ext.each(this.plugins.hiddenDataFields, function(item, index, allItems) {
                        var itemName = item.name;
                        var theEl = this.el;
                        this.hiddenFields.add(itemName, theEl.insertSibling({tag: 'input', type: 'hidden', name: hdfPrefix+itemName, id: hdfPrefix+(item.id || itemName)},
                                'before', true));
                        this.hiddenFields.get(itemName).value = item.Value !== undefined ? item.Value : '';

                        // prevent input submission
                        theEl.dom.removeAttribute('name');
                    }, this);
                }

                combo.view.prepareData = function(d) {
                    /**
                     * Do the highlighting stuff - replace every occurence of the search string
                     * in each cell which is displayed in the combo list.
                     */
                    var queryString = combo.store.baseParams[combo.queryParam];
                    var regexp = new RegExp(queryString, 'i');
                    Ext.each(combo.plugins.columns, function(item, index, allItems) {
                        var itemName = item.name;
                        d[itemName] = d[itemName].replace(regexp, '<span style="background-color: yellow;">$&</span>');
                    }, combo);
                    return d;
                };

                combo.selectNext = function() {
                    var ct = this.store.getCount(),
                        ctComputed = ct * this.plugins.columns.length;

                    if (ctComputed > 0) {
                        if (this.selectedIndex === -1) {
                            this.select(0);
                            var selectedNodes = this.view.getSelectedNodes();
                            if (selectedNodes.length > 0) {
                                if (Ext.isEmpty(Ext.get(selectedNodes[0]).down('div.ux-combo-item-inner', true).firstChild)) {
                                    this.selectNext();
                                }
                            } else {
                                this.selectNext();
                            }
                        } else if (this.selectedIndex < ctComputed-1) {
                            this.select(this.selectedIndex+1);
                            var selectedNodes = this.view.getSelectedNodes();
                            if (selectedNodes.length > 0) {
                                if (Ext.isEmpty(Ext.get(selectedNodes[0]).down('div.ux-combo-item-inner', true).firstChild)) {
                                    this.selectNext();
                                }
                            } else {
                                this.selectNext();
                            }
                        }
                    }
                };
                combo.selectPrev = function() {
                    var ct = this.store.getCount(),
                        ctComputed = ct * this.plugins.columns.length;

                    if (ctComputed > 0) {
                        if (this.selectedIndex === -1) {
                            this.select(0);
                            var selectedNodes = this.view.getSelectedNodes();
                            if (selectedNodes.length > 0) {
                                if (Ext.isEmpty(Ext.get(selectedNodes[0]).down('div.ux-combo-item-inner', true).firstChild)) {
                                    this.selectNext();
                                }
                            } else {
                                this.selectNext();
                            }
                        } else if (this.selectedIndex !== 0) {
                            this.select(this.selectedIndex-1);
                            var selectedNodes = this.view.getSelectedNodes();
                            if (selectedNodes.length > 0) {
                                if (Ext.isEmpty(Ext.get(selectedNodes[0]).down('div.ux-combo-item-inner', true).firstChild)) {
                                    this.selectPrev();
                                }
                            } else {
                                this.selectPrev();
                            }
                        }
                    }
                };
            }),
/*
            deferRowRender: true,
            // private
            afterRender : function(){
                Ext.form.ComboBox.superclass.afterRender.call(this);

                if (this.deferRowRender) {
                    this.view.afterRender.defer(10, this.view);
                } else {
                    this.view.afterRender();
                }
                this.viewReady = true;
            },
*/

            /**
             * overwriting the expand method to fix the horizontal scrolling bug in IE
             */
            expand: function() {
                if (this.isExpanded() || !this.hasFocus) {
                    return;
                }
                this.list.alignTo(this.wrap, this.listAlign);
                this.list.show();
                this.innerList.setOverflow('auto'); // necessary for FF 2.0/Mac
                this.innerList.applyStyles({'overflow-x': 'hidden'}); // nasty fix for IE
                Ext.getDoc().on('mousewheel', this.collapseIf, this);
                Ext.getDoc().on('mousedown', this.collapseIf, this);
                this.fireEvent('expand', this);
            },

            /**
             * Extending the disable method to reflect the support for multiple
             * hidden fields.
             */
            onDisable: combo.onDisable.createSequence(function() {
                if (this.hiddenFields) {
                    Ext.each(this.hiddenFields, function(item, index, allItems) {
                        item.disabled = this.disabled;
                    }, combo);
                }
            }),

            doForce: combo.doForce.createSequence(function() {
                this.clearValue();
            }),

            /**
             * Extending the disable method to reflect the support for multiple
             * hidden fields.
             */
            clearValue: combo.clearValue.createSequence(function() {
                if (this.hiddenFields) {
                    Ext.each(this.hiddenFields, function(item, index, allItems) {
                        item.value = '';
                    }, combo);
                }
            }),

            /**
             * Overwriting the onSelect method to reflect the support for multiple
             * hidden fields.
             */
            onSelect: function(record, index) {
                if (this.fireEvent('beforeselect', this, record, index) !== false) {
                    this.setValue(record);
                    this.collapse();
                    this.fireEvent('select', this, record, index);
                }
            },

            /**
             * Overwriting the setValue method to reflect the support for multiple
             * hidden fields.
             */
            setValue: function(record) {
                var text =  Ext.util.Format.stripTags(record.data[this.valueField || this.displayField]); // the selected value
                var displayText = Ext.util.Format.stripTags(record.data[this.displayField || this.valueField]); // the selected display value

                //var text = Ext.util.Format.stripTags(record.data[this.displayField || this.valueField]);
                //var r;
                if (this.valueField) {
                    if (text === undefined) {
                        if (this.valueNotFoundText !== undefined) {
                            text = this.valueNotFoundText;
                        }
                    }
                }
                //this.lastSelectionText = text;
                this.lastSelectionText = displayText;
                if (this.hiddenField) {
                    /**
                     * we save the valueField value in the hiddenField not the displayField value
                     */
                    this.hiddenField.value = text;
                }
                if (this.hiddenFields) {
                    this.hiddenFields.each(function(item, index, length) {
                        item.value = record.data[item.name.replace((this.plugins.hiddenDataFieldsPrefix || ''), '')];
                    }, this);
                }
                /**
                 * We are setting the bound/chained fields (each must be of type or subtype Ext.form.Field).
                 */
                if (this.plugins.chainedFields) {
                    this.plugins.chainedFields.each(function(item, index, length) {
                        if (Ext.getCmp(item.cmpId)) {
                            Ext.getCmp(item.cmpId).setValue(Ext.util.Format.stripTags(record.data[item.field] || item.defaultValue));
                        }
                    }, this);
                }

                /**
                 * Calling the method on the superclass with the displayText instead of the text to ensure
                 * we position the list on the currently displayed value.
                 */
                Ext.form.ComboBox.superclass.setValue.call(this, displayText);
                this.value = text;
                Ext.isFirebug ? console.info('>> hit \'em >> rawValue: '+this.getRawValue()) : '';
            },

            /**
             * TODO: overwriting the findRecord method
             * prop - this.valueField
             * value - the value to check
             */
            findRecord: function(prop, value) {
                var record;
                if (this.store.getCount() > 0) {
                    if (this.indexDefinition) {
                        var foundFlag = true;
                        this.store.each(function(r) {
                            foundFlag = true;
                            Ext.each(this.indexDefinition, function(item, index, allItems) {
                                if (r.data[item] != value) {
                                    /**
                                     * if not matched set the flag to false because
                                     * every field must match to get the correct record
                                     */
                                    foundFlag = false;
                                }
                            }, this);
                            if (foundFlag === true) {
                                /**
                                 * the record matches every field defined in the columns
                                 * so its the one we are searching for - set it and exit the
                                 * store recursion.
                                 */
                                record = r;
                                return false;
                            }
                        });
                    } else {
                        /*
                         * this is the old/standard retrieve method
                         */
                        this.store.each(function(r) {
                            if (r.data[prop] == value) {
                                record = r;
                                return false;
                            }
                        });
                    }
                }
                return record;
            },

            /**
             * Overwriting the handling of keys.
             */
            initEvents: combo.initEvents.createSequence(function() {
                /*
                 * We want to move to the next element with the tab key if
                 * the combo list is expanded. Move to the previous element if
                 * we hold the shift key as well.
                 */
                combo.keyNav.tab = function(e) {
                    if (!combo.isExpanded()) {
                        combo.onTriggerClick();
                    } else {
                        combo.inKeyMode = true;
                        if (e.shiftKey) {
                            combo.selectPrev();
                        } else {
                            combo.selectNext();
                        }
                    }
                };

                combo.keyNav.enter = function(e) {

                    var index = combo.view.getSelectedIndexes()[0];

                    var indexComputed = parseInt(index / combo.plugins.columns.length, 10);

                    var r = combo.store.getAt(indexComputed);
                    Ext.isFirebug ? console.debug('the selected index is: '+index) : '';
                    Ext.isFirebug ? console.debug('the selected indexComputed is: '+indexComputed) : '';
                    Ext.isFirebug ? console.debug('record data content: '+Ext.util.JSON.encode(r.data)) : '';
                    if (r) {
                        combo.onSelect(r, indexComputed);
                    }
                };
            }),

            /**
             * TODO: This method throws a unknown runtime error in IE6 which results in a completely broken page!
             * The reason is not yet discovered!
             * It might be something with innerHTML handling in IE6. Maybe we cannot
             * create a table and afterwards adding trs. And the tbody element is somewhat
             * special in IE6. IE6 always creates a tbody element eighter it is created or not in the
             * DOM/innerHTML. That might be a problem as well. Or maybe it's something about adding
             * a block element to a inline element?
             */
            initList: function() {
                if (!this.list) {
                    var cls = 'x-combo-list';

                    this.list = new Ext.Layer({
                        shadow: this.shadow, cls: [cls, this.listClass].join(' '), constrain:false
                    });

                    var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
                    this.list.setWidth(lw);
                    this.list.swallowEvent('mousewheel');
                    this.assetHeight = 0;

                    /**
                     * Prepend the column headers if set.
                     */
                    if (this.plugins.columns) {
                        /*
                         * Create the header table and the header row.
                         */
                        this.headerTable = this.list.createChild({tag: 'table', width: '100%', cellspacing: 0, cellpadding: 0});
                        if (!this.headerTable.child('tbody')) {
                            //this.headerTBody = this.headerTable.createChild({tag: 'tbody'});
                            // this works with IE8 as well!
                            this.headerTBody = this.headerTable.insertHtml('beforeEnd', '<tbody></tbody>', true);
                        } else {
                            this.headerTBody = this.headerTable.child('tbody');
                        }
                        if (Ext.isIE) {
                            this.headerTr = Ext.get(this.headerTBody.dom.insertRow(0));
                        } else {
                            this.headerTr = this.headerTBody.createChild({tag: 'tr'});
                        }
                        /*
                         * Create the columns and add them to the header row.
                         */
                        Ext.each(this.plugins.columns, function(item, index, allItems) {
                            if (Ext.isIE) {
                                this.headerTd = this.headerTr.insertHtml('beforeEnd', '<td class="' + cls + '-hd" align="center" width="' + item.width + '"><span>' + item.header + '</span></td>', true);
                            } else {
                                this.headerTd = this.headerTr.createChild({
                                    cls: cls+'-hd',
                                    tag: 'td',
                                    html: '<span>' + item.header + '</span>',
                                    width: item.width,
                                    align: 'center'
                                });
                            }
                        }, this);
                        this.assetHeight += this.headerTable.getHeight();
                    } else if (this.title) {
                        this.header = this.list.createChild({cls:cls+'-hd', html: this.title});
                        this.assetHeight += this.header.getHeight();
                    }

                    this.innerList = this.list.createChild({cls:cls+'-inner'});

                    this.innerList.on('mouseover', this.onViewOver, this);
                    this.innerList.on('mousemove', this.onViewMove, this);
                    this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

                    if (this.pageSize) {
                        this.footer = this.list.createChild({cls:cls+'-ft'});
                        this.pageTb = new Ext.PagingToolbar({
                            store:this.store,
                            pageSize: this.pageSize,
                            renderTo:this.footer
                        });
                        this.assetHeight += this.footer.getHeight();
                    }

                    if (!this.tpl) {
                        /**
                        * @cfg {String/Ext.XTemplate} tpl The template string, or {@link Ext.XTemplate}
                        * instance to use to display each item in the dropdown list. Use
                        * this to create custom UI layouts for items in the list.
                        * <p>
                        * If you wish to preserve the default visual look of list items, add the CSS
                        * class name <pre>x-combo-list-item</pre> to the template's container element.
                        * <p>
                        * <b>The template must contain one or more substitution parameters using field
                        * names from the Combo's</b> {@link #store Store}. An example of a custom template
                        * would be adding an <pre>ext:qtip</pre> attribute which might display other fields
                        * from the Store.
                        * <p>
                        * The dropdown list is displayed in a DataView. See {@link Ext.DataView} for details.
                        */
                        this.tpl = '<tpl for="."><div class="'+cls+'-item">{' + this.displayField + '}</div></tpl>';
                    }

                    /**
                     * The {@link Ext.DataView DataView} used to display the ComboBox's options.
                     * @type Ext.DataView
                     */
                    this.view = new Ext.DataView({
                        applyTo: this.innerList,
                        tpl: this.tpl,
                        singleSelect: true,
                        selectedClass: this.selectedClass,
                        itemSelector: this.itemSelector || '.' + cls + '-item',
                        listeners: {
                            beforeclick: function(dv, index, node, e) {
                                Ext.isFirebug ? console.debug('beforeclick of ColumnCombobox hit.') : '';

                                var tmpElem = Ext.get(node).down('div.ux-combo-item-inner', true);
                                if (Ext.isEmpty(tmpElem) || Ext.isEmpty(tmpElem.firstChild)) {
                                    return false;
                                } else {
                                    return true;
                                }
                            },
                            beforeselect: function(dv, node, selections) {
                                var tmpElem = Ext.get(node).down('div.ux-combo-item-inner', true);
                                if (Ext.isEmpty(tmpElem) || Ext.isEmpty(tmpElem.firstChild)) {
                                    if (Ext.num(combo.selectedIndex, 0) !== 0) {
                                        //combo.selectedIndex--;
                                    }
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }
                    });

                    this.view.on('click', function(doFocus) {
                        var index = this.view.getSelectedIndexes()[0];

                        //var indexComputed = (index - (index & this.plugins.columns.length)) / this.plugins.columns.length & 3;
                        var indexComputed = parseInt(index / this.plugins.columns.length, 10);

                        var r = this.store.getAt(indexComputed);
                        Ext.isFirebug ? console.debug('the selected index is: '+index) : '';
                        Ext.isFirebug ? console.debug('the selected indexComputed is: '+indexComputed) : '';
                        Ext.isFirebug ? console.debug('record data content: '+Ext.util.JSON.encode(r.data)) : '';
                        if (r) {
                            this.onSelect(r, indexComputed);
                        }
                        if (doFocus !== false) {
                            this.el.focus();
                        }
                    }, this);

                    this.bindStore(this.store, true);

                    if (this.resizable) {
                        this.resizer = new Ext.Resizable(this.list,  {
                           pinned:true, handles:'se'
                        });
                        this.resizer.on('resize', function(r, w, h){
                            this.maxHeight = h-this.handleHeight-this.list.getFrameWidth('tb')-this.assetHeight;
                            this.listWidth = w;
                            this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
                            this.restrictHeight();
                        }, this);
                        this[this.pageSize?'footer':'innerList'].setStyle('margin-bottom', this.handleHeight+'px');
                    }
                }
            } // end of initList
        }); // end of overwriting / applying some properties of the combo
    } // end of init function
});