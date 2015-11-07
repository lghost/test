// Simple parametric sorter for simpleGrid template
ko.observableArray.fn.sortByRowText = function() {
  if (this.sortParams) { // defines below
    var sortParams = this.sortParams();

    this.sort(function(left, right) {
      // rowText function handler, just like in the original simpleGrid template
      if (typeof sortParams.field == 'function') {
        left = sortParams.field(left);
        right = sortParams.field(right);
      } else {
        left = left[sortParams.field];
        right = right[sortParams.field];
      }
      // If field is ko.computed - compute it
      if (typeof left == 'function') left = left();
      if (typeof right == 'function') right = right();

      // Sorting basic rule
      return left == right ? 0 : (sortParams.desc ? -1 : 1)*(left > right ? 1 : -1);
    });
  }
};
