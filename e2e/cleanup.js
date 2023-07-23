import {
  collection,
  doc,
  writeBatch,
  getDocs,
  query,
} from "firebase/firestore";

import { db } from "../src/firebase";

async function clearTable(tableName) {
  async function findAll() {
    const tableRef = collection(db, tableName);
    const response = await getDocs(query(tableRef));
    const takeId = (item) => item.id;
    return response.docs.map(takeId).filter(Boolean);
  }
  async function deleteAll(ids) {
    const tableRef = (id) => doc(db, tableName, id);
    const batch = writeBatch(db);
    const promises = ids.map(async (id) => {
      const ref = tableRef(id);
      batch.delete(ref);
    });
    await Promise.all(promises);
    await batch.commit();
  }
  const all = await findAll();
  return deleteAll(all);
}

export default async function cleanup() {
  const tables = ["modules", "users", "progress", "repetition"];
  //const tables = ["progress", "repetition"];
  //const tables = [];

  const promises = tables.map((table) => clearTable(table));

  return Promise.all(promises);
}
