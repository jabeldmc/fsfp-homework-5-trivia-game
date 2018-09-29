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

var GAME_MESSAGE__PROMPT_QUESTION = function( questionNumber , jpWord ) {
    this.header =
        "Question $QUESTION_NUMBER"
            .replace( "$QUESTION_NUMBER" , questionNumber.toString() );
    this.body0 = jpWord;
    this.body1 = "";
}

var GAME_MESSAGE__MESSAGE_QUESTION_TIMEOUT = function( jpWord , enWord ) {
    this.header = "Time Out";
    this.body0 = "Time ran out. Too bad!";
    this.body1 =
        "$JP_WORD means \"$EN_WORD\"."
            .replace( "$JP_WORD" , jpWord )
            .replace( "$EN_WORD" , enWord.toLowerCase() );
}

var GAME_MESSAGE__MESSAGE_GOOD_ANSWER = function( jpWord , enWord ) {
    this.header = "Correct";
    this.body0 =
        "$JP_WORD means \"$EN_WORD\"."
            .replace( "$JP_WORD" , jpWord )
            .replace( "$EN_WORD" , enWord.toLowerCase() );
    this.body1 = "Good job!";
}

var GAME_MESSAGE__MESSAGE_BAD_ANSWER = function( jpWord , enWord ) {
    this.header = "Incorrect";
    this.body0 = "Wrong aswer. Too bad!";
    this.body1 =
        "$JP_WORD means \"$EN_WORD\"."
            .replace( "$JP_WORD" , jpWord )
            .replace( "$EN_WORD" , enWord.toLowerCase() );
}

var GAME_MESSAGE__MESSAGE_GAME_OVER = function( score ) {
    this.header = "Finish!";
    this.body0 =
        "Your final score is $SCORE."
            .replace( "$SCORE" , score );
    this.body1 = "Click HERE to try again!";
}


/*** CONSTRUCTOR Trivia
***/

var Trivia = function( question , answer0 , answer1 , answer2 , correctAnswerIndex ) {
    console.group( "CONSTRUCTOR Trivia" );

    this.question = question;
    this.answers = [ answer0 , answer1 , answer2 ];
    this.correctAnswerIndex = correctAnswerIndex;

    console.groupEnd();
}


/*** CONSTRUCTOR Game
***/

var Game = function() {
    console.group( "CONSTRUCTOR Game" );

    this.status = GAME_STATUS__INITIALIZED;
    this.message = new GAME_MESSAGE__INITIALIZED();
    this.trivias = [
        new Trivia( "りんご (ringo)" , "Apple" , "Orange" , "Watermelon" , 0 ) ,
        new Trivia( "オレンジ (orenji)" , "Apple" , "Orange" , "Watermelon" , 1 ) ,
        new Trivia( "スイカ (suika)" , "Apple" , "Orange" , "Watermelon" , 2 ) ,
    ];
    this.triviaIndex = undefined;
    this.timer = undefined;
    this.timeout = undefined;
    this.score = 0;

    console.groupEnd();
}


/*** Update UI/FUNCTION updateUIMessage()
***/

updateUIMessage = function() {
    console.group( "FUNCTION updateUIMessage()" );

    // update "#game-message-header"
    if ( game.message.header === "" ) {
        $( "#game-message-header" ).html( "&nbsp;" );
    }
    else {
        $( "#game-message-header" ).text( game.message.header );
    }

    // update "#game-message-body-0"
    if ( game.message.body0 === "" ) {
        $( "#game-message-body-0" ).html( "&nbsp;" );
    }
    else {
        $( "#game-message-body-0" ).text( game.message.body0 );
    }

    // update "#game-message-body-1"
    if ( game.message.body1 === "" ) {
        $( "#game-message-body-1" ).html( "&nbsp;" );
    }
    else {
        $( "#game-message-body-1" ).text( game.message.body1 );
    }

    console.groupEnd();
}


/*** Update UI/FUNCTION updateUITrivia()
***/

updateUITrivia = function() {
    console.group( "FUNCTION updateUITrivia()" );

    if ( game.triviaIndex === undefined ) {
        $( "#game-trivia-answer-0" ).html( "&nbsp;" );
        $( "#game-trivia-answer-1" ).html( "&nbsp;" );
        $( "#game-trivia-answer-2" ).html( "&nbsp;" );
    }
    else {
        $( "#game-trivia-answer-0" ).text( game.trivias[ game.triviaIndex ].answers[ 0 ] );
        $( "#game-trivia-answer-1" ).text( game.trivias[ game.triviaIndex ].answers[ 1 ] );
        $( "#game-trivia-answer-2" ).text( game.trivias[ game.triviaIndex ].answers[ 2 ] );
    }

    console.groupEnd();
}


