$( document ).ready( function() {
    
  $( '.info-btn' ).click( function( event ) {
    $( '.info-panel, .site-header' ).toggleClass( 'active' );
  });

  $( '.go-btn, .branding' ).click( function( event ) {
    $( '.map-panel' ).toggleClass( 'active' );
  });

});