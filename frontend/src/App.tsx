import { createContext, useEffect, useState, ReactNode } from "react";
import TodoApp from "./pages/todoApp";
import { fetchDataFromApi } from "./api/todoApi";
import { Todo } from "./types/todo";

type ContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const MyContext = createContext<ContextType>({
  todos: [],
  setTodos: () => {},
});

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetchDataFromApi<Todo[]>("/todo").then((res) => {
      setTodos(res);
    });
  }, []);

  const values: ContextType = {
    todos,
    setTodos,
  };

  return (
    <MyContext.Provider value={values}>
      <TodoApp />
    </MyContext.Provider>
  );
}

export default App;
export { MyContext };
