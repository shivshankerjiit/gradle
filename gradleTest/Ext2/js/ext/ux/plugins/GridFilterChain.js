Ext.ns('Ext.ux.plugins');

/**
 * @class Ext.ux.plugins.GridFilterChain
 * @extends Ext.util.Observable
 * @param {Object} config configuration object
 * @constructor
 */
Ext.ux.plugins.GridFilterChain = function(config) {
    Ext.apply(this, config);
    Ext.ux.plugins.GridFilterChain.superclass.constructor.call(this);
}; // eo constructor

Ext.extend(Ext.ux.plugins.GridFilterChain, Ext.util.Observable, {

    /**
     * private
     * @param {Ext.grid.GridPanel/Ext.grid.EditorGrid} grid reference to grid this plugin is used for
     */
    init: function(grid) {
        this.grid = grid;

        Ext.applyIf(this.grid, {

            /**
             * @param record the record to evaluate
             */
            chainedFilterFn: function(record) {
                var chainedRetValue = true;
                Ext.each(this.plugins, function(item, index, allItems) {
                    if (item.getFilterFn && item.chained) {
                        chainedRetValue = chainedRetValue && item.getFilterFn().apply(item, [ record ]);
                    }
                });
                return chainedRetValue;
            }

        });
    }
});