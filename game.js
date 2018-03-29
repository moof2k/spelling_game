


function speak(str) {
    var msg = new SpeechSynthesisUtterance(str);

    // Use the online language synthesis engine.
    msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Google US English'; })[0];
    msg.rate = 0.8;
 
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
}


function GameCntl($scope, $timeout) {
    $scope.guess = '';
    $scope.hint = '';
    $scope.right_indicator = false;
    $scope.wrong_indicator = false;
    $scope.number_right = 0;
    $scope.timeout = 0;

    $scope.words = {};

    d3.csv("words.csv").then(function(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].sentence.length > 1) {
                $scope.words[data[i].word] = data[i].sentence;
            }
        }

        $scope.next();
    });
 
    $scope.next = function() {
        $scope.timeout = 0;

        // Pick a random word
        var num_words = Object.keys($scope.words).length;
        $scope.word = Object.keys($scope.words)[Math.floor(Math.random() * num_words)];
        
        $scope.resetGuess();
    };
    
    $scope.resetGuess = function() {
        $scope.guess = '';

        $scope.hint = $scope.words[$scope.word].replace($scope.word, '_____');

        var searchMask = $scope.word;
        var regEx = new RegExp(searchMask, "ig");
        var replaceMask = '_____';

        $scope.hint = $scope.words[$scope.word].replace(regEx, replaceMask);

        $scope.timeout = 0;
        $scope.right_indicator = false;
        $scope.wrong_indicator = false;
        
        speak($scope.word + '. ' + $scope.words[$scope.word]);
    };
    
    $scope.keyup = function(e) {
        // If they already got it right, ignore input
        if($scope.right_indicator) {
            return;
        }

        console.log(e.keyCode);

        if (e.keyCode == 8) {
            // Remove the last character.
            $scope.guess = $scope.guess.slice(0, -1);
            return;
        } else if (e.keyCode == 32) {
            //$scope.next();
        } else if (e.keyCode == 13) {
            $scope.resetGuess();
        } else if (e.keyCode == 222) {
            $scope.guess += '\'';
        } else {
            c = String.fromCharCode(e.keyCode);

            if (c >= 'A' && c <= 'Z') {
                $scope.guess += c.toLowerCase();
            }
        }
        
        
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
    
}