/**
 * @class   Ext.ux.tree.TreeFilterX
 * @extends Ext.tree.TreeFilter
 *
 * <p>
 * Shows also parents of matching nodes as opposed to default TreeFilter. In other words
 * this filter works "deep way".
 * </p>
 *
 * @author   Ing. Jozef Sakáloš
 * @author	 Philipp Rosenhagen
 * @version  1.1
 * @date     21. January 2010
 * @see      <a href="http://extjs.com/forum/showthread.php?p=252709">http://extjs.com/forum/showthread.php?p=252709</a>
 *
 * @license Ext.ux.tree.CheckTreePanel is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 *
 * <p>License details: <a href="http://www.gnu.org/licenses/lgpl.html"
 * target="_blank">http://www.gnu.org/licenses/lgpl.html</a></p>
 *
 * @forum     55489
 * @demo      http://remotetree.extjs.eu
 *
 * @donate
 * <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
 * <input type="hidden" name="cmd" value="_s-xclick">
 * <input type="hidden" name="hosted_button_id" value="3430419">
 * <input type="image" src="https://www.paypal.com/en_US/i/btn/x-click-butcc-donate.gif"
 * border="0" name="submit" alt="PayPal - The safer, easier way to pay online.">
 * <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1">
 * </form>
 */

Ext.ns('Ext.ux.tree');

/**
 * Creates new TreeFilterX
 * @constructor
 * @param {Ext.tree.TreePanel} tree The tree panel to attach this filter to
 * @param {Object} config A config object of this filter
 */
Ext.ux.tree.TreeFilterX = Ext.extend(Ext.tree.TreeFilter, {
    /**
     * @cfg {Boolean} expandOnFilter Deeply expands startNode before filtering (defaults to true)
     */
     expandOnFilter: true

    /**
     * Filter the data by a specific attribute.
     *
     * @param {String/RegExp} value Either string that the attribute value
     * should start with or a RegExp to test against the attribute
     * @param {String} attr (optional) The attribute passed in your node's attributes collection. Defaults to "text".
     * @param {TreeNode} startNode (optional) The node to start the filter at.
     */
    ,filter: function(value, attr, startNode) {

        // expand start node
        if (false !== this.expandOnFilter) {
            startNode = startNode || this.tree.root;
            var animate = this.tree.animate;
            this.tree.animate = false;
            startNode.expand(true, false, function() {

                // call parent after expand
                this.filterOrg.call(this, value, attr, startNode);

            }.createDelegate(this));
            this.tree.animate = animate;
        } else {
            // call parent
            this.filterOrg.apply(this, arguments);
        }

        var regexp = value,
            nodeUI,
            nodeText = '';

        startNode.cascade(function(n) {
            if (!n.hidden && n.text) {
                //console.debug(n.text);
                nodeUI = n.ui;
                nodeText = Ext.stripTags(nodeUI.getTextEl().innerHTML);
                //Ext.isFirebug ? console.debug('nodeText is: '+nodeText) : '';

                nodeUI.getTextEl().innerHTML = nodeText.replace(regexp, '<span style="padding: 0; background-color: yellow;">$&</span>');
                //n.setText(nodeText.replace(regexp, '<span style="padding: 0; background-color: yellow;">$&</span>'));
                //console.debug(n.text);
            }
        });

    }, // eo function filter

    /**
     * Clears the current filter. Note: with the "remove" option
     * set a filter cannot be cleared.
     */
    clear: function() {
        var t = this.tree;
        var af = this.filtered;
        for (var id in af) {
            if (typeof id != "function") {
                var n = af[id];
                if (n) {
                    n.ui.show();
                }
            }
        }
        this.filtered = {};

        /*
         * Remove the highlighting tags from the node's text which
         * were added previously by the filter logic. We just strip the
         * HTML tags to accomplish this.
         */
        var rootNode = this.tree.root;

        rootNode.cascade(function(n) {
            if (!n.hidden && n.text && n.rendered) {
                nodeUI = n.ui;
                nodeUI.getTextEl().innerHTML = Ext.stripTags(nodeUI.getTextEl().innerHTML);
            }
        });
    },

    /**
     * Filter the data by a specific attribute.
     * @param {String/RegExp} value Either string that the attribute value
     * should start with or a RegExp to test against the attribute
     * @param {String} attr (optional) The attribute passed in your node's attributes collection. Defaults to "text".
     * @param {TreeNode} startNode (optional) The node to start the filter at.
     */
    filterOrg: function(value, attr, startNode) {
        attr = attr || "text";
        var f;
        if (typeof value == "string") {
            var vlen = value.length;
            // auto clear empty filter
            if(vlen == 0 && this.clearBlank){
                this.clear();
                return;
            }
            value = value.toLowerCase();
            f = function(n) {
                if (Ext.type(attr) == 'array') {
                    var ret = false;
                    Ext.each(attr, function(item, index, allItems) {
                        if (n.attributes[item].substr(0, vlen).toLowerCase() == value) {
                            ret = true;
                        }
                    });
                } else {
                    ret = n.attributes[attr].substr(0, vlen).toLowerCase() == value;
                }
                return ret;
            };
        } else if (value.exec) { // regex?
            f = function(n) {
                if (Ext.type(attr) == 'array') {
                    var ret = false;
                    Ext.each(attr, function(item, index, allItems) {
                        if (value.test(n.attributes[item])) {
                            ret = true;
                        }
                    });
                } else {
                    ret = value.test(n.attributes[attr]);
                }
                return ret;
            };
        } else {
            throw 'Illegal filter type, must be string or regex';
        }
        this.filterBy(f, null, startNode);
    },


    /**
     * Filter by a function. The passed function will be called with each
     * node in the tree (or from the startNode). If the function returns true, the node is kept
     * otherwise it is filtered. If a node is filtered, its children are also filtered.
     * Shows parents of matching nodes.
     *
     * @param {Function} fn The filter function.
     * @param {Object} scope (optional) The scope of the function (defaults to the current node).
     * @param {Object} startNode (optional) The node on which to start the filtering (defaults to the root node).
     * @param {Function} stopCascadeFn (optional) If this function returns true the cascading stops.
     */
    filterBy:function(fn, scope, startNode, stopCascadeFn) {
        startNode = startNode || this.tree.root;
        stopCascadeFn = stopCascadeFn || function() { return true };
        if(this.autoClear) {
            this.clear();
        }
        var af = this.filtered, rv = this.reverse;

        var f = function(n) {
            if(n === startNode) {
                return true;
            }
            if(af[n.id]) {
                return false;
            }
            var stopFn = stopCascadeFn.call(scope || n, n);

            var m = fn.call(scope || n, n);
            if(!m || rv) {
                af[n.id] = n;
                n.ui.hide();
                return stopFn;
            }
            else {
                n.ui.show();
                var p = n.parentNode;
                while(p && p !== this.root) {
                    p.ui.show();
                    p = p.parentNode;
                }
                return stopFn;
            }
            return stopFn;
        };
        startNode.cascade(f);

        if(this.remove){
           for(var id in af) {
               if(typeof id != "function") {
                   var n = af[id];
                   if(n && n.parentNode) {
                       n.parentNode.removeChild(n);
                   }
               }
           }
        }
    } // eo function filterBy

}); // eo extend