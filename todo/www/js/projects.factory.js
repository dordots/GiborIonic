(function () {
    'use strict';

    angular.module('gibor').factory('Projects', Projects);

    function Projects() {
        return {
            all: function () {
                var projectString = window.localStorage['projects1'];

                if (projectString) {
                    return angular.fromJson(projectString);
                }

                return [];
            },
            save: function (projects) {
                window.localStorage['projects1'] = angular.toJson(projects);
            },
            newProject: function (projectTitle) {
                // Add a new project
                return {
                    title: projectTitle,
                    tasks: []
                };
            },
            init: function () {
                window.localStorage['projects1'] = [];
                window.localStorage['lastActiveProject'] = null;
            },
            getLastActiveIndex: function () {
                return parseInt(window.localStorage['lastActiveProject']) || 0;
            },
            setLastActiveIndex: function (index) {
                window.localStorage['lastActiveProject'] = index;
            }
        }
    }
})();