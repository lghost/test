ko.applyBindings(new function () {
  var self = this;

  // Title
  self.title = ko.observable();
  // Chosed page
  self.page = ko.observable();
  // Chosed item id
  self.item = ko.observable();
  // Update function
  self.update = ko.observable();
  // Employee list
  self.employees = ko.observableArray();
  // Post list
  self.posts = ko.observableArray();

  self.employeeGridModel = new ko.simpleGrid.viewModel({
    data: self.employees,
    columns: [
      { headerText: 'ФИО', rowText: 'formattedName' },
      { headerText: 'Должность', rowText: 'post' },
      { headerText: 'Возраст', rowText: 'age' }
    ],
    pageSize: 10
  });

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

  self.getEmployees = function() {
    $.getJSON('/api/employees', function (data) {
      self.employees($.map(data, function (item) {
        return new Employee(item);
      }));
    });
  };

  self.getPosts = function() {
    $.getJSON('/api/posts', self.posts);
  };

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

    this.get('#employees/add', function() {

    });

    this.get('#posts/add', function() {

    });

    this.get('#employees/edit', function() {

    });

    this.get('#posts/edit', function() {

    });

    this.get('#employees/remove', function() {

    });

    this.get('#posts/remove', function() {

    });

    // Main page is main page
    this.get('', function() { this.app.runRoute('get', '#main') });
  })

  self.router.run();

}, document.getElementById('htmlTop')); // For title changing
