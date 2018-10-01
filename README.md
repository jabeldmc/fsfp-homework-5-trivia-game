# Full Stack Flex Program Homework 05: Trivia Game

A trivia game built using HTML5, Bootstrap, and JQuery.

The questions and optional answers are such to make the game a Japanese
vocabulary review.


# Portfolio

Game is available in the
[responsive](https://jabeldmc.github.io/fsfp-homework-2-responsive-portfolio/portfolio.html)
and
[Bootstrap](https://jabeldmc.github.io/fsfp-homework-2-bootstrap-portfolio/portfolio.html)
portfolio.


# Technical Details

Game flow is implemented with a Finite State Automaton (FSA). On each "step",
the FSA decides what to do next based on the following:

* Game status
* Event type (given by event handler callback function)
* Event target (given by event handler callback function)
* Game timer (for timeout events)

After every user interaction, the FSA main loop repeats "steps" until no
criteria is met to continue, or the loop is interrupted by the flag
`FSA_CONTINUE__NO`.

UI updates after every FSA step. To do so, the FSA main loop calls the main UI
function as a callback.


## Variables and Functions

Functions with name prefix `handle` are event handler callback functions.

Functions with prefix `updateUI` use jQuery functions to update the DOM.

Constructor `Game` creates a new game with a clean state.

Variables with prefix `GAME_STATUS` help identify game state.

Constructor `Trivia` helps create trivia questions.

Constructors with prefix `GAME_MESSAGE` help create messages using
string replacement.

Functions with prefix `game` are game actions executed by the FSA. They could be
methods in objects of type `Game`.

Function `gameFsaStep()` implements one step of the FSA.

Function `gameFsaMain()` is the main FSA loop.

Variables `FSA_CONTINUE__NO` and `FSA_CONTINUE__YES` determine if the FSA loop
should stop or continue.


# To Do

* Create dark mode.
* Make UI responsive.
* Move all game logic into its own module (`TriviaGame.js`).


# History


## Build 5

* Dynamically generate trivia questions from a question dictionary. Question
  order, incorrect answers, and order of answers to a question are selected
  randomly.
* Separated all game logic from UI logic.
* Dynamically change background color of messages for correct and incorrect
  answer (JQuery + Bootstrap CSS classes).
* Tweaks on messages, UI, and game logic.


## Build 4

* Dynamically change background color of timer (JQuery + Bootstrap CSS classes).


## Build 3

* Finished UI (Bootstrap).
* Tweaks on messages.


## Build 2

* Game is functionally complete; need to finish UI.
    * Finished game logic. Game flow is now 100% in the FSA.
    * Finished game actions.
    * Finished event handlers.
    * Finished functions to update UI.


## Build 1

* Game FSA is complete up to asking a question and counting time.
* Basic UI (HTML).
