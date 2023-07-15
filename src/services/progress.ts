import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import omit from "lodash.omit";
// @ts-ignore
//import pluck from "lodash.pluck";

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/firebase";
const progressTable = "progress";

const progressTableRef = collection(db, progressTable);
const progressRef = (id: string) => doc(db, progressTable, id);

import type { ProgressRecord } from "@/types";

const withId = (item: QueryDocumentSnapshot<DocumentData>): ProgressRecord =>
  ({ ...item.data(), id: item.id } as ProgressRecord);
const withoutId = (item: ProgressRecord): ProgressRecord => {
  return omit(item, ["id"]);
};

export async function create(
  progress: ProgressRecord
): Promise<ProgressRecord> {
  return addDoc(progressTableRef, withoutId(progress)).then(({ id }) => ({
    ...progress,
    id,
  }));
}

export async function update(progress: ProgressRecord): Promise<void> {
  if (!progress.id) return;

  return updateDoc(progressRef(progress.id), withoutId(progress));
}

export async function destroy(progress: ProgressRecord): Promise<void> {
  if (!progress.id) return;

  return deleteDoc(progressRef(progress.id));
}

export async function find(
  userId: string,
  moduleId: string
): Promise<ProgressRecord | null> {
  const response = await getDocs(
    query(
      progressTableRef,
      where("userId", "==", userId),
      where("moduleId", "==", moduleId)
    )
  );
  const [first] = response.docs.map(withId);
  return first || null;
}

export async function destroyAll(userId: string): Promise<void> {
  const response = await getDocs(
    query(
      progressTableRef,
      where("userId", "==", userId)
    )
  );
  const promises = response.docs.map(withId).map(destroy);
  await Promise.all(promises)
}
