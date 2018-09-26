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

***/


/*** Global Variables
***/

// Game Status
var GAME_STATUS_INITIALIZED = 0;
var GAME_STATUS_PROMPT_START = 1;
var GAME_STATUS_STARTED = 2;
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


/*** Message Templates
***/

var MESSAGE_INITIALIZED = undefined;
var MESSAGE_PROMPT_START = function() {
    this.header = "ようこそ！";
    this.line1 = "Choose the correct translation for each Japanese word.";
    this.line2 = "Click to start!"
}
var MESSAGE_STARTED = undefined;
var MESSAGE_MESSAGE_GET_READY = undefined;
var MESSAGE_WAIT_GET_READY = undefined;
var MESSAGE_TIMEOUT_GET_READY = undefined;
var MESSAGE_PROMPT_QUESTION = undefined;
var MESSAGE_WAIT_QUESTION = undefined;
var MESSAGE_TIMEOUT_QUESTION = undefined;
var MESSAGE_MESSAGE_TIMEOUT_QUESTION = undefined;
var MESSAGE_CHECK_ANSWER = undefined;
var MESSAGE_MESSAGE_GOOD_ANSWER = function( jpWord , enWord ) {
    this.header = "Correct!";
    this.line1 =
        "$JP_WORD means $EN_WORD!"
        .replace( "$JP_WORD" , jpWord )
        .replace( "$EN_WORD" , enWord );
    this.line2 = "";
}
var MESSAGE_MESSAGE_BAD_ANSWER = undefined;
var MESSAGE_CHECK_MORE_QUESTIONS = undefined;
var MESSAGE_WAIT_NEXT_QUESTION = undefined;
var MESSAGE_MESSAGE_GAME_OVER = undefined;


/*** CONSTRUCTOR Game
***/

var Game = function() {
    console.group( "CONSTRUCTOR Game" );

    this.status = GAME_STATUS_INITIALIZED;

    console.groupEnd();
}


// Game
var game;    // [object Game]
