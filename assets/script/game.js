/*** Scrapbook

// Timer Example
myTimeOut =
    setTimeout(
        function( message1 , message2 ) {
            console.log( message1 , message2 )
        } ,
        10000 ,
        "message-1" ,
        "message-2"
    );
clearTimeout( myTimeOut );

// Interval Example
myInterval =
    setInterval(
        function( message1 , message2 ) {
            console.log( message1 , message2 )
        } ,
        1000 ,
        "message-1" ,
        "message-2"
    );
clearInterval( myInterval );

// Interval Example
var countdown = 5;
console.log( countdown );
myInterval =
    setInterval(
        function() {
            countdown--;
            console.log( countdown );
            if ( countdown === 0 ) {
                clearInterval( myInterval );
            }
        } ,
        1000 ,
    );
clearInterval( myInterval );

***/


/*** Global Variables
***/

// game status
var GAME_STATUS__INITIALIZED = 0;
var GAME_STATUS__PROMPT_START = 1;
var GAME_STATUS__PROMPT_START__WAIT_USER = 1.1;
var GAME_STATUS__STARTED = 2;
var GAME_STATUS__MESSAGE_GET_READY = 3;
var GAME_STATUS__MESSAGE_GET_READY__WAIT_TIMEOUT = 3.1;
var GAME_STATUS__MESSAGE_GET_READY__TIMEOUT = 3.2;
var GAME_STATUS__PROMPT_QUESTION = 4;
var GAME_STATUS__PROMPT_QUESTION__WAIT_TIMEOUT = 4.1;
var GAME_STATUS__PROMPT_QUESTION__TIMEOUT = 4.2;
var GAME_STATUS__MESSAGE_QUESTION_TIMEOUT = 5;
var GAME_STATUS__CHECK_CORRECT_ANSWER = 6;
var GAME_STATUS__MESSAGE_GOOD_ANSWER = 7;
var GAME_STATUS__MESSAGE_BAD_ANSWER = 8;
var GAME_STATUS__AFTER_QUESTION__WAIT_TIMEOUT = 9;
var GAME_STATUS__AFTER_QUESTION__TIMEOUT = 9.1;
var GAME_STATUS__CHECK_MORE_QUESTIONS = 10;
var GAME_STATUS__MESSAGE_GAME_OVER = 11;
var GAME_STATUS__MESSAGE_GAME_OVER__WAIT_USER = 11.1;

// FSA continue
var FSA_CONTINUE__NO = 0;
var FSA_CONTINUE__YES = 1;

// dictionary of questions and correct answers
var questions = [
    { question : "いす (isu)" , answer : "chair" } ,
    { question : "つくえ (tsukue)" , answer : "desk" } ,
    { question : "えんぴつ (enpitsu)" , answer : "pencil" } ,
    { question : "かみ (kami)" , answer : "paper" } ,
    { question : "ほん (hon)" , answer : "book" } ,
    { question : "いぬ (inu)" , answer : "dog" } ,
    { question : "ねこ (neko)" , answer : "cat" } ,
    { question : "とり (tori)" , answer : "bird" } ,
    { question : "りんご (ringo)" , answer : "apple" } ,
    { question : "オレンジ (orenji)" , answer : "orange" } ,
    { question : "スイカ (suika)" , answer : "watermelon" } ,
    { question : "ぎゅうにゅう (gyūnyū)" , answer : "milk" } ,
    { question : "おちゃ (ocha)" , answer : "green tea" } ,
    { question : "こうちゃ (kōcha)" , answer : "black tea" } ,
    { question : "たまご (tamago)" , answer : "egg" } ,
    { question : "さかな (sakana)" , answer : "fish" } ,
];

// game
var game;    // [object Game]


/*** Message Constructors
***/

var GAME_MESSAGE__INITIALIZED = function() {
    this.header = "";
    this.body0 = "";
    this.body1 = "";
};

var GAME_MESSAGE__PROMPT_START = function() {
    this.header = "ようこそ！ Welcome!";
    this.body0 = "How is your Japanese vocabulary? Choose the correct translation!";
    this.body1 = "Click HERE to start!"
}

var GAME_MESSAGE__MESSAGE_GET_READY = function() {
    this.header = "Get Ready";
    this.body0 = "Next question is coming!";
    this.body1 = "";
}

