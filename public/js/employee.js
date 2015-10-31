function Employee(firstName, lastName, middleName, post, age) {
  var self = this;

  self.firstName = firstName;
  self.lastName = lastName;
  self.middleName = middleName;
  self.post = post;
  self.age = age;

  self.formattedName = ko.computed(function() {
    return lastName + ' ' + firstName.charAt(0) + '. ' + middleName.charAt(0) + '.';
  });
}
