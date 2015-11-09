ko.applyBindings(new function () {
  var self = this;

  // Title
  self.title = ko.observable();
  // Page architecture
  self.page = {
    pageName: ko.observable(),
    content: ko.observable(),
    // List controls
    controls: ko.observable(),
    // List view model (simpleGrid VM)
    viewModel: ko.observable(),
    // Chosed item in list
    selected: ko.observable()
  };
  // Action architecture
  self.action = {

  };

  // Data lists
  self.lists = {
    // Employee list
    employees: ko.observableArray(),
    // Post list
    posts: ko.observableArray()
  };

  // So... This is intermodel intagrating (for simpleGrid view template)
  // Selected item in list (linked to main view model)
  for (var list in self.lists) self.lists[list].selected = self.page.selected;
  // Sorting parameters. You can specify default sorting field and direction for every list
  self.lists.employees.sortParams = ko.observable({ field: 'formattedName'/* , desc: false */ });
  self.lists.posts.sortParams = ko.observable({ field: 'value' });

  // Page parameters
  self.pages = {
    // Simple page
    'main': {
      title: 'Главная страница',
      content: 'Добро пожаловать!'
    },

    // Page with list
    'employees': {
      title: 'Список сотрудников',
      // List control functions
      controls: {
        // Update function gets data from server via AJAX
        update: function() {
          $.getJSON('/api/employees', function (data) { // Get array of every employee parameters
            self.lists.employees($.map(data, function (item) { // Update self.employees by array of Employee objects
              return new Employee(item);
            }));
            self.lists.employees.sortByRowText(); // Initial sort
          });
        },
        remove: function() {

        }
      },
      // Employee list view model
      viewModel: new ko.simpleGrid.viewModel({
        // simpleGrid basic parameters
        data: self.lists.employees,
        columns: [
          { headerText: 'ФИО', rowText: 'formattedName' },
          { headerText: 'Должность', rowText: 'post' },
          { headerText: 'Возраст', rowText: 'age' }
        ],
        pageSize: 10
      })
    },

    'posts': {
      title: 'Список должностей',
      controls: {
        update: function() {
          // Get'n'Renew
          $.getJSON('/api/posts', function(data) {
            self.lists.posts(data);
            self.lists.posts.sortByRowText();
          });
        },
        remove: function() {

        }
      },
      // Post list view model
      viewModel: new ko.simpleGrid.viewModel({
        data: self.lists.posts,
        columns: [
          { headerText: 'Название', rowText: 'value' }
        ],
        pageSize: 10
      })
    }
  };

  self.actions = {
    'add': {
    },
    'edit': {
    }
  };

  // Sammy router initialize
  self.router = Sammy(function() {
    // Basic pages loading
    this.get('/\#\/(main|employees|posts)/', function() {
      // Getting pageName from URL
      var pageName = this.params.splat[0];
      var page = self.pages[pageName];

      // Nothing to do if page is already loaded
      if (self.page.pageName() == pageName) return;
      // Page parameters setting up
      self.title(page.title);
      self.page.pageName(pageName);
      self.page.content(page.content);
      self.page.controls(page.controls);
      if (page.controls) page.controls.update(); // Getting list from server
      self.page.viewModel(page.viewModel);
      self.page.selected(undefined); // Clear chosed item for new page
    });

    // Actions handler
    this.get('/\#\/(employees|posts)\/(add|edit\/[0-9]+)/', function() { // Only /#/PAGE/add/ and /#/PAGE/edit/ID/ accepted
      // Getting parameters from URL
      var result = this.params.splat;
      var pageName = result[0];
      var actionName = result[1].split('/')[0];
      var id = result[1].split('/')[1];

      // If we comes by a pure URL, not by Button pressing
      if (self.page.pageName() != pageName) {
        // If we get id of item that we want to be selected we need:
        // - Wait for list comes from server
        // - Check that list contains this item
        // - Select it
        if (id) {
          // We can use single-shot subscribtion to accomplish this task
          self.lists[pageName].subscribe(function() {
            // Check
            var item = self.page.viewModel().data().filter(function(el) {
              return el.id == id;
            })[0];

            // Select
            if (item) self.page.selected(item.id);
            // Unsubscribe
            this.dispose();
          });
        }

        this.app.runRoute('get', '/#/' + pageName + '/');
      }
    });
    // Main page is main page
    this.get('', function() { this.app.runRoute('get', '/#/main/') });
  })

  self.router.run();
}, document.getElementById('htmlTop')); // For title changing
