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
        var valueString = value.toString();
    }
    else if ( typeof value === "boolean" ) {
        var typeString = ( "[" + ( typeof value ) + "]" );
        var valueString = value.toString();
    }
    else if ( typeof value === "string" ) {
        var typeString = ( "[" + ( typeof value ) + "]" );            
        var valueString = ( "\"" + value + "\"" );
    }
    else if ( value === null ) {
        var typeString = Object.prototype.toString.call( value );
        var valueString = "null";
    }
    else if ( value === undefined ) {
        var typeString = Object.prototype.toString.call( value );
        var valueString = "undefined";;
    }
    else {
        var typeString = Object.prototype.toString.call( value );
        if ( typeString === "[object Object]" ) {
            typeString = "[object " + value.constructor.name + "]"
        }
        var valueString = value;
        // var valueString = JSON.parse( JSON.stringify( value ) );
    }
    console.log(
        typeString ,
        label ,
        ":" ,
        valueString
    );
}


/*** OBJECT jdcUtil
***/


var jdcUtil = {
    

    /*** FUNCTION getRandomNumber()
    ***/
    
    getRandomNumber: function( cardinality ) {
        var result = ( Math.floor( Math.random() * cardinality ) );
        return result;
    }
}

