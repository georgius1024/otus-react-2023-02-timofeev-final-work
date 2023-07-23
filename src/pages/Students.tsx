import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import * as users from "@/services/users";
import * as progress from "@/services/progress";
import * as repetition from "@/services/repetition";

import useBusy from "@/utils/BusyHook";

import GenericLoadingState from "@/components/GenericLoadingState";

import Trash from "@/components/icons/Trash";

import type { User } from "@/types";

export default function StudentsPage() {
  const [loading, setLoading] = useState<boolean | null>(null);
  const [students, setStudents] = useState<User[]>([]);

  const busy = useBusy()
  const { t } = useTranslation();

  const loadAll = useCallback(async () => {
    const students = await users.fetchAll();
    setStudents(students);
  }, []);

  useEffect(() => {
    setLoading(true);
    loadAll()
      .finally(() => setLoading(false));
  }, [loadAll]);

  if (loading) {
    return <GenericLoadingState/>;
  }

  const deleteUserData = (uid: string) => {
    busy(true)
    Promise.all([
      progress.destroyAll(uid),
      repetition.destroyAll(uid),
    ]).then(() => busy(false))
  }

  const studentList = students.map((student) => {
    return (
      <div
        className="list-group-item module-item d-flex align-items-center"
        key={student.uid}
      >
        <div className="flex-grow-1">{student.name}</div>
        <div>{student.email}</div>

        <span className="badge bg-danger ms-3" onClick={() => deleteUserData(student.uid)}>
          <Trash />
        </span>
      </div>
    );
  });
  return (
    <div className="container-fluid mt-4">
      <h1>{t("StudentsPage.title")}</h1>
      <div className="list-group list-group-flush modules-tree-panel auth-select-none">
        {studentList}
      </div>
    </div>
  );
}
