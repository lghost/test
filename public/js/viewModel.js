ko.applyBindings(new function () {
  var self = this;

  // Title
  self.title = ko.observable();
  // Chosed page
  self.page = ko.observable();

  // Employee list
  self.employees = ko.observableArray();
  // Post list
  self.posts = ko.observableArray();

  // Chosed item in list
  self.selected = ko.observable();
  // So... This is intermodel intagrating (for simpleGrid view template)
  self.employees.selected = self.selected;
  self.posts.selected = self.selected;

  // Sorting parameters
  self.employees.sortParams = ko.observable({ field: 'formattedName'/* , desc: false */ });
  self.posts.sortParams = ko.observable({ field: 'value' });

  // Employee list view model
  self.employeeGridModel = new ko.simpleGrid.viewModel({
    // simpleGrid basic parameters
    data: self.employees,
    columns: [
      { headerText: 'ФИО', rowText: 'formattedName' },
      { headerText: 'Должность', rowText: 'post' },
      { headerText: 'Возраст', rowText: 'age' }
    ],
    pageSize: 10
  });
  // Post list view model
  self.postGridModel = new ko.simpleGrid.viewModel({
    data: self.posts,
    columns: [
      { headerText: 'Название', rowText: 'value' }
    ],
    pageSize: 10
  });
  // List view model depending on chosen view 
  // (not undefined due to some errors when app initialized)
  self.listViewModel = ko.observable(self.employeeGridModel);

  // These functions get data from server via AJAX
  self.getEmployees = function() {
    $.getJSON('/api/employees', function (data) { // Get array of every employee parameters
      self.employees($.map(data, function (item) { // Update self.employees by array of Employee objects
        return new Employee(item);
      }));
      self.employees.sortByRowText(); // Initial sort
    });
  };
  self.getPosts = function() {
    $.getJSON('/api/posts', function(data) {
      self.posts(data);
      self.posts.sortByRowText();
    });
  };
  // Update function
  self.update = ko.observable();
  self.remove = ko.observable();

  // Sammy router initialize
  self.router = Sammy(function() {
    this.get('#main', function() {
      self.title('Главная страница');
      self.page('main');
    });

    this.get('#employees', function() {
      self.title('Список сотрудников');
      self.page('employees');
      self.update(self.getEmployees);
      self.getEmployees();
      self.listViewModel(self.employeeGridModel);
    });

    this.get('#posts', function() {
      self.title('Список должностей');
      self.page('posts');
      self.update(self.getPosts);
      self.getPosts();
      self.listViewModel(self.postGridModel);
    });

    this.get('#:page/add', function() {
      if (self.page() != this.params.page)
        this.app.runRoute('get', '#' + this.params.page);
    });

    this.get('#:page/edit', function() {
      if (self.page() != this.params.page)
        this.app.runRoute('get', '#' + this.params.page);
    });

    // Main page is main page
    this.get('', function() { this.app.runRoute('get', '#main') });
  })

  self.router.run();
}, document.getElementById('htmlTop')); // For title changing