/*** Update UI/FUNCTION updateUITimer()
***/

updateUITimer = function() {
    console.group( "FUNCTION updateUITimer()" );

    if ( game.timer === undefined ) {
        $( "#game-timer" ).html( "&nbsp;" );
    }
    else {
        $( "#game-timer" ).text( game.timer.toString() );
    }

    console.groupEnd();
}


/*** Update UI/FUNCTION updateUIScore()
***/

updateUIScore = function() {
    console.group( "FUNCTION updateUIScore()" );

    if ( game.score === undefined ) {
        $( "#game-score" ).html( "&nbsp;" );
    }
    else {
        $( "#game-score" ).text( game.score.toString() );
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
    console.logValue( "seconds" , seconds );
    // console.logValue( "game" , game );

    game.timer = seconds;
    game.timeout =
        setTimeout(
            handleTimeout ,
            1000
        );

    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION gameStepTimer()
***/

gameStepTimer = function() {
    console.group( "gameStepTimer()" );
    // console.logValue( "game" , game );

    game.timer--;
    game.timeout =
        setTimeout(
            handleTimeout ,
            1000
        );

    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION gameEndTimer()
***/

gameEndTimer = function() {
    console.group( "gameEndTimer()" );
    // console.logValue( "game" , game );

    game.timer = undefined;
    clearTimeout( game.timeout );

    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION gamePromptQuestion()
***/

gamePromptQuestion = function() {
    console.group( "gamePromptQuestion()" );
    // console.logValue( "game" , game );

    if ( game.triviaIndex === undefined ) {
        game.triviaIndex = 0;
    }
    else {
        game.triviaIndex++;
    }
    var questionNumber = ( game.triviaIndex + 1 );
    var jpWord = game.trivias[ game.triviaIndex ].question;
    game.message = new GAME_MESSAGE__PROMPT_QUESTION( questionNumber , jpWord );

    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION gameMessageQuestionTimeout()
***/

gameMessageQuestionTimeout = function() {
    console.group( "gameMessageQuestionTimeout()" );
    // console.logValue( "game" , game );

    var trivia = game.trivias[ game.triviaIndex ];
    var jpWord = trivia.question;
    var enWord = trivia.answers[ trivia.correctAnswerIndex ];
    game.message = new GAME_MESSAGE__MESSAGE_QUESTION_TIMEOUT( jpWord , enWord );

    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION gameCheckCorrectAnswer()
***/

gameCheckCorrectAnswer = function( answerIndex ) {
    console.group( "gameCheckCorrectAnswer()" );
    console.logValue( "answerIndex" , answerIndex );
    // console.logValue( "game" , game );
    
    var trivia = game.trivias[ game.triviaIndex ];
    var checkCorrectAnswer = false;
    if ( answerIndex === trivia.correctAnswerIndex ) {
        game.score++;
        checkCorrectAnswer = true;
    }

    console.logValue( "checkCorrectAnswer" , checkCorrectAnswer );
    // console.logValue( "game" , game );
    console.groupEnd();
    return checkCorrectAnswer;
}

/*** Game FSA/FUNCTION gameMessageGoodAnswer()
***/

gameMessageGoodAnswer = function() {
    console.group( "gameMessageGoodAnswer()" );
    // console.logValue( "game" , game );
    
    var trivia = game.trivias[ game.triviaIndex ];
    var jpWord = trivia.question;
    var enWord = trivia.answers[ trivia.correctAnswerIndex ];
    game.message = new GAME_MESSAGE__MESSAGE_GOOD_ANSWER( jpWord , enWord );

    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION gameMessageBadAnswer()
***/

gameMessageBadAnswer = function() {
    console.group( "gameMessageBadAnswer()" );
    // console.logValue( "game" , game );
    
    var trivia = game.trivias[ game.triviaIndex ];
    var jpWord = trivia.question;
    var enWord = trivia.answers[ trivia.correctAnswerIndex ];
    game.message = new GAME_MESSAGE__MESSAGE_BAD_ANSWER( jpWord , enWord );

    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION gameCheckMoreQuestions()
***/

gameCheckMoreQuestions = function() {
    console.group( "gameCheckMoreQuestions()" );
    // console.logValue( "game" , game );

    var checkMoreQuestions = false;

    if ( game.triviaIndex < ( game.trivias.length - 1 ) ) {
        checkMoreQuestions = true;
    }
   
    console.logValue( "checkMoreQuestions" , checkMoreQuestions );
    // console.logValue( "game" , game );
    console.groupEnd();
    return checkMoreQuestions;
}


/*** Game FSA/FUNCTION gameMessageGameOver()
***/

gameMessageGameOver = function( score ) {
    console.group( "gameMessageGameOver()" );
    console.logValue( "score" , score );
    // console.logValue( "game" , game );

    game.message = new GAME_MESSAGE__MESSAGE_GAME_OVER( score );

    // console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION fsaStep()
***/

fsaStep = function( eventType , eventTarget ) {
    console.group( "fsaStep()" );
    if ( game !== undefined ) {
        console.logValue( "game.status" , game.status );
        console.logValue( "game.timer" , game.timer );
    }
    console.logValue( "eventType" , eventType );
    console.logValue( "eventTarget" , eventTarget );
    console.logValue( "game" , game );

    var checkFsaContinue = FSA_CONTINUE__NO;

    if ( game === undefined ) {
        game = new Game();
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    if ( game.status === GAME_STATUS__INITIALIZED ) {
        game.status = GAME_STATUS__PROMPT_START;
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__PROMPT_START ) {
        gamePromptStart();
        game.status = GAME_STATUS__PROMPT_START__WAIT_USER;
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    else if (
        ( game.status === GAME_STATUS__PROMPT_START__WAIT_USER ) &&
        ( eventType === "click" ) &&
        ( eventTarget === "game-message" )
    ) {
        game.status = GAME_STATUS__STARTED;
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__STARTED ) {
        game.status = GAME_STATUS__MESSAGE_GET_READY;
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__MESSAGE_GET_READY ) {
        gameMessageGetReady();
        game.status = GAME_STATUS__MESSAGE_GET_READY__WAIT_TIMEOUT;
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    else if (
        ( game.status === GAME_STATUS__MESSAGE_GET_READY__WAIT_TIMEOUT ) &&
        ( game.timer === undefined )
    ) {
        gameStartTimer( 3 );
        checkFsaContinue = FSA_CONTINUE__NO;
        // stop to wait for timeout
    }
    else if (
        ( game.status === GAME_STATUS__MESSAGE_GET_READY__WAIT_TIMEOUT ) &&
        ( eventType === "timeout" ) &&
        ( game.timer > 1 )
    ) {
        gameStepTimer();
        checkFsaContinue = FSA_CONTINUE__NO;
        // stop to wait for timeout
    }
    else if (
        ( game.status === GAME_STATUS__MESSAGE_GET_READY__WAIT_TIMEOUT ) &&
        ( eventType === "timeout" ) &&
        ( game.timer === 1 )
    ) {
        gameEndTimer();
        game.status = GAME_STATUS__MESSAGE_GET_READY__TIMEOUT;
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__MESSAGE_GET_READY__TIMEOUT ) {
        game.status = GAME_STATUS__PROMPT_QUESTION;
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__PROMPT_QUESTION ) {
        gamePromptQuestion();
        game.status = GAME_STATUS__PROMPT_QUESTION__WAIT_TIMEOUT;
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    else if (
        ( game.status === GAME_STATUS__PROMPT_QUESTION__WAIT_TIMEOUT ) &&
        ( game.timer === undefined  )
    ) {
        gameStartTimer( 5 );
        checkFsaContinue = FSA_CONTINUE__NO;
        // stop to wait for timeout
    }
    else if (
        ( game.status === GAME_STATUS__PROMPT_QUESTION__WAIT_TIMEOUT ) &&
        ( eventType === "timeout" ) &&
        ( game.timer > 1 )
    ) {
        gameStepTimer();
        checkFsaContinue = FSA_CONTINUE__NO;
        // stop to wait for timeout
    }
    else if (
        ( game.status === GAME_STATUS__PROMPT_QUESTION__WAIT_TIMEOUT ) &&
        ( eventType === "timeout" ) &&
        ( game.timer === 1 )
    ) {
        gameEndTimer();
        game.status = GAME_STATUS__PROMPT_QUESTION__TIMEOUT;
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__PROMPT_QUESTION__TIMEOUT ) {
        game.status = GAME_STATUS__MESSAGE_QUESTION_TIMEOUT;
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__MESSAGE_QUESTION_TIMEOUT ) {
        gameMessageQuestionTimeout();
        game.status = GAME_STATUS__AFTER_QUESTION__WAIT_TIMEOUT;
        checkFsaContinue = FSA_CONTINUE__YES;
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
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__CHECK_CORRECT_ANSWER  ) {
        var answerIndex = parseInt( eventTarget.split( "game-trivia-answer-" )[1] );
        var checkCorrectAnswer  = gameCheckCorrectAnswer( answerIndex );
        if ( checkCorrectAnswer ) {
            game.status = GAME_STATUS__MESSAGE_GOOD_ANSWER;
        }
        else {
            game.status = GAME_STATUS__MESSAGE_BAD_ANSWER;
        }
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__MESSAGE_GOOD_ANSWER ) {
        gameMessageGoodAnswer();
        game.status = GAME_STATUS__AFTER_QUESTION__WAIT_TIMEOUT;
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__MESSAGE_BAD_ANSWER ) {
        gameMessageBadAnswer();
        game.status = GAME_STATUS__AFTER_QUESTION__WAIT_TIMEOUT;
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    else if (
        ( game.status === GAME_STATUS__AFTER_QUESTION__WAIT_TIMEOUT ) &&
        ( game.timer === undefined )
    ) {
        gameStartTimer( 3 );
        checkFsaContinue = FSA_CONTINUE__NO;
        // stop to wait for timeout
    }
    else if (
        ( game.status === GAME_STATUS__AFTER_QUESTION__WAIT_TIMEOUT ) &&
        ( eventType === "timeout" ) &&
        ( game.timer > 1 )
    ) {
        gameStepTimer();
        checkFsaContinue = FSA_CONTINUE__NO;
        // stop to wait for timeout
    }
    else if (
        ( game.status === GAME_STATUS__AFTER_QUESTION__WAIT_TIMEOUT ) &&
        ( eventType === "timeout" ) &&
        ( game.timer === 1 )
    ) {
        gameEndTimer();
        game.status = GAME_STATUS__CHECK_MORE_QUESTIONS;
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__CHECK_MORE_QUESTIONS ) {
        var checkMoreQuestions = gameCheckMoreQuestions();
        if ( checkMoreQuestions ) {
            game.status = GAME_STATUS__MESSAGE_GET_READY;
        }
        else {
            game.status = GAME_STATUS__MESSAGE_GAME_OVER;
        }
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    else if ( game.status === GAME_STATUS__MESSAGE_GAME_OVER ) {
        gameMessageGameOver( game.score );
        game.status = GAME_STATUS__MESSAGE_GAME_OVER__WAIT_USER;
        checkFsaContinue = FSA_CONTINUE__YES;
    }
    else if (
        ( game.status === GAME_STATUS__MESSAGE_GAME_OVER__WAIT_USER ) &&
        ( eventType === "click" ) &&
        ( eventTarget === "game-message" )
    )
    {
        game = new Game();
        checkFsaContinue = FSA_CONTINUE__YES;
    }

    console.logValue( "checkFsaContinue" , checkFsaContinue );
    console.logValue( "game" , game );
    console.groupEnd();
    return checkFsaContinue;
}


/*** Game FSA/FUNCTION fsaMain()
***/

fsaMain = function( eventType , eventTarget ) {
    console.group( "fsaMain()" );
    console.logValue( "eventType" , eventType );
    console.logValue( "eventTarget" , eventTarget );

    do {
        var checkFsaContinue = fsaStep( eventType , eventTarget );
        updateUI();
    }
    while ( checkFsaContinue === FSA_CONTINUE__YES );

    console.groupEnd();
}


/*** Event Handlers/FUNCTION handleTimeout()
***/

handleTimeout = function() {
    console.group( "FUNCTION handleTimeout()" );

    fsaMain( "timeout" , game.timeout );

    console.groupEnd();
}


/*** Event Handlers/FUNCTION handleClick()
***/

handleClick = function( event ) {
    console.group( "FUNCTION handleClick()" );
    console.logValue( "event.type" , event.type );
    console.logValue( "event.currentTarget.id" , event.currentTarget.id );

    fsaMain( event.type , event.currentTarget.id );

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
    fsaMain( null , null );

    console.groupEnd();
}

$( handleReady );
