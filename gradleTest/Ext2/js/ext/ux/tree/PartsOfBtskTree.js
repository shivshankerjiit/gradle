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

Ext.ux.tree.PartsOfBtskTree = function (config) {
    Ext.ux.tree.PartsOfBtskTree.superclass.constructor.apply(this, arguments);
};

Ext.extend(Ext.ux.tree.PartsOfBtskTree, Ext.tree.ColumnTree, {
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
    cls: 'inBtsk', /* by default highlight the parts which are within the BTSK */

    i18n: {
        loading: 'Loading',
        search: 'Search',
        partsIn: 'Teile in'
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
            plugins: []
        });

        // call parent initComponent
        Ext.ux.tree.PartsOfBtskTree.superclass.initComponent.apply(this, arguments);
    },

    /**
     * Creates the tree loader and returns the instance.
     * @private
     */
    initTreeLoader: function() {

        var colNodeUI = Ext.extend(Ext.tree.ColumnNodeUI, {

            onOver : function(e){
                //this.addClass('x-tree-node-over');
            },

            onOut : function(e){
                //this.removeClass('x-tree-node-over');
            },

            renderElements: function(n, a, targetNode, bulkRender) {
                this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';

                var t = n.getOwnerTree();
                var cols = t.columns;
                var bw = t.borderWidth;
                var c = cols[0];

                var buf = [
                     '<li class="x-tree-node"><div ext:tree-node-id="',n.id,'" class="x-tree-node-el x-tree-node-leaf ', a.cls,'">',
                        '<div class="x-tree-col" style="width:',c.width-bw,'px;">',
                            '<span class="x-tree-node-indent">',this.indentMarkup,"</span>",
                            '<img src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow">',
                            '<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon',(a.icon ? " x-tree-node-inline-icon" : ""),(a.iconCls ? " "+a.iconCls : ""),'" unselectable="on">',
                            '<a hidefocus="on" class="x-tree-node-anchor ',c.getCellCls ? c.getCellCls(a) : '','" href="',a.href ? a.href : "#",'" tabIndex="1" ',
                            a.hrefTarget ? ' target="'+a.hrefTarget+'"' : "", '>',
                            '<span unselectable="on">', (c.renderer ? c.renderer(a[c.dataIndex], n, a) : n.text || a[c.dataIndex]),"</span></a>",
                        "</div>"];

                for(var i = 1, len = cols.length; i < len; i++){
                     c = cols[i];

                     buf.push('<div class="x-tree-col ',(c.cls ? c.cls : ''),'" style="width:',c.width-bw,'px;">',
                                '<div class="x-tree-col-text">',(c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex]),"</div>",
                              "</div>");
                }
                buf.push(
                    '<div class="x-clear"></div></div>',
                    '<ul class="x-tree-node-ct" style="display:none;"></ul>',
                    "</li>");

                if(bulkRender !== true && n.nextSibling && n.nextSibling.ui.getEl()){
                    this.wrap = Ext.DomHelper.insertHtml("beforeBegin",
                                        n.nextSibling.ui.getEl(), buf.join(""));
                }else{
                    this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf.join(""));
                }

                this.elNode = this.wrap.childNodes[0];
                //this.elNode = this.wrap.childNodes[0].children[1];
                this.ctNode = this.wrap.childNodes[1];
                var cs = this.elNode.firstChild.childNodes;
                //var cs = this.elNode.childNodes[1].childNodes;
                this.indentNode = cs[0];
                this.ecNode = cs[1];
                this.iconNode = cs[2];
                this.anchor = cs[3];
                this.textNode = cs[3].firstChild;
            }
        });

        return new Ext.tree.TreeLoader({
            preloadChildren: true,
            baseAttrs: {
                uiProvider: 'viewcol',
                disabled: this.mode === 'edit' ? false : true
            },
            uiProviders: {
                'viewcol': colNodeUI
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

                    //Ext.getCmp('filter') ? Ext.getCmp('filter').onTriggerClick() : '';
                },
                scope: this
            }
        });
    },

    initToolbar: function() {
        var tFilter = this.filter;

        return new Ext.Toolbar({
            items: [/* {
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
            },*/ {
                xtype: 'tbtext',
                cls: 'paddingToolbar',
                text: this.i18n.partsIn + ': '
            }, {
                xtype: 'radio',
                id: 'filteringTypeBtk',
                name: 'filteringType',
                boxLabel: 'Bauteilkomponente',
                listeners: {
                    check: function(cmp, checked) {
                        Ext.isFirebug ? console.debug('checked BTK is: '+checked) : '';
                        if (checked) {
                            this.removeClass('inBtsk');
                            this.addClass('inBtk');
                        } else {
                            this.removeClass('inBtk');
                            this.addClass('inBtsk');
                        }
                    },
                    scope: this
                }
            }, {
                xtype: 'tbspacer'
            }, {
                xtype: 'tbspacer'
            }, {
                xtype: 'tbspacer'
            }, {
                xtype: 'radio',
                id: 'filteringTypeBtsk',
                name: 'filteringType',
                boxLabel: 'Bauteilsubkomponente',
                checked: true,
                listeners: {
                    check: function(cmp, checked) {
                        Ext.isFirebug ? console.debug('checked BTSK is: '+checked) : '';
                        if (checked) {
                            this.removeClass('inBtk');
                            this.addClass('inBtsk');
                        } else {
                            this.removeClass('inBtsk');
                            this.addClass('inBtk');
                        }
                    },
                    scope: this
                }
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'tbbutton',
                id: 'expandBtn',
                cls: 'x-btn-icon',
                icon: 'images/symbols/expand-all.gif',
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
                icon: 'images/symbols/collapse-all.gif',
                width: 16,
                tooltip: this.i18n.collapseAll,
                handler: function(btn) {
                    this.getRootNode().collapse(true);
                },
                scope: this,
                hidden: false
            }]
        });
    }
});

Ext.reg('partsofbtsktree', Ext.ux.tree.PartsOfBtskTree);