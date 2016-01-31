(function () {

    var app = angular.module('quiz', []);

    app.controller('QuizController', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {

<<<<<<< Updated upstream:js/quiz.js
        $scope.currQuestion = 0;
        $scope.showFeedback = false;
        $scope.offended = false;
        $scope.ytUrl = '';
=======
        $http.get('quiz_data.json').then(function (quizData) {
            $scope.myQuestions = quizData.data;
            $scope.totalQuestions = $scope.myQuestions.length;
        });
        
        
        //Defining a route to actually post an answer to the API
        $scope.postAnswer = function() {
        $http.post('/api/answers', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.questions = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

        $scope.selectAnswer = function (qIndex, aIndex) {
            var questionState = $scope.myQuestions[qIndex].questionState;

            if (questionState != 'answered') {
                $scope.myQuestions[qIndex].selectedAnswer = aIndex;
>>>>>>> Stashed changes:public/quiz.js

        $scope.selectAnswer = function(i){
            if (i == 0){
                $scope.showFeedback = true;
                $scope.offended = true;

                $scope.ytUrl = $sce.trustAsResourceUrl($scope.questions[$scope.currQuestion].url);
                // do http request to save answer
            } else {
                $scope.currQuestion += 1;

                if ($scope.currQuestion > $scope.questions.length){
                    $scope.currQuestion -= 1;
                }
            }
        };

        $http.get('quiz_data.json').then(function (quizData) {
            $scope.questions = quizData.data;
            $scope.totalQuestions = $scope.questions.length;
        });


    }]);



})();