const API_URL = "http://api.coindesk.com/v1/bpi/historical/close.json";

$(document).ready(() => {
  initValues();
  listeners();
  loadFinancialData();
});

function initValues () {
  let today = new Date();
  $("#dateTo").val(formatDate(today));
  today.setMonth(today.getMonth() - 1);
  $("#dateFrom").val(formatDate(today));
}

function formatDate (date) {
  let year  = date.getFullYear();
  let month = date.getMonth() + 1;
  let day   = date.getDate();

  if (month.toString().length < 2) { month = "0" + month.toString(); }
  if (day.toString().length < 2)   { day = "0" + day.toString(); }

  return `${year}-${month}-${day}`;
}

function listeners () {
  $("#dateFrom,#dateTo,#currency").on("change", (event) => {
    loadFinancialData();
  });
}

function loadFinancialData () {
  let start    = $("#dateFrom").val();
  let end      = $("#dateTo").val();
  let currency = $("#currency").val();

  $.ajax({
    url: `${API_URL}?start=${start}&end=${end}&currency=${currency}`,
    method: "GET",
    dataType: "json",
    complete: callbackFinancial
  });
}

function callbackFinancial (res) {
  let dpi    = JSON.parse(res.responseText).bpi;
  let labels = [];
  let values = [];
  let data   = [];

  $.each(dpi, (key, value) => {
    data.push({
      x: key,
      y: value
    });
    labels.push(key);
    values.push(value);
  });

  let ctx   = document.getElementById("myChart");
  let chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Bitcoin Price Index",
        data: data
      }]
    }
  });

  let max  = Math.max.apply(null, values);
  let min  = Math.min.apply(null, values);
  let curr = $("#currency").val();

  $(".js-max-value").html(`${max} ${curr}`);
  $(".js-min-value").html(`${min} ${curr}`);
};
