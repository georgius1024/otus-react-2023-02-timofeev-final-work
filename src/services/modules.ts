import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
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
const modulesTable = "modules";

const modulesTableRef = collection(db, modulesTable);
const moduleRef = (id: string) => doc(db, modulesTable, id);

import type { Module } from "@/types";

const withId = (item: QueryDocumentSnapshot<DocumentData>): Module =>
  ({ ...item.data(), id: item.id } as Module);
const withoutId = (item: Module): Module => {
  const { id, ...rest } = item;
  return rest;
};

export async function fetchAll(parent = ""): Promise<Module[]> {
  const response = await getDocs(
    query(modulesTableRef, where("parent", "==", parent))
  );
  return response.docs.map(withId);
}

export async function fetchOne(id: string): Promise<Module | null> {
  const response = await getDoc(moduleRef(id));
  if (response.exists()) {
    return withId(response);
  }
  return null;
}

export async function create(module: Module): Promise<Module> {
  return addDoc(modulesTableRef, withoutId(module)).then(({ id }) => ({
    ...module,
    id,
  }));
}

export async function update(module: Module): Promise<void> {
  if (!module.id) return;

  return updateDoc(moduleRef(module.id), withoutId(module));
}

export async function destroy(module: Module): Promise<void> {
  if (!module.id) return;

  return deleteDoc(moduleRef(module.id));
}
