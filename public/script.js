const getExpenses = () => {
  $.ajax({
    method: 'GET',
    dataType: 'json',
    url: '/expenses',
    success: function (data) {
      console.log('Expenses returned successfully!');
    },
    error: function (error) {
      console.error('There was some kind of error.');
    }
  });
};


$('#submit-expense').on('submit', (e) => {
  e.preventDefault();

  let data = {};
  $('.form-field').each((index, formField) => {
    data[$(formField).attr('name')] = $(formField).val();
  });

  $.ajax({
    method: 'POST',
    dataType: 'json',
    url: '/expenses',
    data: data,
    success: function (data) {
      console.log('Expense was sent successfully.', data);
      loadExpenses();
    },
    error: function (error) {
      console.error('There was some kind of error.', error);
    }
  });
});


// Highlight expenses that match the selected category
$('#category-highlight').on('change', (e) => {
  $('#expenses-data').find('tr').removeClass('highlighted'); // remove any existing highlights
  const selectedCategory = $(e.currentTarget).val();
  const matches = $('#expenses-data').find(`tr.${selectedCategory}`);
  matches.each((index, match) => {
    $(match).addClass('highlighted');
  });
});

$(document).ready(() => {
  loadExpenses();
});
