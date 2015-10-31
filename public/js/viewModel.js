function viewModel() {
  // Title
  var self = this;
  self.title = ko.observable("");

  Sammy(function() {
    // Set page title if need
    this.get('#:hash', function() {
      var pageTitle = {
        "main": "Main page"
      };

      if (pageTitle[this.params.hash]) self.title(pageTitle[this.params.hash]);
    });

    // Main page is main page
    this.get('', function() { this.app.runRoute('get', '#main') });
  }).run();
};

ko.applyBindings(new viewModel(), document.getElementById("htmlTop"));
