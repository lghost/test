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
  // Chosen list view model
  self.listViewModel = ko.observable();
  // Employee list
  self.employees = ko.observableArray();
  // Post list
  self.posts = ko.observableArray();

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

  /*self.add = function () {
    app.runRoute('get', '#' + self.page() + '/add');
  };
  self.remove = function () {
    app.runRoute('get', '#' + self.page() + '/remove/' + self.item());
  };*/

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

      self.listViewModel(new ko.simpleGrid.viewModel({
        data: self.employees,
        columns: [
          { headerText: 'ФИО', rowText: 'formattedName' },
          { headerText: 'Должность', rowText: 'post' },
          { headerText: 'Возраст', rowText: 'age' }
        ],
        pageSize: 10
      }));
    });

    this.get('#posts', function() {
      self.title('Список должностей');
      self.page('posts');
      self.update(self.getPosts);
      self.getPosts();

      self.listViewModel(new ko.simpleGrid.viewModel({
        data: self.posts,
        columns: [
          { headerText: 'Название', rowText: 'value' }
        ],
        pageSize: 10
      }));
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
