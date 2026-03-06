const input = document.getElementById("task-cost");

input.addEventListener("input", formatCurrency);

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function formatCurrency(e) {
  let value = e.target.value.replace(/\D/g, "");

  if (value.length > 15) value = value.slice(0, 15);

  value = value.padStart(3, '0');

  const intPart = value.slice(0, -2);
  const decPart = value.slice(-2);

  const intCleaned = intPart.replace(/^0+/, "") || "0";

  const intFormated = intCleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  e.target.value = `R$ ${intFormated},${decPart}`;
}