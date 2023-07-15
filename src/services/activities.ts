import type { Activity } from "@/types";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/firebase";

export async function fetchActivities(lesson:  Auth): Promise<Todo[]> {
  const todosRef = collection(db, "todos");
  const response = await getDocs(
    query(
      todosRef,
      where("uid", "==", user.uid),
    )
  );
  return response.docs.map((e) => ({ ...(e.data() as Todo), id: e.id }));
}

export async function fetchTodo(user: Auth, id: string): Promise<Todo | null> {
  const todoRef = doc(db, "todos", id);
  const response = await getDoc(todoRef);
  if (response.exists()) {
    return { ...(response.data() as Todo), id: response.id };
  }
  return null;
}

export async function addTodo(todo: Todo): Promise<Todo> {
  return addDoc(collection(db, "todos"), todo).then(({ id }) => ({
    ...todo,
    id,
  }));
}

export async function updateTodo(todo: Todo): Promise<void> {
  if (!todo?.id) return;
  return updateDoc(doc(db, "todos", todo.id), { ...todo });
}

export async function deleteTodo(todo: Todo): Promise<void> {
  if (todo?.id) {
    await deleteDoc(doc(db, "todos", todo.id));
  }
}
