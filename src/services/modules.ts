import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import sortBy from "lodash.sortby";
import omit from "lodash.omit";
// @ts-ignore
import pluck from "lodash.pluck";
// @ts-ignore
import stringSimilarity from 'string-similarity' 

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
  writeBatch,
} from "firebase/firestore";

import { db } from "@/firebase";
const modulesTable = "modules";

const modulesTableRef = collection(db, modulesTable);
const moduleRef = (id: string) => doc(db, modulesTable, id);

import type { Module } from "@/types";

const withId = (item: QueryDocumentSnapshot<DocumentData>): Module =>
  ({ ...item.data(), id: item.id } as Module);
const withoutId = (item: Module): Module => {
  return omit(item, ["id"]);
};

export async function fetchAll(): Promise<Module[]> {
  const response = await getDocs(query(modulesTableRef));
  return response.docs.map(withId);
}
export async function fetchChildren(parent = ""): Promise<Module[]> {
  const response = await getDocs(
    query(modulesTableRef, where("parent", "==", parent))
  );
  return sortBy(response.docs.map(withId), ["position"]);
}

export async function fetchOne(id: string): Promise<Module | null> {
  const response = await getDoc(moduleRef(id));
  if (response.exists()) {
    return withId(response);
  }
  return null;
}

export async function sort(modules: Module[]): Promise<void> {
  if (!modules.length) {
    return;
  }
  const batch = writeBatch(db);
  const promises = modules.map(async (module, index) => {
    if (module.id) {
      const ref = moduleRef(module.id);
      batch.update(ref, { position: index });
    }
  });
  await Promise.all(promises);
  await batch.commit();
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

export function shuffle<T>(list: T[]): T[] {
  return list.sort(() => Math.random() - 0.5)
}

export function similarWords(sample: string, list: string[], count: number) {
  const sorted = list.sort((a, b) => stringSimilarity.compareTwoStrings(b, sample) - stringSimilarity.compareTwoStrings(a, sample))
  return sorted.slice(0, count)
}

export async function findWords(type: "word" | "phrase"): Promise<string[]> {
  const response = await getDocs(
    query(
      modulesTableRef,
      where("type", "==", 'activity'),
      where("activity.type", "==", type)
    )
  );

  return pluck(response.docs.map(withId), `activity.${type}`);
}

export async function findTranslations(type: "word" | "phrase"): Promise<string[]> {
  const response = await getDocs(
    query(
      modulesTableRef,
      where("type", "==", 'activity'),
      where("activity.type", "==", type),
    )
  );
  return pluck(response.docs.map(withId), "activity.translation");
}
