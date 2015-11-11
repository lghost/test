ko.applyBindings(new function () {
  var self = this;

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
    selected: ko.observable(),
    // Danger alert message
    errorMessage: ko.observable()
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
    errorMessage: ko.observable()
  };
  // Function, that prepares fields for modal window depending on add or edit action
  // It calls when modal showing
  self.action.getFields = function() {
    /* Don't know why, but when I use showAllMessages(false)
     * modal Knockstrap modal renderer calls this function
     * every time I change fields. So I just avoid this problem. */
    if (self.action.showed) return self.action.fields;
    self.action.showed = true;

    self.action.init();
    self.action.fields.errors.showAllMessages(false);
    return self.action.fields;
  };
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
        // Function calls when add action inits
        addInit: function() {
          // If we want to add/edit employees without post loaded, we need update last one first
          $.getJSON('/api/posts', self.lists.posts);
        },
        // Function calls when edit action inits
        editInit: function() {
          /* When posts updates, post of edited employee will not display correctly (due to async ajax request).
           * We need to reselect it here. */
          $.getJSON('/api/posts', function(data) {
            self.lists.posts(data);
            // Reselect
            self.action.fields().postId(self.lists.employees.getById(self.page.selected()).postId);
          });
        },
        // Update function gets data from server via AJAX
        update: function() {
          $.getJSON('/api/employees', function (response) { // Get array of every employee parameters
            self.lists.employees($.map(response, function (item) { // Update self.employees by array of Employee objects
              return new Employee(item);
            }));
            self.lists.employees.sortByRowText(); // Initial sort
          });
        },
        add: function() {
          // Check fields is valid
          if (self.action.fields.isValid()) {
            // $.post() doesn't support header specifying, so we use pure $.ajax()
            if (self.action.fields().postId()) {
              $.ajax({
                type: 'POST',
                url: '/api/employees/add',
                contentType: "application/json",
                data: ko.toJSON(self.action.fields),
                /* After sending we get simple object. If it contains err - sorry,
                 * we cannot add new employee */
                success: function(response) {
                  if (response.err) self.action.errorMessage(response.err);
                  else {
                    // On success server gives us new employee parameters object
                    self.lists.employees.push(new Employee(response.newOne));
                    self.lists.employees.sortByRowText();
                    self.action.disable();
                  }
                },
                dataType: 'json'
              });
            } else self.action.errorMessage("Нет доступных должностей");
          } else self.action.fields.errors.showAllMessages(true);
        },
        edit: function() {
          if (self.action.fields.isValid()) {
            if (self.action.fields().postId()) {
              $.ajax({
                type: 'POST',
                url: '/api/employees/edit/' + self.page.selected(),
                contentType: "application/json",
                data: ko.toJSON(self.action.fields),
                success: function(response) {
                  if (response.err) self.action.errorMessage(response.err);
                  else {
                    self.lists.employees.remove(function(element) {
                      return element.id == self.page.selected();
                    });
                    self.lists.employees.push(new Employee(response.newOne));
                    self.lists.employees.sortByRowText();
                    self.action.disable();
                  }
                },
                dataType: 'json'
              });
            } else self.action.errorMessage("Нет доступных должностей");
          } else self.action.fields.errors.showAllMessages(true);
        },
        remove: function() {
          self.page.errorMessage(null);
          $.getJSON('/api/employees/remove/' + self.page.selected(), function(response) {
            if (response.err) self.page.errorMessage(response.err);
            else {
              self.lists.employees.remove(function(element) {
                return element.id == self.page.selected();
              });
              self.page.selected(null);
            }
          });
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
      fields: ko.validatedObservable({
        firstName: ko.observable().extend({ required: { params: true, message: 'Поле не должно быть пустым' } }),
        lastName: ko.observable().extend({ required: { params: true, message: 'Поле не должно быть пустым' } }),
        middleName: ko.observable().extend({ required: { params: true, message: 'Поле не должно быть пустым' } }),
        age: ko.observable(),
        postId: ko.observable()
      })
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
        add: function() {
          if (self.action.fields.isValid()) {
            $.ajax({
              type: 'POST',
              url: '/api/posts/add',
              contentType: "application/json",
              data: ko.toJSON(self.action.fields),
              /* After sending we get simple object. If it contains err - sorry,
               * we cannot add new post */
              success: function(response) {
                if (response.err) self.action.errorMessage(response.err);
                else {
                  // Adding new object is better than whole list updating
                  self.lists.posts.push({
                    id: parseInt(response.id),
                    value: self.action.fields().value()
                  });
                  self.lists.posts.sortByRowText();
                  self.action.disable();
                }
              },
              dataType: 'json'
            });
          } else self.action.fields.errors.showAllMessages(true);
        },
        edit: function() {
          if (self.action.fields.isValid()) {
            $.ajax({
              type: 'POST',
              url: '/api/posts/edit/' + self.page.selected(),
              contentType: "application/json",
              data: ko.toJSON(self.action.fields),
              success: function(response) {
                if (response.err) self.action.errorMessage(response.err);
                else {
                  self.lists.posts.remove(function(element) {
                    return element.id == self.page.selected();
                  });
                  self.lists.posts.push({
                    id: self.page.selected(),
                    value: self.action.fields().value()
                  });
                  self.lists.posts.sortByRowText();
                  self.action.disable();
                }
              },
              dataType: 'json'
            });
          } else self.action.fields.errors.showAllMessages(true);
        },
        remove: function() {
          self.page.errorMessage(null);
          $.getJSON('/api/posts/remove/' + self.page.selected(), function(response) {
            if (response.err) self.page.errorMessage(response.err);
            else {
              self.lists.posts.remove(function(element) {
                return element.id == self.page.selected();
              });
              self.page.selected(null);
            }
          });
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
      fields: ko.validatedObservable({
        value: ko.observable().extend({ required: { params: true, message: 'Поле не должно быть пустым' } })
      })
    }
  };

  // Action parameters
  self.actions = {
    'add': {
      label: 'Добавить',
      buttonLabel: 'Добавить',
      // Fields preparing function (clearing)
      init: function() {
        for (var field in self.action.fields())
          self.action.fields()[field](null);
        if (self.page.controls().addInit) self.page.controls().addInit();
      }
    },
    'edit': {
      label: 'Редактировать',
      buttonLabel: 'Сохранить',
      // Fields preparing function (filling)
      init: function() {
        var item = self.getItemById(self.page.selected());

        if (item)
          for (var field in self.action.fields())
            self.action.fields()[field](item[field]);
        if (self.page.controls().editInit) self.page.controls().editInit();
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
      self.page.selected(null); // Clear chosed item for new page
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
      // Model-Template fields
      self.action.fields = self.pages[pageName].fields;
      // Template init function
      self.action.init = self.actions[actionName].init;

      // If we comes by a new URL, not by Button pressing or navi buttons
      if (self.page.pageName() != pageName) {
        /* If we get id of item that we want to be selected we need:
         * - Wait for list comes from server
         * - Check that list contains this item
         * - Select it */
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
