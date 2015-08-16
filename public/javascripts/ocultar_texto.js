$(ocultarInputValue);

function ocultarInputValue(){
  $('input:text').one('focusin', function(){
    if($(this).val() === $(this).attr('value')){
      $(this).val('');
    }
  });
}
