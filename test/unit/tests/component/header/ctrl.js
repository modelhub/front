define([
    'ng',
    'ngMock',
    'header/ctrl'
], function(
    ng,
    ngMock,
    headerCtrl
){

    describe('headerCtrl', function(){
        var $scope,
            $location,
            cpStyle = jasmine.createSpy('cpStyle'),
            currentUser = {getInfo: jasmine.createSpy('getInfo')},
            i18n = jasmine.createSpy('i18n'),
            spies = [
                cpStyle,
                currentUser.getInfo,
                i18n
            ],
            testRegistry = ng.module('testRegistry', []),
            registerSpyService = function(name, service){
                testRegistry.service(name, [function(){
                    return service;
                }]);
            },
            resetSpies = function(){
                spies.forEach(function(spy){
                    spy.calls.reset();
                });
            };

        registerSpyService('cpStyle', cpStyle);
        registerSpyService('currentUser', currentUser);
        registerSpyService('i18n', i18n);
        headerCtrl(testRegistry);

        beforeEach(function(){
            module('testRegistry');
            inject(function($injector){
                $scope = $injector.get('$rootScope').$new();
                $location = $injector.get('$location');
                var $compile = $injector.get('$compile');
                var el = ng.element("<cp-header></cp-header>");
                $compile(el)($scope);
                $scope = el.isolateScope();
            });
        });

        afterEach(resetSpies);

        it('should call cpStyle("cpHeader", style) once', function(){
            expect(cpStyle.calls.allArgs()).toEqual([['cpHeader', jasmine.any(String)]]);
        });

        it('should call i18n($scope, txt) once', function(){
            expect(i18n.calls.allArgs()).toEqual([[$scope, jasmine.any(String)]]);
        });

        it('should call currentUser.getInfo(fn, fn) once, and set the appropriate $scope properties on success', function(){
            expect(currentUser.getInfo.calls.allArgs()).toEqual([[jasmine.any(Function),jasmine.any(Function)]]);
            var successCallback = currentUser.getInfo.calls.argsFor(0)[0];
            var errorCallback = currentUser.getInfo.calls.argsFor(0)[1];
            errorCallback();
            successCallback({avatar: 'testAvatar', fullName: 'testFullName'});
            expect($scope.avatar).toEqual('testAvatar');
            expect($scope.fullName).toEqual('testFullName');
        });

        it('$scope.goToObjects() should call $location.path("/objects")', function(){
            spyOn($location, 'path');
            $scope.goToObjects();
            expect($location.path.calls.allArgs()).toEqual([['/objects']]);
        });

        it('$scope.goToSettings() should call $location.path("/settings")', function(){
            spyOn($location, 'path');
            $scope.goToSettings();
            expect($location.path.calls.allArgs()).toEqual([['/settings']]);
        });
    });
});