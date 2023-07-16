import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import sortBy from "lodash.sortby";
import omit from "lodash.omit";
import dayjs from "dayjs";
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
const repetitionTable = "repetition";

const repetitionTableRef = collection(db, repetitionTable);
const repetitionRef = (id: string) => doc(db, repetitionTable, id);

import type { RepetitionRecord } from "@/types";

const withId = (item: QueryDocumentSnapshot<DocumentData>): RepetitionRecord =>
  ({ ...item.data(), id: item.id } as RepetitionRecord);
const withoutId = (item: RepetitionRecord): RepetitionRecord => {
  return omit(item, ["id"]);
};

export async function create(
  repetition: RepetitionRecord
): Promise<RepetitionRecord> {
  return addDoc(repetitionTableRef, withoutId(repetition)).then(({ id }) => ({
    ...repetition,
    id,
  }));
}

export async function update(repetition: RepetitionRecord): Promise<void> {
  if (!repetition.id) return;

  return updateDoc(repetitionRef(repetition.id), withoutId(repetition));
}

export async function destroy(repetition: RepetitionRecord): Promise<void> {
  if (!repetition.id) return;

  return deleteDoc(repetitionRef(repetition.id));
}

export function scheduleNextRepetition(repeatCount: number): number | null {
  const interval = [0.5, 1, 2];
  const span = "minute";
  if (repeatCount > interval.length - 1) {
    return null;
  }
  return dayjs().add(interval[repeatCount], span).startOf(span).valueOf();
}

export async function find(
  userId: string,
  moduleId: string
): Promise<RepetitionRecord | null> {
  const response = await getDocs(
    query(
      repetitionTableRef,
      where("userId", "==", userId),
      where("moduleId", "==", moduleId)
    )
  );
  const [first] = response.docs.map(withId);
  return first || null;
}

export async function findOrCreate(
  userId: string,
  moduleId: string
): Promise<RepetitionRecord> {
  const current = await find(userId, moduleId);

  if (current) {
    return current;
  }

  return await create({
    userId,
    moduleId,
    startedAt: dayjs().valueOf(),
    repeatCount: 0,
    scheduledAt: 0,
    finishedAt: 0,
  });
}

export async function start(
  userId: string,
  moduleId: string
): Promise<RepetitionRecord> {

  const current = await find(userId, moduleId);

  if (current) {
    return current;
  }

  return await create({
    userId,
    moduleId,
    startedAt: dayjs().valueOf(),
    repeatCount: 0,
    scheduledAt: scheduleNextRepetition(0) || 0,
    finishedAt: 0,
  });
}

export async function repeat(
  userId: string,
  moduleId: string
): Promise<RepetitionRecord> {
  const current = await findOrCreate(userId, moduleId);

  if (current.finishedAt) {
    return current; // Can't repeat finished
  }

  if (current.scheduledAt && dayjs(current.scheduledAt).isAfter(dayjs())) {
    return current; // Can't repeat before scheduled time
  }

  const patch = (): Partial<RepetitionRecord> => {
    const scheduledAt = scheduleNextRepetition(current.repeatCount);
    if (scheduledAt) {
      return { scheduledAt, repeatCount: current.repeatCount + 1 };
    }
    return { finishedAt: dayjs().valueOf() };
  };

  const updated = { ...current, ...patch() };
  await update(updated);
  return updated;
}

export async function reset(
  userId: string,
  moduleId: string
): Promise<RepetitionRecord | null> {
  const current = await find(userId, moduleId);
  if (!current) {
    return null;
  }

  if (current.finishedAt) {
    return current; // Can't reset finished
  }

  const patch: Partial<RepetitionRecord> = {
    repeatCount: 0,
    scheduledAt: scheduleNextRepetition(0) || 0,
  };

  await update({ ...current, ...patch });
  return current;
}

export async function agenda(userId: string): Promise<RepetitionRecord[]> {
  const now = dayjs().valueOf();

  const response = await getDocs(
    query(
      repetitionTableRef,
      where("userId", "==", userId),
      where("scheduledAt", "<=", now),
      where("finishedAt", "==", 0)
    )
  );
  return sortBy(response.docs.map(withId), ["scheduledAt"]);
}

export async function plan(userId: string): Promise<RepetitionRecord[]> {
  const now = dayjs().valueOf();
  const response = await getDocs(
    query(
      repetitionTableRef,
      where("userId", "==", userId),
      where("scheduledAt", ">", now),
      where("finishedAt", "==", 0)
    )
  );
  return sortBy(response.docs.map(withId), ["scheduledAt"]);
}

export async function history(userId: string): Promise<RepetitionRecord[]> {
  const response = await getDocs(
    query(
      repetitionTableRef,
      where("userId", "==", userId),
      where("finishedAt", "!=", 0)
    )
  );
  return sortBy(response.docs.map(withId), ["finishedAt"]);
}

export async function destroyAll(userId: string): Promise<void> {
  const response = await getDocs(
    query(repetitionTableRef, where("userId", "==", userId))
  );
  const promises = response.docs.map(withId).map(destroy);
  await Promise.all(promises);
}
