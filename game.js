
words = {
    "high": "they climbed a very high mountain",
    "green": "the grass outside is green"
};

function speak(str) {
    
    var msg = new SpeechSynthesisUtterance(str);
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
}


function GameCntl($scope, $timeout) {
    
    $scope.right_indicator = false;
    $scope.wrong_indicator = false;
    $scope.number_right = 0;
    $scope.timeout = 0;
 
    $scope.next = function() {
        $scope.timeout = 0;

        // Pick a random word
        var num_words = Object.keys(words).length;
        $scope.word = Object.keys(words)[Math.floor(Math.random() * num_words)];
        
        $scope.resetGuess();
    };
    
    $scope.resetGuess = function() {
        $scope.guess = '';

        $scope.timeout = 0;
        $scope.right_indicator = false;
        $scope.wrong_indicator = false;
        
        speak($scope.word + ',, ' + words[$scope.word]);
    };
    
    $scope.keyup = function(e) {
        // If they already got it right, ignore input
        if($scope.right_indicator) {
            return;
        }

        if (e.keyCode == 8) {
            // Remove the last character.
            $scope.guess = $scope.guess.slice(0, -1);
            return;
        } else if (e.keyCode == 32) {
            $scope.next();
        }
        
        c = String.fromCharCode(e.keyCode);
        
        // Ignore key presses outside of A-Z
        if(c < 'A' || c > 'Z') {
            return;
        }

        $scope.guess += c.toLowerCase();

        if($scope.guess == $scope.word) {
            $scope.correct();
        }
    };
    
    $scope.correct = function() {
        
        $scope.number_right += 1;
        
        $scope.right_indicator = true;
        $scope.wrong_indicator = false;
        
        if($scope.timeout != 0) {
            $timeout.cancel($scope.timeout);
        }
        $scope.timeout = $timeout($scope.next, 2000);
        
        $('#jpId').jPlayer("play");
    };
    
    $scope.incorrect = function(c) {
        $scope.right_indicator = false;
        $scope.wrong_indicator = true;
        
        if($scope.timeout != 0) {
            $timeout.cancel($scope.timeout);
        }
        $scope.timeout = $timeout($scope.resetclue, 2000);
        
        speak($scope.clue + "?");
    };
    
    $scope.next();
}