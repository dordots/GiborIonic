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
      if (!vm.activeProject || !task) {
        return;
      }
      vm.activeProject.tasks.push({
        title: task.title,
        details: task.details,
        validity: vm.taskDate ? vm.taskDate : null,
        partner: task.partner,
        missionType: task.missionType,
        reminder: task.reminder
      });
      vm.taskModal.hide();

      // Inefficient, but save all the projects
      Projects.save(vm.projects);

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
      vm.projects.push(newProject);
      Projects.save(vm.projects);
      vm.selectProject(newProject, vm.projects.length - 1);
    }

    var datePicker = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        var date = new Date(val);
        vm.taskDate = date.getMonth() + "/" + date.getFullYear()
      },
      mondayFirst: false,
    };




    // Load or initialize projects
    // Grab the last active, or the first project
    vm.activeProject = vm.projects[Projects.getLastActiveIndex()];

    

    vm.deleteProject = function (projectTitle) {
      for (var project in vm.projects) {
        if (project.title == projectTitle)
          delete project;
      }
      Projects.save(vm.projects);
    }

    // Called to select the given project
    vm.selectProject = function (project, index) {
      vm.activeProject = project;
      Projects.setLastActiveIndex(index);
      $ionicSideMenuDelegate.toggleRight(false);
    };

    // Create our modal
    $ionicModal.fromTemplateUrl('new-task.html', function (modal) {
      vm.taskModal = modal;
    }, {
        scope: $scope
      });

    

    vm.newTask = function () {
      vm.taskModal.show();
    };

    vm.closeNewTask = function () {
      vm.taskModal.hide();
    }

    vm.toggleProjects = function () {
      $ionicSideMenuDelegate.toggleRight();
    };


    // Try to create the first project, make sure to defer
    // this by using $timeout so everything is initialized
    // properly
    $timeout(function () {
      if (vm.projects.length == 0) {
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