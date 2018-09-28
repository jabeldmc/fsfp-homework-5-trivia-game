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
var GAME_STATUS_INITIALIZED = 0;
var GAME_STATUS_PROMPT_START = 1;
var GAME_STATUS_START = 2;
var GAME_STATUS_MESSAGE_GET_READY = 3;
var GAME_STATUS_WAIT_GET_READY = 4;
var GAME_STATUS_TIMEOUT_GET_READY = 5;
var GAME_STATUS_PROMPT_QUESTION = 6;
var GAME_STATUS_WAIT_QUESTION = 7;
var GAME_STATUS_TIMEOUT_QUESTION = 8;
var GAME_STATUS_MESSAGE_TIMEOUT_QUESTION = 9;
var GAME_STATUS_CHECK_ANSWER = 10;
var GAME_STATUS_MESSAGE_GOOD_ANSWER = 11;
var GAME_STATUS_MESSAGE_BAD_ANSWER = 12;
var GAME_STATUS_CHECK_MORE_QUESTIONS = 13;
var GAME_STATUS_WAIT_NEXT_QUESTION = 14;
var GAME_STATUS_MESSAGE_GAME_OVER = 15;

// FSA status
var FSA_STOP = 0;
var FSA_CONTINUE = 1;

// game
var game;    // [object Game]


/*** Message Constructors
***/

var MESSAGE_INITIALIZED = function() {
    this.header = "";
    this.body0 = "";
    this.body1 = "";
};
var MESSAGE_PROMPT_START = function() {
    this.header = "ようこそ！";
    this.body0 = "How is your Japanese vocabulary? Choose the correct translation for each word!";
    this.body1 = "Click HERE to start!"
}
// var MESSAGE_START = undefined;
var MESSAGE_MESSAGE_GET_READY = function() {
    this.header = "Get Ready!";
    this.body0 = "Next question is coming!";
    this.body1 = "";
}
// var MESSAGE_WAIT_GET_READY = undefined;
// var MESSAGE_TIMEOUT_GET_READY = undefined;
var MESSAGE_PROMPT_QUESTION = function( questionNumber , jpWord ) {
    this.header =
        "Question Number $QUESTION_NUMBER"
            .replace( "$QUESTION_NUMBER" , questionNumber.toString() );
    this.body0 = jpWord;
    this.body1 = "";
}
// var MESSAGE_WAIT_QUESTION = undefined;
// var MESSAGE_TIMEOUT_QUESTION = undefined;
var MESSAGE_MESSAGE_TIMEOUT_QUESTION = function( jpWord , enWord ) {
    this.header = "Time Out!";
    this.body0 =
        "\"$JP_WORD\" means \"$EN_WORD\""
            .replace( "$JP_WORD" , jpWord )
            .replace( "$EN_WORD" , enWord );
    this.body1 = "";
}
var MESSAGE_CHECK_ANSWER = undefined;
var MESSAGE_MESSAGE_GOOD_ANSWER = function( jpWord , enWord ) {
    this.header = "Correct!";
    this.body0 =
        "\"$JP_WORD\" means \"$EN_WORD\"."
            .replace( "$JP_WORD" , jpWord )
            .replace( "$EN_WORD" , enWord );
    this.body1 = "";
}
var MESSAGE_MESSAGE_BAD_ANSWER = undefined;
var MESSAGE_CHECK_MORE_QUESTIONS = undefined;
var MESSAGE_WAIT_NEXT_QUESTION = undefined;
var MESSAGE_MESSAGE_GAME_OVER = undefined;


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

    this.status = GAME_STATUS_INITIALIZED;
    this.message = new MESSAGE_INITIALIZED();
    this.trivias = [
        new Trivia( "りんご" , "apple" , "orange" , "watermelon" , 0 ) ,
        new Trivia( "オレンジ" , "apple" , "orange" , "watermelon" , 1 ) ,
        new Trivia( "スイカ" , "apple" , "orange" , "watermelon" , 2 ) ,
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
    if ( game.message.header === null ) {
        // do nothing
    }
    else if ( game.message.header === "" ) {
        $( "#game-message-header" ).html( "&nbsp;" );
    }
    else {
        $( "#game-message-header" ).text( game.message.header );
    }

    // update "#game-message-body0"
    if ( game.message.body0 === null ) {
        // do nothing
    }
    else if ( game.message.body0 === "" ) {
        $( "#game-message-body0" ).html( "&nbsp;" );
    }
    else {
        $( "#game-message-body0" ).text( game.message.body0 );
    }

    // update "#game-message-body1"
    if ( game.message.body1 === null ) {
        // do nothing
    }
    else if ( game.message.body1 === "" ) {
        $( "#game-message-body1" ).html( "&nbsp;" );
    }
    else {
        $( "#game-message-body1" ).text( game.message.body1 );
    }

    console.groupEnd();
}


