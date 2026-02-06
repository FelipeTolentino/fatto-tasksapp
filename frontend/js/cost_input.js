const input = document.getElementById("task-cost");

input.addEventListener("input", formatCurrency);

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function formatCurrency(e) {
  let value = e.target.value;

  value = value.replace(/\D/g, "");
  
  value = (Number(value) / 100);

  e.target.value = formatter.format(value);
}