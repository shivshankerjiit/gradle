/**
 * Search plugin for Ext.grid.GridPanel, Ext.grid.EditorGrid ver. 2.x or subclasses of them
 *
 * @author    Ing. Jozef Sakalos
 * @copyright (c) 2008, by Ing. Jozef Sakalos
 * @date      17. January 2008
 * @version   $Id: Ext.ux.plugins.GridSearch.js 11 2008-02-22 17:13:52Z jozo $
 *
 * @license Ext.ux.plugins.GridSearch is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 *
 * License details: http://www.gnu.org/licenses/lgpl.html
 *
 * Note: originally named Ext.ux.grid.Search
 */

Ext.ns('Ext.ux.plugins');

/**
 * @class Ext.ux.plugins.GridSearch
 * @extends Ext.util.Observable
 * @param {Object} config configuration object
 * @constructor
 */
Ext.ux.plugins.GridSearch = function(config) {
    Ext.apply(this, config);
    Ext.ux.plugins.GridSearch.superclass.constructor.call(this);
}; // eo constructor

Ext.extend(Ext.ux.plugins.GridSearch, Ext.util.Observable, {
    /**
     * @cfg {String} searchText Text to display on menu button
     */
     searchText:'Search'

    /**
     * @cfg {String} searchTipText Text to display as input tooltip. Set to '' for no tooltip
     */
    ,searchTipText:'Type a text to search and press Enter'

    /**
     * @cfg {String} selectAllText Text to display on menu item that selects all fields
     */
    ,selectAllText:'Select All'

    /**
     * @cfg {String} position Where to display the search controls. Valid values are top and bottom (defaults to bottom)
     * Corresponding toolbar has to exist at least with mimimum configuration tbar:[] for position:top or bbar:[]
     * for position bottom. Plugin does NOT create any toolbar.
     */
    ,position:'bottom'

    /**
     * @cfg {String} iconCls Icon class for menu button (defaults to icon-magnifier)
     */
    ,iconCls:'icon-magnifier'

    /**
     * @cfg {String/Array} checkIndexes Which indexes to check by default. Can be either 'all' for all indexes
     * or array of dataIndex names, e.g. ['persFirstName', 'persLastName']
     */
    ,checkIndexes:'all'

    /**
     * @cfg {Array} disableIndexes Array of index names to disable (not show in the menu), e.g. ['persTitle', 'persTitle2']
     */
    ,disableIndexes:[]

    /**
     * @cfg {String} dateFormat how to format date values. If undefined (the default)
     * date is formatted as configured in colummn model
     */
    ,dateFormat:undefined

    /**
     * @cfg {Boolean} showSelectAll Select All item is shown in menu if true (defaults to true)
     */
    ,showSelectAll:true

    /**
     * @cfg {Boolean} disableFieldSelection Instead of a menu only a label text is shown if true (defaults to false)
     */
    ,disableFieldSelection:false

    /**
     * @cfg {String} mode Use 'remote' for remote stores or 'local' for local stores. If mode is local
     * no data requests are sent to server the grid's store is filtered instead (defaults to 'remote')
     */
    ,mode:'remote'

    /**
     * @cfg {Number} width Width of input field in pixels (defaults to 100)
     */
    ,width:100

    /**
     * @cfg {String} xtype xtype is usually not used to instantiate this plugin but you have a chance to identify it
     */
    ,xtype:'gridsearch'

    /**
     * @cfg {Object} paramNames Params name map (defaults to {fields:'fields', query:'query'}
     */
    ,paramNames: {
         fields:'fields'
        ,query:'query'
    }

    /**
     * @cfg {String} shortcutKey Key to focus the input field (defaults to r = Sea_r_ch). Empty string disables shortcut
     */
    ,shortcutKey:'r'

    /**
     * @cfg {String} shortcutModifier Modifier for shortcutKey. Valid values: alt, ctrl, shift (defaults to alt)
     */
    ,shortcutModifier:'alt'

    /**
     * @cfg {String} align 'left' or 'right' (defaults to 'left')
     */

    /**
     * @cfg {Number} minLength force user to type this many character before he can make a search
     */

    /**
     * @cfg {Ext.Panel/String} toolbarContainer Panel (or id of the panel) which contains toolbar we want to render
     * search controls to (defaults to this.grid, the grid this plugin is plugged-in into)
     */

    // {{{
    /**
     * private
     * @param {Ext.grid.GridPanel/Ext.grid.EditorGrid} grid reference to grid this plugin is used for
     */
    ,init:function(grid) {
        this.grid = grid;

        this.grid.addEvents({ filter: true });

        // setup toolbar container if id was given
        if('string' === typeof this.toolbarContainer) {
            this.toolbarContainer = Ext.getCmp(this.toolbarContainer);
        }

        // do our processing after grid render and reconfigure
        grid.onRender = grid.onRender.createSequence(this.onRender, this);
        grid.reconfigure = grid.reconfigure.createSequence(this.reconfigure, this);
    } // eo function init
    // }}}
    // {{{
    /**
     * private add plugin controls to <b>existing</b> toolbar and calls reconfigure
     */
    ,onRender:function() {
        var panel = this.toolbarContainer || this.grid;
        var tb = 'bottom' === this.position ? panel.bottomToolbar : panel.topToolbar;

        // add menu
        this.menu = new Ext.menu.Menu();

        // handle position
        if('right' === this.align) {
            tb.addFill();
        }
        else {
            if (tb.items.getCount() > 0) {
                tb.addSeparator();
            }
        }

        // add menu button
        tb.add({
             text: this.searchText
            ,menu: (this.disableFieldSelection === true ? undefined : this.menu)
            ,iconCls: this.iconCls
        });

        // add input field (TwinTriggerField in fact)
        this.field = new Ext.form.TwinTriggerField({
             width:this.width
            ,selectOnFocus:undefined === this.selectOnFocus ? true : this.selectOnFocus
            ,trigger1Class:'x-form-clear-trigger'
            ,trigger2Class:'x-form-search-trigger'
            ,onTrigger1Click:this.onTriggerClear.createDelegate(this)
            ,onTrigger2Click:this.onTriggerSearch.createDelegate(this)
            ,minLength:this.minLength
        });

        // install event handlers on input field
        this.field.on('render', function() {
            this.field.el.dom.qtip = this.searchTipText;

            // install key map
            var map = new Ext.KeyMap(this.field.el, [{
                 key:Ext.EventObject.ENTER
                ,scope:this
                ,fn:this.onTriggerSearch
            },{
                 key:Ext.EventObject.ESC
                ,scope:this
                ,fn:this.onTriggerClear
            }]);
            map.stopEvent = true;
        }, this, {single:true});

        tb.add(this.field);

        // reconfigure
        this.reconfigure();

        // keyMap
        if(this.shortcutKey && this.shortcutModifier) {
            var shortcutEl = this.grid.getEl();
            var shortcutCfg = [{
                 key:this.shortcutKey
                ,scope:this
                ,stopEvent:true
                ,fn:function() {
                    this.field.focus();
                }
            }];
            shortcutCfg[0][this.shortcutModifier] = true;
            this.keymap = new Ext.KeyMap(shortcutEl, shortcutCfg);
        }
    } // eo function onRender
    // }}}
    // {{{
    /**
     * private Clear Trigger click handler
     */
    ,onTriggerClear:function() {
        this.field.setValue('');
        this.field.focus();
        this.onTriggerSearch();
    } // eo function onTriggerClear
    // }}}
    // {{{

    /**
     * Returns the filtering function which will be used to filter the records in the store.
     */
    ,getFilterFn: function() {
        return function(r) {
            var retval = false;
            this.menu.items.each(function(item) {
                if(!item.checked || retval) {
                    return;
                }
                var rv = r.get(item.dataIndex);
                rv = rv instanceof Date ? rv.format(this.dateFormat || r.fields.get(item.dataIndex).dateFormat) : rv;
                var re = new RegExp(val, 'gi');
                retval = re.test(rv);
            }, this);
            if(retval) {
                return true;
            }
            return retval;
        };
    }

    /**
     * private Search Trigger click handler (executes the search, local or remote)
     */
    ,onTriggerSearch:function() {
        if(!this.field.isValid()) {
            return;
        }

        this.grid.fireEvent('filter', { plugins: this.grid.plugins, plugin: this, field: this.field });

        var val = this.field.getValue();
        var store = this.grid.store;

        // grid's store filter
        if ('local' === this.mode) {
            store.clearFilter();
            if (val) {
                store.filterBy(this.getFilterFn(), this);
            }
        }
        // ask server to filter records
        else {
            // clear start (necessary if we have paging)
            if (store.lastOptions && store.lastOptions.params) {
                store.lastOptions.params[store.paramNames.start] = 0;
            }

            // get fields to search array
            var fields = [];
            this.menu.items.each(function(item) {
                if (item.checked) {
                    fields.push(item.dataIndex);
                }
            });

            // add fields and query to baseParams of store
            delete(store.baseParams[this.paramNames.fields]);
            delete(store.baseParams[this.paramNames.query]);
            if (store.lastOptions && store.lastOptions.params) {
                delete(store.lastOptions.params[this.paramNames.fields]);
                delete(store.lastOptions.params[this.paramNames.query]);
            }
            if (fields.length) {
                store.baseParams[this.paramNames.fields] = Ext.encode(fields);
                store.baseParams[this.paramNames.query] = val;
            }

            // reload store
            store.reload();
        }

    } // eo function onTriggerSearch
    // }}}
    // {{{
    /**
     * @param {Boolean} true to disable search (TwinTriggerField), false to enable
     */
    ,setDisabled:function() {
        this.field.setDisabled.apply(this.field, arguments);
    } // eo function setDisabled
    // }}}
    // {{{
    /**
     * Enable search (TwinTriggerField)
     */
    ,enable:function() {
        this.setDisabled(false);
    } // eo function enable
    // }}}
    // {{{
    /**
     * Enable search (TwinTriggerField)
     */
    ,disable:function() {
        this.setDisabled(true);
    } // eo function disable
    // }}}
    // {{{
    /**
     * private (re)configures the plugin, creates menu items from column model
     */
    ,reconfigure:function() {

        // {{{
        // remove old items
        var menu = this.menu;
        menu.removeAll();

        // add Select All item plus separator
        if (this.showSelectAll) {
            menu.add(new Ext.menu.CheckItem({
                 text: this.selectAllText
                ,checked: !(this.checkIndexes instanceof Array)
                ,hideOnClick: false
                ,handler:function(item) {
                    var checked = !item.checked;
                    item.parentMenu.items.each(function(i) {
                        if (item !== i && i.setChecked) {
                            i.setChecked(checked);
                        }
                    });
                }
            }),'-');
        }

        // }}}
        // {{{
        // add new items
        var cm = this.grid.colModel;
        Ext.each(cm.config, function(config) {
            var disable = false;
            if (config.header && config.dataIndex) {
                Ext.each(this.disableIndexes, function(item) {
                    disable = disable ? disable : item === config.dataIndex;
                });
                if (!disable) {
                    menu.add(new Ext.menu.CheckItem({
                         text:config.header
                        ,hideOnClick:false
                        ,checked:'all' === this.checkIndexes
                        ,dataIndex:config.dataIndex
                    }));
                }
            }
        }, this);
        // }}}
        // {{{
        // check items
        if(this.checkIndexes instanceof Array) {
            Ext.each(this.checkIndexes, function(di) {
                var item = menu.items.find(function(itm) {
                    return itm.dataIndex === di;
                });
                if (item) {
                    item.setChecked(true, true);
                }
            }, this);
        }
        // }}}

    } // eo function reconfigure
    // }}}
});