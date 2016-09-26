'use strict';

describe('Controller: MenupreviewCtrl', function () {

  // load the controller's module
  beforeEach(module('canteenApp'));

  var MenupreviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MenupreviewCtrl = $controller('MenupreviewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MenupreviewCtrl.awesomeThings.length).toBe(3);
  });
});
