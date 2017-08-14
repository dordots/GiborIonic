  angular.module('gibor').controller('GiborCtrl', GiborController);

  function GiborController($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {
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
        partner: task.partner,
        type: task.type,
        reminder: task.reminder,
        frequency: task.frequency
      });
      vm.taskModal.hide();

      // Inefficient, but save all the projects
      Projects.save(vm.projects);

      task.title = "";
      task.details = "";
      task.partner = "";
      task.type = "";
      task.reminder = "";
      task.frequency = "";
    }; 

    vm.activeProject = vm.projects[Projects.getLastActiveIndex()];

    vm.deleteProject = function (projectTitle) {
      for (var i=0; i< vm.projects.length ; i++) {
        if ( vm.projects[i].title == projectTitle)
            vm.projects.splice(i,i+1);
      }
      Projects.save(vm.projects);
    }

    // Called to select the given project
    vm.selectProject = function (project, index) {
      vm.activeProject = project;
      Projects.setLastActiveIndex(index);
      $ionicSideMenuDelegate.toggleRight(false);
    };

    vm.newTask = function () {
      vm.taskModal.show();
    };

    vm.closeNewTask = function () {
      vm.taskModal.hide();
    }

    vm.toggleProjects = function () {
      $ionicSideMenuDelegate.toggleRight();
    };

    // Private functions
    vm.missionPartnersList = [
      {id:5, name:  "לבד"},
      {id:1 ,name: "אשר בן יעל"},
      {id:2, name:  "יצחק בן דינה"},
      {id:3, name:  "אברהם בן רינה"},
      {id:4, name:  "אברהם בן רונית"}];

    vm.missionTypes = [
        {id: 1 , type:"לימוד"},
        {id: 2 , type:"פעולה"},
        {id: 3 , type:"תפילה"},];

    vm.missionFrequencies = [
        {id: 1 , name:"יומיומי"},
        {id: 2 , name:"שבועי"},
        {id: 3 , name:"דו שבועי"},
        {id: 4 , name:"כל שישי"},
        {id: 5 , name:"תמיד"},];

    var createProject = function (projectTitle) {
      var newProject = Projects.newProject(projectTitle);
      vm.projects.push(newProject);
      Projects.save(vm.projects);
      vm.selectProject(newProject, vm.projects.length - 1);
    }

    // Create our modal
    $ionicModal.fromTemplateUrl('new-task.html', function (modal) {
      vm.taskModal = modal;
    }, {
        scope: $scope
      });

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