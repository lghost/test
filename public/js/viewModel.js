ko.applyBindings(new function () {
  var self = this;

  // Title
  self.title = ko.observable();
  // Chosed page
  self.page = ko.observable();
  // Chosed item id
  self.item = ko.observable();
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
  }

  self.getPosts = function() {
    $.getJSON('/api/posts', self.posts);
  }

  self.router = Sammy(function() {
    this.get('#main', function() {
      self.title('Главная страница');
      self.page('main');
    });

    this.get('#employees', function() {
      self.title('Список сотрудников');
      self.page('employees');
      self.getEmployees();
    });

    this.get('#posts', function() {
      self.title('Список должностей');
      self.page('posts');
      self.getPosts();
    });

    // Main page is main page
    this.get('', function() { this.app.runRoute('get', '#main') });
  })

  self.router.run();

  self.update = function () {
    self.router.runRoute('get', '#' + self.page());
  };

  /*self.add = function () {
    app.runRoute('get', '#' + self.page() + '/add');
  };
  self.remove = function () {
    app.runRoute('get', '#' + self.page() + '/remove/' + self.item());
  };*/
}, document.getElementById('htmlTop')); // For title changing
