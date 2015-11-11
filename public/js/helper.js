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

// Returns element by id
ko.observableArray.fn.getById = function(id) {
  return this().filter(function(element) {
    return element.id == id;
  })[0];
};

// Knockout Validation default parameters (bootstrap visualization)
ko.validation.init({
  errorElementClass: 'has-error',
  errorMessageClass: 'help-block',
  decorateInputElement: true
});

// Simple jQuery spinner initializer
ko.bindingHandlers.jqSpinner = {
  init: function(element, valueAccessor) {
    var value = valueAccessor();
    if (!ko.isObservable(value)) return;

    if (!value()) value(0);
    $(element).val(value());
    $(element).parent().spinner('changing', function(e, newVal, oldVal) {
      value(newVal);
    });
  }
};
