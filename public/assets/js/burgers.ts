import * as $ from 'jquery';

$(function() {
  var currentBurger;

  $('#myModal').on('shown.bs.modal', function () {
    currentBurger = $(this).siblings('input').val();
    $('#myInput').trigger('focus');
  });

  $('.create-btn').on('click', function (event) {
    event.preventDefault();

    var nameInput = $(this).siblings('[name=burger_name]').val();
    if (nameInput) {
      var burgerInfo = {
        burger_name: nameInput,
      };
      console.log(burgerInfo);
      $.ajax({
        method: 'POST',
        url: '/api/burgers/create',
        data: burgerInfo,
      }).then(function (data) {
        // reload page to display devoured burger in proper column
        location.reload();
      });
    }
  });

  $('.devour-form').on('submit', function (event) {
    event.preventDefault();
    var burgerInfo = {
      burger_id: currentBurger,
      customer: $(this).children('.custom-input').val(),
    };

    console.log(burgerInfo);

    $.ajax({
      method: 'PUT',
      url: '/api/burgers/update',
      data: burgerInfo,
    }).then(function (data) {
      // reload page to display devoured burger in proper column
      location.reload();
    });
  });

  $(".delete-burger").on("click", function(event) {
    var id = $(this).data("id");

    // Send the DELETE request.
    $.ajax("/api/burgers/" + id, {
      type: "DELETE"
    }).then(
      function() {
        console.log("deleted burger", id);
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });
});
