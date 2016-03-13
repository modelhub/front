define('projects/projects', [
    'styler',
    'text!projects/projects.css',
    'text!projects/projects.html',
    'text!projects/projects.txt.json'
], function(
    styler,
    style,
    tpl,
    txt
){
    styler(style);
    txt = JSON.parse(txt);

    return function(ngModule){
        ngModule
            .directive('mhProjects', function(){
                return {
                    restrict: 'E',
                    template: tpl,
                    scope: {},
                    controller: ['$element', '$scope', 'api', 'i18n', function($element, $scope, api, i18n){
                        i18n($scope, txt);

                        var fileEl = $element[0].getElementsByClassName('new-project-thumbnail-input')[0];
                        $scope.projects = true;
                        $scope.projectsLoadingError = '';

                        $scope.newProjectBtnClick = function(){
                            $scope.newProjectName = '';
                            if ($scope.selectedControl === 'newProject') {
                                $scope.selectedControl = '';
                            } else {
                                $scope.selectedControl = 'newProject';
                            }
                        };

                        $scope.createNewProjectBtnClick = function(){

                        };

                        $scope.newProjectThumbnailBtnClick = function(){
                            fileEl.click();
                        };

                        $scope.newProjectThumbnailFileChange = function(){
                            alert('OY!');
                        };
                    }]
                };
            });
    }
});