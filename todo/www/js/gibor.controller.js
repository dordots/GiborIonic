  angular.module('gibor').controller('GiborCtrl', GiborController);

  function GiborController($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate, ionicDatePicker) {
    var vm = this;
  
    vm.projects = Projects.all();
    vm.newProject = function () {
      var projectTitle = prompt('שם העולם');
      if (projectTitle) {
        createProject(projectTitle);
      }
    };
    
    vm.createTask = function (task) {
      if (!$scope.activeProject || !task) {
        return;
      }
      $scope.activeProject.tasks.push({
        title: task.title,
        details: task.details,
        validity: $scope.taskDate ? $scope.taskDate : null,
        partner: task.partner,
        missionType: task.missionType,
        reminder: task.reminder
      });
      $scope.taskModal.hide();

      // Inefficient, but save all the projects
      Projects.save($scope.projects);

      task.title = "";
      task.details = "";
      task.validity = "";
      task.partner = "";
      task.missionType = "";
      task.reminder = "";
    }; 

    vm.openDatePicker = function () {
      ionicDatePicker.openDatePicker(datePicker);
    };
       

    // Private functions

    var createProject = function (projectTitle) {
      var newProject = Projects.newProject(projectTitle);
      $scope.projects.push(newProject);
      Projects.save($scope.projects);
      $scope.selectProject(newProject, $scope.projects.length - 1);
    }

    var datePicker = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        var date = new Date(val);
        $scope.taskDate = date.getMonth() + "/" + date.getFullYear()
      },
      mondayFirst: false,
    };




    // Load or initialize projects
    // Grab the last active, or the first project
    $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

    

    $scope.deleteProject = function (projectTitle) {
      for (var project in $scope.projects) {
        if (project.title == projectTitle)
          delete project;
      }
      Projects.save($scope.projects);
    }

    // Called to select the given project
    $scope.selectProject = function (project, index) {
      $scope.activeProject = project;
      Projects.setLastActiveIndex(index);
      $ionicSideMenuDelegate.toggleRight(false);
    };

    // Create our modal
    $ionicModal.fromTemplateUrl('new-task.html', function (modal) {
      $scope.taskModal = modal;
    }, {
        scope: $scope
      });

    

    $scope.newTask = function () {
      $scope.taskModal.show();
    };

    $scope.closeNewTask = function () {
      $scope.taskModal.hide();
    }

    $scope.toggleProjects = function () {
      $ionicSideMenuDelegate.toggleRight();
    };


    // Try to create the first project, make sure to defer
    // this by using $timeout so everything is initialized
    // properly
    $timeout(function () {
      if ($scope.projects.length == 0) {
        while (true) {
          var projectTitle = prompt('Your first project title:');
          if (projectTitle) {
            createProject(projectTitle);
            break;
          }
        }
      }
    }, 1000);

  }