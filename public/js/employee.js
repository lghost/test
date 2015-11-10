function Employee(args) {
  var self = this;

  self.id = args.id;
  self.firstName = args.firstName || "";
  self.lastName = args.lastName || "";
  self.middleName = args.middleName || "";
  self.post = args.post.value;
  self.postId = args.postId;
  self.age = args.age;

  self.formattedName = ko.computed(function() {
    return self.lastName + ' ' + self.firstName.charAt(0) + '. ' + self.middleName.charAt(0) + '.';
  });
}
