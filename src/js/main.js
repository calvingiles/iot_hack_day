$( document ).ready( function() {

  // Go back to main when clicking header
  $( 'header' ).click( function( event ) {
    $( '.main, header' ).toggleClass( 'active' );
  });

});