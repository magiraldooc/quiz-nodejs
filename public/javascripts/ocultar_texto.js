$(ocultarValue);

function ocultarValue(){
  var value;
  $('input:text').on('focusin', function(){
    value = $(this).val();
    $(this).val('');
  });
  $('input:text').on('focusout', function(){
    if($(this).val() === ''){
      $(this).val(value);
    }
  });
}
