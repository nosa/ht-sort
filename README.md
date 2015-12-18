# ht-sort

ht-sort is a [Handsomtable](http://handsontable.com/) plugin for the **serverside** sort.

## Features
* Disabled Handsomtable default sort behavior.
* Clicked header, you can define callback.
* Same sort styles Handsomtable.(descending, ascending, none)

## Usage
html
```html
<script src="handsontable.full.min.js"></script>
<script src="ht-sort.js"></script>
```

Javascript
```javascript
var container = document.getElementById('table');
// table create.
var settings = {
    // callback, when user clicked column header.
    afterSortOrderChanged: search
};
var table = new Handsontable(container, settings);
// table: Handsontable, [0, 1]: Array of exclude sort column index.
htSort.SetSortSetting(table, [0, 1]);
table.loadData();

//////////////////////////////
function search() {
    // get the sort states.
    var sortState = table.getSortState();
    var sortQuery = {
        sortName: sortState.prop,
        sortOrder: sortState.order
    };
    // 
    fetch...
}
```
## Handsomtable Version
"handsontable": "~0.17.0"

## Licence
MIT