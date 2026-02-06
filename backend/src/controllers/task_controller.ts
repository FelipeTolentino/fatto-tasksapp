import type { Request, Response } from "express";
import prisma from  "../prisma.js";
import type { CreateTaskBody, EditTaskBody } from "../types/task.js";

class TaskController {
	async list(req: Request, rest: Response) {
		try {
			const tasks = await prisma.task.findMany({
        orderBy: { order: "asc" }
      });

      rest.json(tasks);
		}
    catch {
      rest.status(500).json({ error: "Erro ao buscar tarefas" });
    }
	}

  async create(req: Request<{}, {}, CreateTaskBody>, res: Response) {
    try {
      const { name, cost, deadline } = req.body;

      if (!name || cost == null || !deadline) {
        return res.status(400).json({ error: "O nome, custo e data limite da tarefa são obrigatórios" });
      } 

      if (cost < 0) {
        return res.status(400).json({ error: "Custo inválido. O custo não pode ser menor do que R$0"});
      }

      const last = await prisma.task.findFirst({
        orderBy: { order: "desc" }
      });

      const newOrder = last ? last.order + 1 : 1;

      const task = await prisma.task.create({
        data: {
          name,
          cost,
          deadline: new Date(deadline),
          order: newOrder
        }
      });

      res.json(task);
    }
    catch (error: any) {
      if (error.code === "P2002") {
        return res.status(400).json({ error: "Já existe uma tarefa com este nome" });
      }

      res.status(500).json({ error: "Erro ao criar a tarefa" });
    }
  }

  async edit(req: Request<{ id: string }, {}, EditTaskBody>, res: Response) {
    try {
      const id = Number(req.params.id);
      const { name, cost, deadline } = req.body;

      if (!name || cost == null || !deadline) {
        return res.status(400).json({ error: "O nome, custo e data limite da tarefa são obrigatórios" });
      } 

      if (cost < 0) {
        return res.status(400).json({ error: "Custo inválido. O custo não pode ser menor do que R$0"});
      }

      const task = await prisma.task.update({
        where: { id },
        data: {
          name,
          cost,
          deadline: new Date(deadline)
        }
      });

      res.json(task);
    }
    catch (error: any) {
      if (error.code === "P2002") {
        return res.status(400).json({ error: "Já existe uma tarefa com este nome" });
      }

      res.status(500).json({ error: "Erro ao criar a tarefa" });
    }
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    try {
      const id = Number(req.params.id);

      await prisma.task.delete({
        where: { id }
      });

      res.json({ message: "Tarefa excluída" });
    }
    catch {
      res.status(500).json({ error: "Erro ao excluir tarefa" });
    }
  }

  async reorder(req: Request, res: Response) {
    try {
      const { tasks } = req.body as { 
        tasks: { id: number; order: number }[];
      };

      const updates = tasks.map(
        task => prisma.task.update({
          where: { id: task.id },
          data: { order: task.order }
        })
      );

      await prisma.$transaction(updates);

      res.json({ message: "Order atualizada" });
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao reordenar tarefas" });
    }
  }
}

export default new TaskController();


