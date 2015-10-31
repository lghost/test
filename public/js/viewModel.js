function viewModel() {
    var self = this;
    self.title = ko.observable("");

    Sammy(function() {
        this.get('#:page', function() {
            self.title(this.params.page);
        });

        this.get('', function() { this.app.runRoute('get', '#main') });
    }).run();
};

ko.applyBindings(new viewModel(), document.getElementById("htmlTop"));
