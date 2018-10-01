/*** FUNCTION Array.equals()
***/

if ( Array.prototype.equals ) {
    console.warn( "Overriding existing implementation of `Array.prototype.equals()`." );
}
Array.prototype.equals = function( other ) {
    return (
        ( this.length === other.length ) &&
        this.every(
            ( element , index ) => {
                return element === other[ index ];
            }
        )
    )
}


/*** FUNCTION console.logValue()
***/

if ( console.logValue ) {
    console.warn( "Overriding existing implementation of `console.logValue()`." );
}
console.logValue = function( label , value ) {
    if ( typeof value === "number" ) {
        var typeString = ( "[" + ( typeof value ) + "]" );
        // var valueString = value.toString();
    }
    else if ( typeof value === "boolean" ) {
        var typeString = ( "[" + ( typeof value ) + "]" );
        // var valueString = value.toString();
    }
    else if ( typeof value === "string" ) {
        var typeString = ( "[" + ( typeof value ) + "]" );
        // var valueString = ( "\"" + value + "\"" );
    }
    else if ( value === null ) {
        var typeString = Object.prototype.toString.call( value );
        // var valueString = "null";
    }
    else if ( value === undefined ) {
        var typeString = Object.prototype.toString.call( value );
        // var valueString = "undefined";
    }
    else {
        var typeString = Object.prototype.toString.call( value );
        if ( typeString === "[object Object]" ) {
            typeString = "[object " + value.constructor.name + "]"
        }
        // var valueString = JSON.stringify( value );g
        var value = JSON.parse( JSON.stringify( value ) );
    }
    console.log(
        typeString ,
        label ,
        value
    );
}


/*** OBJECT jdcUtil
***/


var jdcUtil = {


    /*** FUNCTION getRandomNumber()
    ***/

    getRandomNumber : function( cardinality ) {
        // console.group( "jdcUtil.getRandomNumber()" );
        // console.logValue( "cardinality" , cardinality );

        var randomNumber = ( Math.floor( Math.random() * cardinality ) );
        return randomNumber;

        // console.logValue( "cardinality" , cardinality );
        // console.groupEnd();
    } ,

    getRandomNumbers : function( length , cardinality , flagUnique ) {
        // console.group( "jdcUtil.getRandomNumbers()" );
        // console.logValue( "cardinality" , cardinality  );
        // console.logValue( "length" , length );
        // console.logValue( "flagUnique" , flagUnique );

        flagUnique = ( ( flagUnique !== undefined ) && ( flagUnique === true ) );
        // console.logValue( "flagUnique" , flagUnique );

        // check unique flag
        if ( flagUnique === false ) {
            // allow duplicate numbers
            var randomNumbers = [];

            for (
                var randomNumberCount = 0 ;
                randomNumberCount < length ;
                randomNumberCount++
            ) {
                var randomNumber = this.getRandomNumber( cardinality );
                randomNumbers.push( randomNumber );
            }
        }
        else if (
            ( flagUnique === true ) &&
            ( cardinality >= length )
        ) {
            // numbers should be unique
            var randomNumbers = [];
            var blackList = [];

            for (
                var randomNumberCount = 0 ;
                randomNumberCount < length ;
                randomNumberCount++
            ) {
                var randomNumber = this.getRandomNumber( cardinality );

                // ensure unique value
                while( blackList.indexOf( randomNumber ) > -1 ) {
                    randomNumber++;

                    // go "around the clock"
                    if ( randomNumber === cardinality ) {
                        randomNumber = 0;
                    }
                }

                randomNumbers.push( randomNumber );
                blackList.push( randomNumber );
            }
        }

        // console.logValue( "randomNumbers" , randomNumbers );
        // console.groupEnd();
        return randomNumbers;
    }
}

