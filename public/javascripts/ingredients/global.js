// Userlist data array for filling in info box
var ingredientListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the user table on initial page load
  populateTable();

});

// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/ingredients/ingredientlist', function( data ) {

    ingredientListData = data;

    console.log(data);

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      if (this.photoname) {
        tableContent += '<td><img class="ingredientPhoto" src="/uploads/photos/ingredients/'+ this.photoname +'" alt="" /></td>';
      }else{
        tableContent += '<td>Photo</td>';
      }
      tableContent += '<td>' + this.name + '</td>';
      tableContent += '<td>' + this.category + '</td>';
      tableContent += '<td>' + this.calories + '</td>';
      tableContent += '<td><a href="#" class="genric-btn info-border circle small linkUpdateIngredient" rel="' + this._id + '" style="padding:0px 10px;margin-right:10px;" ><span class="fa fa-edit"></span></a><a href="#" class="genric-btn danger-border circle small linkDeleteIngredient" rel="' + this._id + '" style="padding:0px 10px;" ><span class="fa fa-times"></span></a></td>'
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#ingredientList tbody').html(tableContent);
  });
};



$('#btnShowAddIngredient').on('click', function(){
  $("#divAddIngredient").show();
});

// Add User button click
$('#btnAddIngredient').on('click', addIngredient);


// Add User
function addIngredient(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addIngredient input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all user info into one object
    var newIngredient = {
      'name': $('#addIngredient input#inputName').val(),
      'category': $('#addIngredient input#inputCategory').val(),
      'calories': $('#addIngredient input#inputCalories').val()
    }


    console.log($('#formAddIngredient').serialize());


      $('#formAddIngredient').ajaxSubmit({
        error: function(xhr) {
          status('Error: ' + xhr.status);
        },

        success: function(response) {
        $("#status").empty().text(response);
          console.log(response);

          // Clear the form inputs
          $('#addIngredient input').val('');

          // Update the table
          populateTable();
          $("#divAddIngredient").hide();
        }
      });


    // Use AJAX to post the object to our adduser service
    /*$.ajax({
      type: 'POST',
      data: $('#formAddIngredient').serialize(),
      url: '/ingredients/addingredient',
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#addIngredient input').val('');

        // Update the table
        populateTable();
        $("#divAddIngredient").hide();

      }
      else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

      }
    });*/

  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
};



// Delete User link click
$('#ingredientList tbody').on('click', 'td a.linkDeleteIngredient', deleteIngredient);


// Delete user function
function deleteIngredient(event){
  event.preventDefault();

  var confirmation = confirm('Etes-vous sûr de vouloir supprimer cet ingredient?');

  if (confirmation == true) {
      
    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'DELETE',
      url: '/ingredients/deleteingredient/'+$(this).attr('rel'),
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Update the table
        populateTable();

      }
      else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

      }
    });

  }else{
    return false;
  }

}


// btn show form update
$('#ingredientList tbody').on('click', 'td a.linkUpdateIngredient', populateUpdateIngredient);

function populateUpdateIngredient(event){
  event.preventDefault();

  $('#divUpdateIngredient').show();

  // Retrieve username from link rel attribute
  var thisIngredientId = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = ingredientListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisIngredientId);

  // Get our User Object
  var thisIngredientObject = ingredientListData[arrayPosition];

  //Populate Info Box
  $('#inputUpdateName').val(thisIngredientObject.name);
  $('#inputUpdateCategory').val(thisIngredientObject.category);
  $('#inputUpdateCalories').val(thisIngredientObject.calories);

  $('#btnUpdateIngredient').attr('rel', thisIngredientObject._id);

}



// Update Ingredient button click
$('#btnUpdateIngredient').on('click', updateIngredient);

function updateIngredient(event){
  event.preventDefault();

  var errorCount = 0;
  $('#updateIngredient input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure 
  if (errorCount == 0) {
    var updateIngredient = {
      'name': $('input#inputUpdateName').val(),
      'category': $('input#inputUpdateCategory').val(),
      'calories': $('input#inputUpdateCalories').val()
    }


    $.ajax({
      type: 'PUT',
      data: updateIngredient,
      url: '/ingredients/updateingredient/'+$(this).attr('rel'),
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#updateIngredient input').val('');
        $('#divUpdateIngredient').hide();

        // Update the table
        populateTable();

      }
      else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

      }
    });


  }else{
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
  
}