/*** Update UI/FUNCTION updateUITrivia()
***/

updateUITrivia = function() {
    console.group( "FUNCTION updateUITrivia()" );

    if ( game.triviaIndex === undefined ) {
        $( "#game-trivia-answer0" ).html( "&nbsp;" );
        $( "#game-trivia-answer1" ).html( "&nbsp;" );
        $( "#game-trivia-answer2" ).html( "&nbsp;" );
    }
    else {
        $( "#game-trivia-answer0" ).text( game.trivias[ game.triviaIndex ].answers[ 0 ] );
        $( "#game-trivia-answer1" ).text( game.trivias[ game.triviaIndex ].answers[ 1 ] );
        $( "#game-trivia-answer2" ).text( game.trivias[ game.triviaIndex ].answers[ 2 ] );
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


/*** Game FSA/FUNCTION fsaPromptStart()
***/

fsaPromptStart = function() {
    console.group( "fsaPromptStart()" );
    console.logValue( "game" , game );

    game.message = new MESSAGE_PROMPT_START();
    game.status = GAME_STATUS_PROMPT_START;

    console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION fsaStart()
***/

fsaStart = function() {
    console.group( "fsaStart()" );
    console.logValue( "game" , game );

    game.status = GAME_STATUS_START;

    console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION fsaMessageGetReady()
***/

fsaMessageGetReady = function() {
    console.group( "fsaMessageGetReady()" );
    console.logValue( "game" , game );

    game.message = new MESSAGE_MESSAGE_GET_READY();
    game.status = GAME_STATUS_MESSAGE_GET_READY;

    console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION fsaWaitGetReady()
***/

fsaWaitGetReady = function() {
    console.group( "fsaWaitGetReady()" );
    console.logValue( "game" , game );

    game.timer = 3;
    game.timeout =
        setTimeout(
            handleTimeout ,
            1000
        );
    game.status = GAME_STATUS_WAIT_GET_READY;

    console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION fsaWaitGetReadyStep()
***/

fsaWaitGetReadyStep = function() {
    console.group( "fsaWaitGetReadyStep()" );
    console.logValue( "game" , game );

    game.timer--;
    game.timeout =
        setTimeout(
            handleTimeout ,
            1000
        );
    game.status = GAME_STATUS_WAIT_GET_READY;

    console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION fsaTimeoutGetReady()
***/

fsaTimeoutGetReady = function() {
    console.group( "fsaTimeoutGetReady()" );
    console.logValue( "game" , game );

    game.timer = undefined;
    clearTimeout( game.timeout );
    game.status = GAME_STATUS_TIMEOUT_GET_READY;

    console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION fsaPromptQuestion()
***/

fsaPromptQuestion = function() {
    console.group( "fsaPromptQuestion()" );
    console.logValue( "game" , game );

    if ( game.triviaIndex === undefined ) {
        game.triviaIndex = 0;
    }
    else {
        game.triviaIndex++;
    }
    var questionNumber = ( game.triviaIndex + 1 );
    var jpWord = game.trivias[ game.triviaIndex ].question;
    game.message = new MESSAGE_PROMPT_QUESTION( questionNumber , jpWord );
    game.status = GAME_STATUS_PROMPT_QUESTION;

    console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION fsaWaitQuestion()
***/

fsaWaitQuestion = function() {
    console.group( "fsaWaitQuestion()" );
    console.logValue( "game" , game );

    game.timer = 5;
    game.timeout =
        setTimeout(
            handleTimeout ,
            1000
        );
    game.status = GAME_STATUS_WAIT_QUESTION;

    console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION fsaWaitQuestionStep()
***/

fsaWaitQuestionStep = function() {
    console.group( "fsaWaitQuestionStep()" );
    console.logValue( "game" , game );

    game.timer--;
    game.timeout =
        setTimeout(
            handleTimeout ,
            1000
        );
    game.status = GAME_STATUS_WAIT_QUESTION;

    console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION fsaTimeoutQuestion()
***/

fsaTimeoutQuestion = function() {
    console.group( "fsaTimeoutQuestion()" );
    console.logValue( "game" , game );

    game.timer = undefined;
    clearTimeout( game.timeout );
    game.status = GAME_STATUS_TIMEOUT_QUESTION;

    console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION fsaMessageTimeoutQuestion()
***/

fsaMessageTimeoutQuestion = function() {
    console.group( "fsaMessageTimeoutQuestion()" );
    console.logValue( "game" , game );

    var trivia = game.trivias[ game.triviaIndex ];
    var jpWord = trivia.question;
    var enWord = trivia.answers[ trivia.correctAnswerIndex ];
    game.message = new MESSAGE_MESSAGE_TIMEOUT_QUESTION( jpWord , enWord );
    game.status = GAME_STATUS_MESSAGE_TIMEOUT_QUESTION;

    console.logValue( "game" , game );
    console.groupEnd();
}


/*** Game FSA/FUNCTION fsaStep()
***/

fsaStep = function( eventType , eventTarget ) {
    console.group( "fsaStep()" );
    console.logValue( "game.status" , game.status );
    console.logValue( "game.timer" , game.timer );
    console.logValue( "eventType" , eventType );
    console.logValue( "eventTarget" , eventTarget );

    var result = FSA_STOP;

    if ( game.status === GAME_STATUS_INITIALIZED ) {
        fsaPromptStart();
        result = FSA_CONTINUE;
    }
    else if (
        ( game.status === GAME_STATUS_PROMPT_START ) &&
        ( eventType === "click" ) &&
        ( eventTarget === "game-message" )
    ) {
        fsaStart();
        result = FSA_CONTINUE;
    }
    else if ( game.status === GAME_STATUS_START ) {
        fsaMessageGetReady();
        result = FSA_CONTINUE;
    }
    else if ( game.status === GAME_STATUS_MESSAGE_GET_READY ) {
        fsaWaitGetReady();
        result = FSA_STOP;
    }
    else if (
        ( game.status === GAME_STATUS_WAIT_GET_READY ) &&
        ( game.timer > 1 )
    ) {
        fsaWaitGetReadyStep();
        result = FSA_STOP;
    }
    else if (
        ( game.status === GAME_STATUS_WAIT_GET_READY ) &&
        ( game.timer === 1 )
    ) {
        fsaTimeoutGetReady();
        result = FSA_CONTINUE;
    }
    else if ( game.status === GAME_STATUS_TIMEOUT_GET_READY ) {
        fsaPromptQuestion();
        result = FSA_CONTINUE;
    }
    else if ( game.status === GAME_STATUS_PROMPT_QUESTION ) {
        fsaWaitQuestion();
        result = FSA_STOP;
    }
    else if (
        ( game.status === GAME_STATUS_WAIT_QUESTION ) &&
        ( game.timer > 1 )
    ) {
        fsaWaitQuestionStep();
        result = FSA_STOP;
    }
    else if (
        ( game.status === GAME_STATUS_WAIT_QUESTION ) &&
        ( game.timer === 1 )
    ) {
        fsaTimeoutQuestion();
        result = FSA_CONTINUE;
    }
    else if ( game.status === GAME_STATUS_TIMEOUT_QUESTION ) {
        fsaMessageTimeoutQuestion();
        result = FSA_CONTINUE;
    }

    console.logValue( "result" , result );
    console.groupEnd();
    return result;
}


/*** Game FSA/FUNCTION fsaMain()
***/

fsaMain = function( eventType , eventTarget ) {
    console.group( "fsaMain()" );
    console.logValue( "eventType" , eventType );
    console.logValue( "eventTarget" , eventTarget );

    do {
        var fsaResult = fsaStep( eventType , eventTarget );
        updateUI();
    }
    while ( fsaResult === FSA_CONTINUE );

    console.groupEnd();
}


/*** Event Handlers/FUNCTION handleTimeout()
***/

handleTimeout = function() {
    console.group( "FUNCTION handleTimeout()" );

    fsaMain( null , null );

    console.groupEnd();
}


/*** Event Handlers/FUNCTION handleClickMessage()
***/

handleClickMessage = function( event ) {
    console.group( "FUNCTION handleClickMessage()" );
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
    game = new Game();
    console.logValue( "game" , game );

    // register event handlers
    $( "#game-message" ).on( "click" , handleClickMessage );

    // start FSA
    fsaMain( null , null );

    console.groupEnd();
}

$( handleReady );