var GAME_MESSAGE__PROMPT_QUESTION = function( questionNumber , question ) {
    this.header =
        "Question $QUESTION_NUMBER"
            .replace( "$QUESTION_NUMBER" , questionNumber.toString() );
    this.body0 = question;
    this.body1 = "";
}

var GAME_MESSAGE__MESSAGE_QUESTION_TIMEOUT = function( question , answer ) {
    this.header = "Time Out";
    this.body0 = "Time ran out. Too bad!";
    this.body1 =
        "$JP_WORD means \"$EN_WORD\"."
            .replace( "$JP_WORD" , question )
            .replace( "$EN_WORD" , answer );
}

var GAME_MESSAGE__MESSAGE_GOOD_ANSWER = function( question , answer ) {
    this.header = "Correct!";
    this.body0 =
        "$JP_WORD means \"$EN_WORD\"."
            .replace( "$JP_WORD" , question )
            .replace( "$EN_WORD" , answer );
    this.body1 = "Good job!";
}

var GAME_MESSAGE__MESSAGE_BAD_ANSWER = function( question , answer ) {
    this.header = "Incorrect";
    this.body0 = "Wrong aswer. Too bad!";
    this.body1 =
        "$JP_WORD means \"$EN_WORD\"."
            .replace( "$JP_WORD" , question )
            .replace( "$EN_WORD" , answer );
}

var GAME_MESSAGE__MESSAGE_GAME_OVER = function( score , questionCount ) {
    this.header = "Finish!";
    this.body0 =
        "You got $SCORE out of $QUESTION_COUNT words correct."
            .replace( "$SCORE" , score )
            .replace( "$QUESTION_COUNT" , questionCount );
    this.body1 = "Click HERE to try again!";
}


/*** CONSTRUCTOR Trivia
***/

var Trivia = function( question , answers , correctAnswerIndex ) {
    console.group( "CONSTRUCTOR Trivia" );

    this.question = question;
    this.answers = answers;
    this.correctAnswerIndex = correctAnswerIndex;

    console.groupEnd();
}


/*** FUNCTION getTrivias()
***/

var getTrivias = function() {
    console.group( "getTrivias()" );

    var trivias = [];
    var questionIndices = jdcUtil.getRandomNumbers( 10 , questions.length , true );
    // console.logValue( "questionIndices" , questionIndices );

    questionIndices.forEach(
        ( questionIndex ) => {
            // console.group( "questionIndices.forEach" );
            // console.logValue( "questionIndex" , questionIndex );

            // question
            var question = questions[ questionIndex ].question;
            // console.logValue( "question" , question );
            // correct answer (in array)
            var answers = [ questions[ questionIndex ].answer ];
            // console.logValue( "answers" , answers );

            // add two incorrect answers
            // pick three indices, in case one is the same as questionIndex
            var otherAnswerIndices = jdcUtil.getRandomNumbers( 3 , questions.length , true );
            // console.logValue( "otherAnswerIndices" , otherAnswerIndices );
            // remove questionIndex, if found
            otherAnswerIndices.splice( otherAnswerIndices.indexOf( questionIndex) , 1 );
            // console.logValue( "otherAnswerIndices" , otherAnswerIndices );
            // add the first two of answers left
            answers.push( questions[ otherAnswerIndices[ 0 ] ].answer );
            answers.push( questions[ otherAnswerIndices[ 1 ] ].answer );
            // console.logValue( "answers" , answers );
            // randomize order of answers
            answerIndices = jdcUtil.getRandomNumbers( answers.length , answers.length , true );
            // console.logValue( "answerIndices" , answerIndices );
            // get index of correct answer (originally index 0)
            var correctAnswerIndex = answerIndices.indexOf( 0 );
            answers = [
                answers[ answerIndices[ 0 ] ] ,
                answers[ answerIndices[ 1 ] ] ,
                answers[ answerIndices[ 2 ] ]
            ]
            // console.logValue( answers );

            // create and add trivia
            var trivia = new Trivia( question , answers , correctAnswerIndex );
            // console.logValue( "trivia" , trivia );
            trivias.push( trivia );
            // console.logValue( "trivias" , trivias );

            // console.groupEnd();
        }
    );

    console.groupEnd();
    return trivias;
}


