/*
 *    Class:        Ext.ux.AKFilterPanel
 *    Inherits:     Ext.form.FormPanel
 *    Depends on:   -
 *    Author:       Philipp Rosenhagen
 *    Date:         2009-12-11
 *    Site:         -
 */

// Create user extensions namespace (Ext.ux.tree)
Ext.namespace('Ext.ux.tree');

Ext.override(Ext.tree.TreeNodeUI, {
    getChecked: function() {
        return this.node.attributes.checked;
    },

    toggleCheck: function(value) {
        var cb = this.checkbox;
        if (cb) {
            cb.checked = (value === undefined ? !cb.checked : value);
            this.node.attributes.checked = cb.checked; // sync the new value with the attribute on the node itself!
        }
    }
});

Ext.ux.tree.CustomTreeNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
    nodeTemplate: ['<li class="x-tree-node"><div ext:tree-node-id="{id}" class="x-tree-node-el x-tree-node-leaf x-unselectable {cls}" unselectable="on">',
                '<span class="x-tree-node-indent">{indentMarkup}</span>',
                '<img src="{emptyIcon}" class="x-tree-ec-icon x-tree-elbow" />',
                '<img src="<tpl:if="!Ext.isEmpty(icon)">{icon}</tpl><tpl:if="Ext.isEmpty(icon)">{emptyIcon}</tpl>" class="x-tree-node-icon<tpl:if="!Ext.isEmpty(icon)"> x-tree-node-inline-icon</tpl><tpl:if="!Ext.isEmpty(iconCls)"> {iconCls}</tpl>" unselectable="on" />',
                '<tpl:if="cb"><input class="x-tree-node-cb" type="checkbox" {checked}/></tpl>',
                '<a hidefocus="on" class="x-tree-node-anchor" href="{href}" tabIndex="1" ',
                '<tpl:if="hrefTarget"> target="{hrefTarget}"</tpl>><span unselectable="on">{id} | {text}</span></a></div>',
                '<ul class="x-tree-node-ct" style="display:none;"></ul>',
                "</li>"].join(''),
    // private
    renderElements: function(n, a, targetNode, bulkRender) {
        // add some indent caching, this helps performance when rendering a large tree
        this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';

        var cb = typeof a.checked == 'boolean';

        var href = a.href ? a.href : Ext.isGecko ? "" : "#";

        var buf = '';

        this.nodeTemplat1e = ['<li class="x-tree-node"><div ext:tree-node-id="{id}" class="x-tree-node-el x-tree-node-leaf x-unselectable {cls}" unselectable="on">',
                '<span class="x-tree-node-indent">{indentMarkup}</span>',
                '<img src="{emptyIcon}" class="x-tree-ec-icon x-tree-elbow" />',
                '<img src="{emptyIcon}" class="x-tree-node-icon" unselectable="on" />',
                '<input class="x-tree-node-cb" type="checkbox" <tpl:if="checked">checked="checked" </tpl>/>',
                '<a hidefocus="on" class="x-tree-node-anchor" href="{href}" tabIndex="1" ',
                '<tpl:if="hrefTarget"> target="{hrefTarget}"</tpl>><span unselectable="on">[]{text}</span></a></div>',
                '<ul class="x-tree-node-ct" style="display:none;"></ul>',
                "</li>"].join('');

        if (this.nodeTemplate) {
            var tpl = Ext.type(this.nodeTemplate) === 'object' ? this.nodeTemplate : new Ext.XTemplate(this.nodeTemplate);
            var data = {};

            data.id = n.id;
            data.text = n.text;

            data.cls = a.cls;
            data.icon = a.icon;
            data.iconCls = a.iconCls; //a.iconCls || this.emptyIcon;

            data.checked = a.checked ? 'checked="checked"' : '';
            data.hrefTarget = a.hrefTarget;

            data.href = href;
            data.cb = cb;
            data.indentMarkup = this.indentMarkup;
            data.emptyIcon = this.emptyIcon;
            var ddd = {bla: data};

            //buf = tpl.apply(data);
            buf = tpl.apply(data);
       } else {
            buf = ['<li class="x-tree-node"><div ext:tree-node-id="',n.id,'" class="x-tree-node-el x-tree-node-leaf x-unselectable ', a.cls,'" unselectable="on">',
                '<span class="x-tree-node-indent">',this.indentMarkup,"</span>",
                '<img src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow" />',
                '<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon',(a.icon ? " x-tree-node-inline-icon" : ""),(a.iconCls ? " "+a.iconCls : ""),'" unselectable="on" />',
                cb ? ('<input class="x-tree-node-cb" type="checkbox" ' + (a.checked ? 'checked="checked" />' : '/>')) : '',
                '<a hidefocus="on" class="x-tree-node-anchor" href="',href,'" tabIndex="1" ',
                 a.hrefTarget ? ' target="'+a.hrefTarget+'"' : "", '><span unselectable="on">',n.id + ' | ' + n.text,"</span></a></div>",
                '<ul class="x-tree-node-ct" style="display:none;"></ul>',
                "</li>"].join('');
        }

        var nel;
        if (bulkRender !== true && n.nextSibling && (nel = n.nextSibling.ui.getEl())) {
            this.wrap = Ext.DomHelper.insertHtml("beforeBegin", nel, buf);
        } else {
            this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf);
        }

        this.elNode = this.wrap.childNodes[0];
        this.ctNode = this.wrap.childNodes[1];
        var cs = this.elNode.childNodes;
        this.indentNode = cs[0];
        this.ecNode = cs[1];
        this.iconNode = cs[2];
        var index = 3;
        if (cb) {
            this.checkbox = cs[3];
            index++;
        }
        this.anchor = cs[index];
        this.textNode = cs[index].firstChild;
    }
});
Ext.override(Ext.tree.TreePanel, {
    getChecked: function(a, startNode) {
        startNode = startNode || this.root;
        var r = [];
        var f = function() {
            if (this.ui.getChecked()) {
                r.push(!a ? this : (a === 'id' ? this.id : this.attributes[a]));
            }
        };
        startNode.cascade(f);
        return r;
    }
});
Ext.reg('customtreenodeui', Ext.ux.tree.CustomTreeNodeUI);