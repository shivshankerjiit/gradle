/**
 * This custom widget requires ExtJS 2.0.2 and the latest corresponding ext-overrides.js.
 *
 * @requires Ext.ux.data.CalcRecord The file for this grid plugin is located under Ext/ux/data/CalcRecord.js.
 * @requires Ext.ux.plugins.GridMouseEvents The file for this grid plugin is located under Ext/ux/plugins/GridMouseEvents.js.
 * @author prosenh
 * @version 1.0.0
 */

// Create user extensions namespace
Ext.ns('Ext.ux.tree');

Ext.ux.tree.BtkBtskTree = function (config) {
    Ext.ux.tree.BtkBtskTree.superclass.constructor.apply(this, arguments);
};

Ext.extend(Ext.ux.tree.BtkBtskTree, Ext.tree.ColumnTree, {
    header: false,
    width: 280,
    region: 'west',
    split: true,
    resizeable: true,
    useArrows: true,
    autoScroll: true,
    animate: true,
    containerScroll: true,
    rootVisible: false,
    frame: false,
    lines: true,
    bodyStyle: 'background-color: white',

    i18n: {
        loading: 'Loading',
        search: 'Search'
    },

    initComponent: function() {

        Ext.applyIf(this, { dataConfig: {} });

        this.treeRootNode = new Ext.tree.TreeNode({
            nodeType: 'async'
        });

        this.treeLoader = this.initTreeLoader();

        this.filter = new Ext.ux.tree.TreeFilterX(this);

        var topToolbar = this.initToolbar();

        // apply some custom configuration for our component
        Ext.applyIf(this, {
            id: Ext.id(false, 'btkbtsk-tree-'),
            tbar: topToolbar,
            root: this.treeRootNode,
            rootVisible: false,
            plugins: []
        });

        // call parent initComponent
        Ext.ux.tree.BtkBtskTree.superclass.initComponent.apply(this, arguments);

        // initially expand the first BTK and select its very first BTSK node
        this.initialSelect = false;
        this.on('expandnode', this.onExpandNode, this);
    },

    onExpandNode: function(node) {
        if (!this.initialSelect && node.firstChild && node.firstChild.isLeaf()) {
            node.firstChild.fireEvent('click', node.firstChild);
            this.initialSelect = true;
        }
    },

    /**
     * Creates the tree loader and returns the instance.
     * @private
     */
    initTreeLoader: function() {
        return new Ext.tree.TreeLoader({
            preloadChildren: true,
            baseAttrs: {
                uiProvider: 'viewcol',
                disabled: this.mode === 'edit' ? false : true
            },
            uiProviders: {
                'viewcol': Ext.tree.ColumnNodeUI
            },
            dataUrl: this.dataConfig.url,
            listeners: {
                beforeload: function(cmp, node, callback) {
                    Ext.isFirebug ? console.debug('beforeload event treeloader') : '';

                    Ext.Ajax.disableCaching = true;
                    this.getEl().mask('<div class="loading-indicator">' + this.i18n.loading + '</div>', 'profile-settings-loading-mask');
                },
                load: function(cmp, node, response) {
                    Ext.isFirebug ? console.debug('load event treeloader') : '';

                    Ext.Ajax.disableCaching = false;

                    this.getEl().unmask();

                    Ext.getCmp('filter') ? Ext.getCmp('filter').onTriggerClick() : '';

                    var rootNode = this.getRootNode();

                    rootNode.expandChildNodes(false);
                },
                scope: this
            },
            timeout: 60000
        });
    },

    initToolbar: function() {
        var tFilter = this.filter;

        return new Ext.Toolbar({
            items: [ {
                xtype: 'tbtext',
                text: this.i18n.search + ': '
            }, {
                xtype: 'trigger',
                triggerClass: 'x-form-clear-trigger',
                triggerConfig: {
                    tag: 'span', cls: 'x-form-clear-trigger', cn: [
                        {tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger x-form-clear-trigger", qtip: this.i18n.reset}
                    ]
                },
                onTriggerClick: function() {
                    this.setValue('');
                    tFilter.clear();
                },
                id: 'filter',
                enableKeyEvents: true,
                listenToKeys: true,
                listeners: {
                    keyup: { buffer: 150, fn: function(field, e) {
                            if (Ext.EventObject.ESC == e.getKey()) {
                                field.onTriggerClick();
                            } else if (!e.isSpecialKey()) {
                                var val = this.getRawValue();
                                var re = new RegExp(val, 'ig');
                                tFilter.clear();
                                tFilter.filter(re, ['text', 'id']);
                            }
                        }
                    }
                }
            }/*, {
                xtype: 'tbfill'
            }, {
                xtype: 'tbbutton',
                id: 'expandBtn',
                cls: 'x-btn-icon',
                iconCls: 'expand-all-btn',
                width: 16,
                tooltip: this.i18n.expandAll,
                handler: function(btn) {
                    this.getRootNode().expand(true);
                },
                scope: this,
                hidden: false
            }, {
                xtype: 'tbbutton',
                id: 'collapseBtn',
                cls: 'x-btn-icon',
                iconCls: 'collapse-all-btn',
                width: 16,
                tooltip: this.i18n.collapseAll,
                handler: function(btn) {
                    this.getRootNode().collapse(true);
                },
                scope: this,
                hidden: false
            }*/]
        });
    }
});

Ext.reg('btkbtsktree', Ext.ux.tree.BtkBtskTree);



Ext.tree.TreeLoader.override({
    requestData : function(node, callback){
        if(this.fireEvent("beforeload", this, node, callback) !== false){
            this.transId = Ext.Ajax.request({
                method:this.requestMethod,
                url: this.dataUrl||this.url,
                success: this.handleResponse,
                failure: this.handleFailure,
                timeout: this.timeout || 30000,
                scope: this,
                argument: {callback: callback, node: node},
                params: this.getParams(node)
            });
        }else{
            // if the load is cancelled, make sure we notify
            // the node that we are done
            if(typeof callback == "function"){
                callback();
            }
        }
    }
});