/*** CONSTRUCTOR Game
***/

var Game = function() {
    console.group( "CONSTRUCTOR Game" );

    this.status = GAME_STATUS__INITIALIZED;
    this.message = new GAME_MESSAGE__INITIALIZED();
    this.trivias = getTrivias();
    this.triviaIndex = null;
    this.timer = null;
    this.timeout = null;
    this.score = 0;

    console.groupEnd();
}


/*** Game FSA/FUNCTION gamePromptStart()
***/

gamePromptStart = function() {
    console.group( "gamePromptStart()" );
    // console.logValue( "game" , game );

    game.message = new GAME_MESSAGE__PROMPT_START();

    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION gameMessageGetReady()
***/

gameMessageGetReady = function() {
    console.group( "gameMessageGetReady()" );
    // console.logValue( "game" , game );

    game.message = new GAME_MESSAGE__MESSAGE_GET_READY();

    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION gameStartTimer()
***/

gameStartTimer = function( seconds ) {
    console.group( "gameStartTimer()" );
    // console.logValue( "seconds" , seconds );
    // console.logValue( "game" , game );

    game.timer = seconds;
    game.timeout =
        setTimeout(
            handleTimeout ,
            1000
        );

    // console.logValue( "game.timer" , game.timer );
    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION gameStepTimer()
***/

gameStepTimer = function() {
    console.group( "gameStepTimer()" );
    // console.logValue( "game.timer" , game.timer );
    // console.logValue( "game" , game );

    game.timer--;
    game.timeout =
        setTimeout(
            handleTimeout ,
            1000
        );

    // console.logValue( "game.timer" , game.timer );
    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION gameEndTimer()
***/

gameEndTimer = function() {
    console.group( "gameEndTimer()" );
    // console.logValue( "game.timer" , game.timer );
    // console.logValue( "game" , game );

    game.timer = null;
    clearTimeout( game.timeout );

    // console.logValue( "game.timer" , game.timer );
    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION gamePromptQuestion()
***/

gamePromptQuestion = function() {
    console.group( "gamePromptQuestion()" );
    // console.logValue( "game.triviaIndex" , game.triviaIndex );
    // console.logValue( "game" , game );

    if ( game.triviaIndex === null ) {
        game.triviaIndex = 0;
    }
    else {
        game.triviaIndex++;
    }
    var questionNumber = ( game.triviaIndex + 1 );
    var jpWord = game.trivias[ game.triviaIndex ].question;
    game.message = new GAME_MESSAGE__PROMPT_QUESTION( questionNumber , jpWord );

    // console.logValue( "game.triviaIndex" , game.triviaIndex );
    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION gameMessageQuestionTimeout()
***/

gameMessageQuestionTimeout = function() {
    console.group( "gameMessageQuestionTimeout()" );
    // console.logValue( "game" , game );

    var trivia = game.trivias[ game.triviaIndex ];
    var question = trivia.question;
    var answer = trivia.answers[ trivia.correctAnswerIndex ];
    game.message = new GAME_MESSAGE__MESSAGE_QUESTION_TIMEOUT( question , answer );

    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION gameIsCorrectAnswer()
***/

gameIsCorrectAnswer = function( answerIndex ) {
    console.group( "gameIsCorrectAnswer()" );
    console.logValue( "answerIndex" , answerIndex );
    // console.logValue( "game" , game );

    var trivia = game.trivias[ game.triviaIndex ];
    var isCorrectAnswer = false;
    if ( answerIndex === trivia.correctAnswerIndex ) {
        game.score++;
        isCorrectAnswer = true;
    }

    console.logValue( "isCorrectAnswer" , isCorrectAnswer );
    // console.logValue( "game" , game );
    console.groupEnd();
    return isCorrectAnswer;
}


/*** Game FSA/FUNCTION gameMessageGoodAnswer()
***/

gameMessageGoodAnswer = function() {
    console.group( "gameMessageGoodAnswer()" );
    // console.logValue( "game" , game );

    var trivia = game.trivias[ game.triviaIndex ];
    var question = trivia.question;
    var answer = trivia.answers[ trivia.correctAnswerIndex ];
    game.message = new GAME_MESSAGE__MESSAGE_GOOD_ANSWER( question , answer );

    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION gameMessageBadAnswer()
***/

gameMessageBadAnswer = function() {
    console.group( "gameMessageBadAnswer()" );
    // console.logValue( "game" , game );

    var trivia = game.trivias[ game.triviaIndex ];
    var question = trivia.question;
    var answer = trivia.answers[ trivia.correctAnswerIndex ];
    game.message = new GAME_MESSAGE__MESSAGE_BAD_ANSWER( question , answer );

    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION gameCheckMoreQuestions()
***/

gameCheckMoreQuestions = function() {
    console.group( "gameCheckMoreQuestions()" );
    // console.logValue( "game" , game );

    var flagMoreQuestions = false;

    if ( game.triviaIndex < ( game.trivias.length - 1 ) ) {
        flagMoreQuestions = true;
    }

    console.logValue( "flagMoreQuestions" , flagMoreQuestions );
    // console.logValue( "game" , game );
    console.groupEnd();
    return flagMoreQuestions;
}


/*** Game FSA/FUNCTION gameMessageGameOver()
***/

gameMessageGameOver = function( score ) {
    console.group( "gameMessageGameOver()" );
    console.logValue( "score" , score );
    // console.logValue( "game" , game );

    game.message = new GAME_MESSAGE__MESSAGE_GAME_OVER( score , game.trivias.length );

    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION gameFsaStep()
***/

gameFsaStep = function( eventType , eventTarget ) {
    console.group( "gameFsaStep()" );
    console.logValue( "eventType" , eventType );
    console.logValue( "eventTarget" , eventTarget );
    if ( game === undefined ) {
        console.logValue( "game.status" , undefined );
        console.logValue( "game.timer" , undefined );
        console.logValue( "game.questionIndex" , undefined );
    }
    if ( game !== undefined ) {
        console.logValue( "game.status" , game.status );
        console.logValue( "game.timer" , game.timer );
        console.logValue( "game.questionIndex" , game.questionIndex );
    }
    // console.logValue( "game" , game );

    var flagFsaContinue = FSA_CONTINUE__NO;

    if ( game === undefined ) {
        game = new Game();
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    if ( game.status === GAME_STATUS__INITIALIZED ) {
        game.status = GAME_STATUS__PROMPT_START;
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__PROMPT_START ) {
        gamePromptStart();
        game.status = GAME_STATUS__PROMPT_START__WAIT_USER;
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if (
        ( game.status === GAME_STATUS__PROMPT_START__WAIT_USER ) &&
        ( eventType === "click" ) &&
        ( eventTarget === "game-message" )
    ) {
        game.status = GAME_STATUS__STARTED;
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__STARTED ) {
        game.status = GAME_STATUS__MESSAGE_GET_READY;
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__MESSAGE_GET_READY ) {
        gameMessageGetReady();
        game.status = GAME_STATUS__MESSAGE_GET_READY__WAIT_TIMEOUT;
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if (
        ( game.status === GAME_STATUS__MESSAGE_GET_READY__WAIT_TIMEOUT ) &&
        ( game.timer === null )
    ) {
        gameStartTimer( 3 );
        // stop to wait for timeout
        flagFsaContinue = FSA_CONTINUE__NO;
    }
    else if (
        ( game.status === GAME_STATUS__MESSAGE_GET_READY__WAIT_TIMEOUT ) &&
        ( eventType === "timeout" ) &&
        ( game.timer > 1 )
    ) {
        gameStepTimer();
        // stop to wait for timeout
        flagFsaContinue = FSA_CONTINUE__NO;
    }
    else if (
        ( game.status === GAME_STATUS__MESSAGE_GET_READY__WAIT_TIMEOUT ) &&
        ( eventType === "timeout" ) &&
        ( game.timer === 1 )
    ) {
        gameEndTimer();
        game.status = GAME_STATUS__MESSAGE_GET_READY__TIMEOUT;
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__MESSAGE_GET_READY__TIMEOUT ) {
        game.status = GAME_STATUS__PROMPT_QUESTION;
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__PROMPT_QUESTION ) {
        gamePromptQuestion();
        game.status = GAME_STATUS__PROMPT_QUESTION__WAIT_TIMEOUT;
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if (
        ( game.status === GAME_STATUS__PROMPT_QUESTION__WAIT_TIMEOUT ) &&
        ( game.timer === null )
    ) {
        gameStartTimer( 5 );
        flagFsaContinue = FSA_CONTINUE__NO;
        // stop to wait for timeout
    }
    else if (
        ( game.status === GAME_STATUS__PROMPT_QUESTION__WAIT_TIMEOUT ) &&
        ( eventType === "timeout" ) &&
        ( game.timer > 1 )
    ) {
        gameStepTimer();
        flagFsaContinue = FSA_CONTINUE__NO;
        // stop to wait for timeout
    }
    else if (
        ( game.status === GAME_STATUS__PROMPT_QUESTION__WAIT_TIMEOUT ) &&
        ( eventType === "timeout" ) &&
        ( game.timer === 1 )
    ) {
        gameEndTimer();
        game.status = GAME_STATUS__PROMPT_QUESTION__TIMEOUT;
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__PROMPT_QUESTION__TIMEOUT ) {
        game.status = GAME_STATUS__MESSAGE_QUESTION_TIMEOUT;
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__MESSAGE_QUESTION_TIMEOUT ) {
        gameMessageQuestionTimeout();
        game.status = GAME_STATUS__AFTER_QUESTION__WAIT_TIMEOUT;
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if (
        ( game.status === GAME_STATUS__PROMPT_QUESTION__WAIT_TIMEOUT ) &&
        ( eventType === "click" ) &&
        (
            ( eventTarget === "game-trivia-answer-0" ) ||
            ( eventTarget === "game-trivia-answer-1" ) ||
            ( eventTarget === "game-trivia-answer-2" )
        )
    ) {
        gameEndTimer();
        game.status = GAME_STATUS__CHECK_CORRECT_ANSWER;
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__CHECK_CORRECT_ANSWER  ) {
        var answerIndex = parseInt( eventTarget.split( "game-trivia-answer-" )[1] );
        var isCorrectAnswer  = gameIsCorrectAnswer( answerIndex );
        if ( isCorrectAnswer ) {
            game.status = GAME_STATUS__MESSAGE_GOOD_ANSWER;
        }
        else {
            game.status = GAME_STATUS__MESSAGE_BAD_ANSWER;
        }
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__MESSAGE_GOOD_ANSWER ) {
        gameMessageGoodAnswer();
        game.status = GAME_STATUS__AFTER_QUESTION__WAIT_TIMEOUT;
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__MESSAGE_BAD_ANSWER ) {
        gameMessageBadAnswer();
        game.status = GAME_STATUS__AFTER_QUESTION__WAIT_TIMEOUT;
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if (
        ( game.status === GAME_STATUS__AFTER_QUESTION__WAIT_TIMEOUT ) &&
        ( game.timer === null )
    ) {
        gameStartTimer( 3 );
        flagFsaContinue = FSA_CONTINUE__NO;
        // stop to wait for timeout
    }
    else if (
        ( game.status === GAME_STATUS__AFTER_QUESTION__WAIT_TIMEOUT ) &&
        ( eventType === "timeout" ) &&
        ( game.timer > 1 )
    ) {
        gameStepTimer();
        flagFsaContinue = FSA_CONTINUE__NO;
        // stop to wait for timeout
    }
    else if (
        ( game.status === GAME_STATUS__AFTER_QUESTION__WAIT_TIMEOUT ) &&
        ( eventType === "timeout" ) &&
        ( game.timer === 1 )
    ) {
        gameEndTimer();
        game.status = GAME_STATUS__AFTER_QUESTION__TIMEOUT;
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status == GAME_STATUS__AFTER_QUESTION__TIMEOUT ) {
        game.status = GAME_STATUS__CHECK_MORE_QUESTIONS;
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__CHECK_MORE_QUESTIONS ) {
        var flagMoreQuestions = gameCheckMoreQuestions();
        if ( flagMoreQuestions ) {
            game.status = GAME_STATUS__MESSAGE_GET_READY;
        }
        else {
            game.status = GAME_STATUS__MESSAGE_GAME_OVER;
        }
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__MESSAGE_GAME_OVER ) {
        gameMessageGameOver( game.score );
        game.status = GAME_STATUS__MESSAGE_GAME_OVER__WAIT_USER;
        flagFsaContinue = FSA_CONTINUE__YES;
    }
    else if (
        ( game.status === GAME_STATUS__MESSAGE_GAME_OVER__WAIT_USER ) &&
        ( eventType === "click" ) &&
        ( eventTarget === "game-message" )
    ) {
        game = new Game();
        flagFsaContinue = FSA_CONTINUE__YES;
    }

    console.logValue( "flagFsaContinue" , flagFsaContinue );
    console.logValue( "game" , game );
    console.groupEnd();
    return flagFsaContinue;
}


/*** Game FSA/FUNCTION gameFsaMain()
***/

gameFsaMain = function( eventType , eventTarget , callbackUpdateUI ) {
    console.group( "gameFsaMain()" );
    console.logValue( "eventType" , eventType );
    console.logValue( "eventTarget" , eventTarget );

    do {
        var flagFsaContinue = gameFsaStep( eventType , eventTarget );
        callbackUpdateUI();
    }
    while ( flagFsaContinue === FSA_CONTINUE__YES );

    console.groupEnd();
}


/*** Update UI/FUNCTION updateUIMessage()
***/

updateUIMessage = function() {
    console.group( "FUNCTION updateUIMessage()" );

    // update "#game-message"
    var gameMessageJQ = $( "#game-message" );

    // update "#game-message"/background color
    if ( game.status === GAME_STATUS__MESSAGE_GOOD_ANSWER ) {
        gameMessageJQ.addClass( "alert-success" );
    }
    else if ( game.status === GAME_STATUS__MESSAGE_BAD_ANSWER ) {
        gameMessageJQ.addClass( "alert-danger" )
    }
    else if ( game.status === GAME_STATUS__AFTER_QUESTION__TIMEOUT ) {
        // turn off event colors
        gameMessageJQ.removeClass( "alert-success alert-danger" );
    }

    // update "#game-message"/cursor
    if (
        ( game.status === GAME_STATUS__PROMPT_START__WAIT_USER ) ||
        ( game.status === GAME_STATUS__MESSAGE_GAME_OVER__WAIT_USER )
    ) {
        gameMessageJQ.css( "cursor" , "pointer" );
    }
    else {
        gameMessageJQ.css( "cursor" , "" );
    }

    // update "#game-message-header"
    var gameMessageHeaderJQ = $( "#game-message-header" );

    if ( game.message.header === "" ) {
        gameMessageHeaderJQ.html( "&nbsp;" );
    }
    else {
        gameMessageHeaderJQ.text( game.message.header );
    }

    // update "#game-message-body-0"
    var gameMessageBody0JQ = $( "#game-message-body-0" );

    if ( game.message.body0 === "" ) {
        gameMessageBody0JQ.html( "&nbsp;" );
    }
    else {
        gameMessageBody0JQ.text( game.message.body0 );
    }

    if ( game.status === GAME_STATUS__PROMPT_QUESTION__WAIT_TIMEOUT ) {
        gameMessageBody0JQ.css( "font-size" , "2rem" );
    } else {
        gameMessageBody0JQ.css( "font-size" , "16px" );
    }

    // update "#game-message-body-1"
    var gameMessageBody1JQ = $( "#game-message-body-1" );

    if ( game.message.body1 === "" ) {
        gameMessageBody1JQ.html( "&nbsp;" );
    }
    else {
        gameMessageBody1JQ.text( game.message.body1 );
    }

    if ( game.status === GAME_STATUS__PROMPT_QUESTION__WAIT_TIMEOUT ) {
        gameMessageBody1JQ.addClass( "d-none" );
    } else {
        gameMessageBody1JQ.removeClass( "d-none" );
    }

    console.groupEnd();
}


/*** Update UI/FUNCTION updateUITrivia()
***/

updateUITrivia = function() {
    console.group( "FUNCTION updateUITrivia()" );

    // update #game-trivia-answer-0
    var gameTriviaAnswer0JQ = $( "#game-trivia-answer-0" );
    if ( game.status === GAME_STATUS__PROMPT_QUESTION__WAIT_TIMEOUT ) {
        gameTriviaAnswer0JQ.show();
        gameTriviaAnswer0JQ.text( game.trivias[ game.triviaIndex ].answers[ 0 ] );
    }
    else {
        gameTriviaAnswer0JQ.hide();
        gameTriviaAnswer0JQ.html( "&nbsp;" );
    }

    // update @game-trivia-answer-1
    var gameTriviaAnswer1JQ =  $( "#game-trivia-answer-1" );
    if ( game.status === GAME_STATUS__PROMPT_QUESTION__WAIT_TIMEOUT ) {
        gameTriviaAnswer1JQ.show();
        gameTriviaAnswer1JQ.text( game.trivias[ game.triviaIndex ].answers[ 1 ] );
    }
    else {
        gameTriviaAnswer1JQ.hide();
        gameTriviaAnswer1JQ.html( "&nbsp;" );
    }

    // update #game-trivia-answer-2
    var gameTriviaAnswer2JQ = $( "#game-trivia-answer-2" );
    if ( game.status === GAME_STATUS__PROMPT_QUESTION__WAIT_TIMEOUT ) {
        gameTriviaAnswer2JQ.show();
        gameTriviaAnswer2JQ.text( game.trivias[ game.triviaIndex ].answers[ 2 ] );
    }
    else {
        gameTriviaAnswer2JQ.hide();
        gameTriviaAnswer2JQ.html( "&nbsp;" );
    }

    console.groupEnd();
}


/*** Update UI/FUNCTION updateUITimer()
***/

updateUITimer = function() {
    console.group( "FUNCTION updateUITimer()" );

    // update "#game-timer"
    var gameTimerJQ = $( "#game-timer" );
    gameTimerJQ.removeClass( "alert-primary alert-warning alert-danger" );
    if (
        ( game.status === GAME_STATUS__PROMPT_QUESTION__WAIT_TIMEOUT ) &&
        ( game.timer === 1 )
    ) {
        gameTimerJQ.addClass( "alert-danger" );
    }
    else if (
        ( game.status === GAME_STATUS__PROMPT_QUESTION__WAIT_TIMEOUT ) &&
        (
            ( game.timer === 2 ) ||
            ( game.timer === 3 )
        )
    ) {
        gameTimerJQ.addClass( "alert-warning" );
    }
    else {
        gameTimerJQ.addClass( "alert-primary" );

    }

    // update #game-timer-value
    var gameTimerValueJQ = $( "#game-timer-value" );
    if ( game.timer === null ) {
        gameTimerValueJQ.html( "&nbsp;" );
    }
    else {
        gameTimerValueJQ.text( game.timer.toString() );
    }

    console.groupEnd();
}


/*** Update UI/FUNCTION updateUIScore()
***/

updateUIScore = function() {
    console.group( "FUNCTION updateUIScore()" );

    // update #game-score-value
    var gameScoreValueJQ = $( "#game-score-value" );
    if ( game.score === null ) {
        gameScoreValueJQ.html( "&nbsp;" );
    }
    else {
        gameScoreValueJQ.text( game.score.toString() );
    }

    console.groupEnd();
}


/*** Update UI/FUNCTION updateUI()
***/

updateUI = function() {
    console.group( "FUNCTION updateUI()" );

    updateUIMessage();
    updateUITimer();
    updateUITrivia();
    updateUIScore();

    console.groupEnd();
}


/*** Event Handlers/FUNCTION handleTimeout()
***/

handleTimeout = function() {
    console.group( "FUNCTION handleTimeout()" );

    gameFsaMain( "timeout" , game.timeout , updateUI );

    console.groupEnd();
}


/*** Event Handlers/FUNCTION handleClick()
***/

handleClick = function( event ) {
    console.group( "FUNCTION handleClick()" );
    console.logValue( "event.type" , event.type );
    console.logValue( "event.currentTarget.id" , event.currentTarget.id );

    gameFsaMain( event.type , event.currentTarget.id , updateUI );

    console.groupEnd();
}


/*** Event Handlers/FUNCTION handleReady()
***/

handleReady = function( event ) {
    console.group( "FUNCTION handleReady()" );

    // initialize game
    // game = new Game();
    // console.logValue( "game" , game );

    // register event handlers
    $( "#game-message" ).on( "click" , handleClick );
    $( "#game-trivia-answer-0" ).on( "click" , handleClick );
    $( "#game-trivia-answer-1" ).on( "click" , handleClick );
    $( "#game-trivia-answer-2" ).on( "click" , handleClick );

    // start FSA
    gameFsaMain( null , null , updateUI );

    console.groupEnd();
}

$( handleReady );
