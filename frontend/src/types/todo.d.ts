export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  attachments?: {
    id: string;
    name: string;
    url: string;
  }[];
};