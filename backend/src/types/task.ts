export interface CreateTaskBody {
  name: string;
  cost: number;
  deadline: string;
}

export interface EditTaskBody {
  name: string;
  cost: number;
  deadline: string;
}