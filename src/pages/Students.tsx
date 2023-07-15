import { useEffect, useState, useCallback } from "react";
import * as users from "@/services/users";

import Placeholder from "@/components/Placeholder";
import Trash from "@/components/icons/Trash";

import type { User } from "@/types";

export default function StudentsPage() {
  const [loading, setLoading] = useState<boolean | null>(null);
  const [students, setStudents] = useState<User[]>([]);

  const loadAll = useCallback(async () => {
    const students = await users.fetchAll();
    setStudents(students);
  }, []);

  useEffect(() => {
    setLoading(true);
    loadAll()
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [loadAll]);

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="row mt-3">
          <div className="col">
            <Placeholder height="24px" rounded />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <Placeholder height="24px" rounded />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <Placeholder height="24px" rounded />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <Placeholder height="24px" rounded />
          </div>
        </div>
      </div>
    );
  }

  const studentList = students.map((student) => {
    return (
      <div
        className="list-group-item module-item d-flex align-items-center"
        key={student.uid}
      >
        <div className="flex-grow-1">{student.name}</div>
        <div>{student.email}</div>

        <span className="badge bg-danger ms-3">
          <Trash />
        </span>
      </div>
    );
  });
  return (
    <div className="container-fluid">
      <h1>Students</h1>
      <div className="list-group list-group-flush modules-tree-panel auth-select-none">
        {studentList}
      </div>
    </div>
  );
}
