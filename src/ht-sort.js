/**
 * Handsontable sort plugin.
 * depend on Handsontable
 */
/*global htSort: true*/
var htSort = (function() {
    'use strict';
    var sort = {};

    // register sortOrderChanged callback option.
    Handsontable.hooks.register('afterSortOrderChanged');

    /**
     * Set custom sort setting.
     * @param {Handsontable} hTable
     * @param {Array} excludeSortColumns
     */
    sort.SetSortSetting = function(hTable, excludeSortColumns) {
        hTable.updateSettings({
            columnSorting: false,
            sortIndicator: false,
            excludeSortColumns: excludeSortColumns,
            beforeOnCellMouseDown: onBeforeOnCellMouseDown,
            afterGetColHeader: onAfterGetColHeader
        });
        // add function for get the sort state.
        hTable.getSortState = getSortState;
    };

    /**
     * Return the sort state informations.
     * @return {Object}
     */
    function getSortState() {
        var columns = this.getSettings().columns;
        var col = this.sortColumn;
        var prop = void 0;
        if (col >= 0) {
            prop = columns[col].data;
        }
        return {
            col: col,
            prop: prop,
            order: this.sortOrder
        };
    }

    /**
     * Event of cell mouseDown.
     * @param  {Event} event
     * @param  {Object} coords
     */
    function onBeforeOnCellMouseDown(event, coords) {
        var row = coords.row;
        if (row < 0) {
            // stop header click default event.
            event.stopImmediatePropagation();
        }
    }

    /**
     * Event of the after get column header.
     * @param  {Number} col
     * @param  {Element} th
     */
    function onAfterGetColHeader(col, th) {
        var _this = this;
        // sort click target.
        var target = th.children[0].children[0];
        var classList = target.classList;
        // if sortable column, add style and eventListener.
        var excludeSortColumns = this.getSettings().excludeSortColumns;
        var isExclude = false;
        if (excludeSortColumns instanceof Array) {
            // Array
            var colHeader = this.getColHeader(col);
            for (var i = 0; i < excludeSortColumns.length; i++) {
                var exclude = excludeSortColumns[i];
                if (isNaN(exclude)) {
                    // column name
                    if (exclude === colHeader) {
                        isExclude = true;
                        break;
                    }
                } else {
                    /// column index.
                    if (exclude === col) {
                        isExclude = true;
                        break;
                    }
                }
            }
        } else if (isNaN(excludeSortColumns) === false) {
            // Number
            if (col > excludeSortColumns) isExclude = true;
        }
        if (isExclude === false && classList.contains('columnSorting') === false) {
            classList.add('columnSorting');
            target.addEventListener('click', function(event) {
                    onHeaderClick(event, _this, col);
                }, false);
        }
        classList.remove('ascending');
        classList.remove('descending');

        if (col === this.sortColumn) {
            var sortOrder = this.sortOrder;
            if (sortOrder === true) {
                classList.add('ascending');
            }
            if (sortOrder === false) {
                classList.add('descending');
            }
        }

    }

    /**
     * Event of the header click.
     * @param  {Event} event
     * @param  {Handsontable} hTable
     * @param  {Number} columnIndex
     */
    function onHeaderClick(event, hTable, columnIndex) {
        if (hTable.sortColumn !== columnIndex) {
            hTable.sortOrder = void 0;
        }
        hTable.sortColumn = columnIndex;
        var sortOrder = hTable.sortOrder;
        if (sortOrder === true) {
            // -> descending
            hTable.sortOrder = false;
        } else if (sortOrder === false) {
            // -> none.
            hTable.sortOrder = void 0;
        } else {
            // -> ascending
             hTable.sortOrder = true;
        }
        hTable.render();
        Handsontable.hooks.run(hTable, 'afterSortOrderChanged', columnIndex, hTable.sortOrder);
    }

    return sort;
}());