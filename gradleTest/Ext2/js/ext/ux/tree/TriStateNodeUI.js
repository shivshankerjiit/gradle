Ext.tree.TriStateNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
    onClick : function(e) {
        var remDisabledState = this.disabled;
        this.disabled = false;
        Ext.tree.TriStateNodeUI.superclass.onClick.apply(this, arguments);
        this.disabled = remDisabledState;
    },
    onCheckChange :function(){
        Ext.tree.TriStateNodeUI.superclass.onCheckChange.apply(this, arguments);
        var p = this.node;
        while((p = p.parentNode) && p.getUI().updateParent && p.getUI().checkbox && !p.getUI().isUpdating) {
            p.getUI().updateParent();
        }
    },
    toggleCheck :function(){
        var checked = Ext.tree.TriStateNodeUI.superclass.toggleCheck.apply(this, arguments);
        if (!this.node.isExpanded() && this.node.ctNode) {
            this.node.expand(false);
        }
        return checked;
    },
    renderElements :function(n, a, targetNode, bulkRender){
        Ext.tree.TriStateNodeUI.superclass.renderElements.apply(this, arguments);
        this.updateChild(this.node.attributes.checked);
    },
    updateParent :function(){
        var checked;
        if (this.node.attributes.checked) {
            return false;
        } else {
            this.node.eachChild(function(n) {
                if (n.attributes.checked === undefined || n.attributes.checked === this.grayedValue || n.attributes.checked) {
                    checked = null;
                    return false;
                } else {
                    checked = false;
                }
            }, this);
        }
        this.toggleCheck(checked);
    },
    updateChild:function(checked){
        if(typeof checked == 'boolean'){
            this.isUpdating = true;
            this.node.eachChild(function(n){
                n.getUI().toggleCheck(checked);
            }, this);
            delete this.isUpdating;
        }
    }
});
Ext.tree.AsynchTriStateNodeUI = Ext.extend(Ext.tree.TriStateNodeUI, {
    updateChild:function(checked){
        if(this.checkbox){
            if(checked === true){
                Ext.fly(this.ctNode).replaceClass('x-tree-branch-unchecked', 'x-tree-branch-checked');
            } else if(checked === false){
                Ext.fly(this.ctNode).replaceClass('x-tree-branch-checked', 'x-tree-branch-unchecked');
            } else {
                Ext.fly(this.ctNode).removeClass(['x-tree-branch-checked', 'x-tree-branch-unchecked']);
            }
        }
        Ext.tree.AsynchTriStateNodeUI.superclass.updateChild.apply(this, arguments);
    },
    getChecked: function(tstFlag) {
        var checked = '';
        //if (this.node.parentNode.isRoot && !this.node.parentNode.rendered) {
        //}
        if (!tstFlag) {
            checked = this.node.parentNode ? this.node.parentNode.ui.getChecked() : this.grayedValue;
        }
        return typeof checked == 'boolean' ? checked : Ext.tree.TriStateNodeUI.superclass.getChecked.call(this);
    }
});