ko.applyBindings(new function () {
  var self = this;

  // Title
  self.title = ko.observable();
  // Chosed page
  self.page = ko.observable();
  // Employee list
  self.employees = ko.observableArray(/*[
    new Employee("Foo", "Foo", "Foo", "Murderer", 44),
    new Employee("Bar", "Bar", "Bar", "Victim", 22)
  ]*/);

  Sammy(function() {
    // Set page title if need
    this.get('#:hash', function() {
      var pageTitle = {
        "main": "Главная страница",
        "employees": "Список сотрудников"
      };

      if (pageTitle[this.params.hash]) {
        self.title(pageTitle[this.params.hash]);
        self.page(this.params.hash);
      }
    });

    // Main page is main page
    this.get('', function() { this.app.runRoute('get', '#main') });

    this.get('#employees', function() {
    });
  }).run();
}, document.getElementById("htmlTop")); // For title changing
