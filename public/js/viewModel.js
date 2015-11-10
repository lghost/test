ko.applyBindings(new function () {
  var self = this;

  self.tst = ko.observable();

  // Title
  self.title = ko.observable();

  // Page architecture
  self.page = {
    pageName: ko.observable(),
    // Some text maybe
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
    visible: ko.observable(),
    // Modal window render allow observable (see enable/disable)
    allow: ko.observable(),
    // Label of modal window
    label: ko.observable(),
    // Modal window body template name
    bodyTemplate: ko.observable(),
    // Accept button label (Add or Edit, for example)
    buttonLabel: ko.observable(),
    // Model-Template fields
    fieldsData: ko.observable(),
    // Template init function
    init: ko.observable()
  };
  // Function, that prepares fields in modal window depending on add or edit init function
  // It calls when modal generating
  self.action.fields = ko.computed(function() {
    if (self.action.init()) self.action.init()();
    return self.action.fieldsData();
  });
  self.action.enable = function() {
    // Allow modal render
    self.action.allow(true);
    // Show modal
    self.action.visible(true);
  };
  self.action.disable = function() {
    // First hide modal
    self.action.visible(false);
    // Disabling happens when modal completely disappear
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

  // Helper function for data lists
  self.getItemById = function(id, pageName) {
    if (!pageName) pageName = self.page.pageName();
    if (!pageName) return;
    if (!self.lists[pageName]) return;
    return self.lists[pageName].getById(id);
  };

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
      // Label for action modal window
      actionLabel: 'сотрудника',
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
        add: function() {

        },
        edit: function() {

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
      }),
      fields: {
        post: ko.observable()
      }
    },

    'posts': {
      title: 'Список должностей',
      actionLabel: 'должность',
      controls: {
        update: function() {
          // Get'n'Renew
          $.getJSON('/api/posts', function(data) {
            self.lists.posts(data);
            self.lists.posts.sortByRowText();
          });
        },
        add: function(fields) {
          // if data correct
          //   ajax request
          //     if success self.action.disable()
        },
        edit: function() {

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
      }),
      fields: {
        value: ko.observable().extend({ required: { params: true, message: 'Поле не должно быть пустым' } })
      }
    }
  };

  self.actions = {
    'add': {
      label: 'Добавить',
      buttonLabel: 'Добавить',
      // Fields preparing function (clearing)
      init: function() {
        for (var field in self.action.fieldsData())
          self.action.fieldsData()[field](null);
      }
    },
    'edit': {
      label: 'Редактировать',
      buttonLabel: 'Сохранить',
      // Fields preparing function (filling)
      init: function() {
        var item = self.getItemById(self.page.selected());

        if (item)
          for (var field in self.action.fieldsData())
            self.action.fieldsData()[field](item[field]);
      }
    }
  };

  // Sammy router initialize
  self.router = Sammy(function() {
    // Basic pages loading
    this.get('/\#\/(main|employees|posts)/', function() {
      // Getting pageName from URL
      var pageName = this.params.splat[0];
      var page = self.pages[pageName];

      // Hide any action
      self.action.disable();
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

      self.action.label(self.actions[actionName].label + ' ' +
                        self.pages[pageName].actionLabel);
      self.action.bodyTemplate(pageName + '_ModalBodyTemplate');
      self.action.buttonLabel(self.actions[actionName].buttonLabel);
      self.action.action = self.pages[pageName].controls[actionName];
      self.action.fieldsData(self.pages[pageName].fields);
      self.action.init(self.actions[actionName].init);

      // If we comes by a new URL, not by Button pressing or navi buttons
      if (self.page.pageName() != pageName) {
        // If we get id of item that we want to be selected we need:
        // - Wait for list comes from server
        // - Check that list contains this item
        // - Select it
        if (id) {
          // We can use single-shot subscribtion to accomplish this task
          self.lists[pageName].subscribe(function() {
            // Check
            if (self.getItemById(id, pageName)) {
              // Select
              self.page.selected(id);
              // Start action
              self.action.enable();
            // If we cannot find item - move to list view
            } else window.location = '/#/' + pageName + '/';

            // Unsubscribe
            this.dispose();
          });
        } // Otherwise nothing to wait, just start action, but after base page loaded (see below)

        // Now run base page route
        this.app.runRoute('get', '/#/' + pageName + '/');
        if (!id) self.action.enable();

      // Otherwise nothing to wait, checking is much simplier
      } else if (id) {
        if (self.getItemById(id)) {
          self.page.selected(id);
          self.action.enable();
        }
        else window.location = '/#/' + pageName + '/';
      } else self.action.enable();
    });

    // Main page is main page
    this.get('', function() { this.app.runRoute('get', '/#/main/') });
  })

  self.router.run();
}, document.getElementById('htmlTop')); // For title changing
