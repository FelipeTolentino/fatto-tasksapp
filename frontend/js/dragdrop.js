function initDragAndDrop() {
  const tasks = document.getElementById("tasks-list");

  if (!tasks) return;

  new Sortable(tasks, {

    animation: 150,
    ghostClass: "opacity-150",
    chosenClass: "scale-101",

    async onEnd() {
      await updateTasksOrder();
    }
  });
}

async function updateTasksOrder() {
  const tasks = document.getElementById("tasks-list");

  const cards = [...tasks.children];

  const newOrder = cards.map((card, index) => ({
    id: Number(card.dataset.id),
    order: index + 1
  }));

  try {
    await saveTasksOrder(newOrder);
  }
  catch (error) {
    console.error("Erro ao atualizar ordem", error);
  }
}