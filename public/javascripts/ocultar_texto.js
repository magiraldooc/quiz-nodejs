$(ocultarInputValue);

function ocultarInputValue(){
  $('input:text').one('focusin', function(){
    if($(this).val() === $(this).attr('value')){
      $(this).val('');
    }
  });

  $('input:submit').on('click', function(){
    $('form').find(':input').each(function(){
      if($(this).val() === $(this).attr('value')){
        $(this).val('')
      }
    });
  });
}
