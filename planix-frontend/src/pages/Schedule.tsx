import { useEffect, useMemo, useState} from "react";
import Layout from "../components/layout/Layout";
import { subjectApi } from "../services/api";
import type { Subject } from "../types/subject";
import ScheduleHeader from "../components/ScheduleHeader";
import WeekSchedule from "../components/WeekSchedule";
import ScheduleModals from "../components/ScheduleModals";
import { getWeekType } from "../utils/week";

export default function SchedulePage() {

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeDay, setActiveDay] = useState(1);
  const [weekOffset, setWeekOffset] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [weekType, setWeekType] = useState<"ODD" | "EVEN">("ODD");

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [location, setLocation] = useState("");
  const [teacher, setTeacher] = useState("");

  const [importUrl, setImportUrl] = useState("");

  const currentDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + weekOffset * 7);
    return date;
  }, [weekOffset]);

  const currentWeekType = getWeekType(currentDate);

  const filteredSubjects = subjects
    .filter(
      (s) =>
        s.dayOfWeek === activeDay &&
        s.weekType === currentWeekType
    )
    .sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

  async function loadSubjects() {
    try {
      setLoading(true);
      const data = await subjectApi.getAll();
      setSubjects(data ?? []);
    } catch (e) {
      console.error(e);
      alert("Ошибка загрузки расписания");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubjects();
  }, []);

  function resetForm() {
    setName("");
    setDayOfWeek(1);
    setWeekType("ODD");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setTeacher("");
  }

  function openEditModal(subject: Subject) {
    setEditingSubjectId(subject.id);
    setName(subject.name);
    setDayOfWeek(subject.dayOfWeek);
    setWeekType(subject.weekType);
    setStartTime(subject.startTime);
    setEndTime(subject.endTime);
    setLocation(subject.location || "");
    setTeacher(subject.teacher || "");
    setIsEditModalOpen(true);
  }

  async function handleDelete(id: number) {
    try {
      await subjectApi.delete(id);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error(e);
      alert("Ошибка удаления");
    }
  }

  async function handleClearSchedule() {
    try {
      await subjectApi.clear();
      setSubjects([]);
      setIsClearModalOpen(false);
    } catch (e) {
      console.error(e);
      alert("Ошибка очистки");
    }
  }

  async function handleImport() {
    try {
      await subjectApi.importSchedule(importUrl);
      setImportUrl("");
      setIsImportModalOpen(false);
      await loadSubjects();
    } catch (e) {
      console.error(e);
      alert("Ошибка импорта");
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    try {
      await subjectApi.create({
        name,
        dayOfWeek,
        weekType,
        startTime,
        endTime,
        location,
        teacher
      });

      await loadSubjects();
      resetForm();
      setIsCreateModalOpen(false);

    } catch (e) {
      console.error(e);
      alert("Ошибка создания предмета");
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (!editingSubjectId) return;

    try {
      await subjectApi.update(editingSubjectId, {
        name,
        dayOfWeek,
        weekType,
        startTime,
        endTime,
        location,
        teacher
      });

      await loadSubjects();

      setIsEditModalOpen(false);
      setEditingSubjectId(null);
      resetForm();

    } catch (e) {
      console.error(e);
      alert("Ошибка обновления");
    }
  }

  return (
    <Layout>

      <ScheduleHeader
        currentWeekType={currentWeekType}
        weekOffset={weekOffset}
        setWeekOffset={setWeekOffset}
        setIsImportModalOpen={setIsImportModalOpen}
        setIsClearModalOpen={setIsClearModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />

        <ScheduleModals
        isClearModalOpen={isClearModalOpen}
        setIsClearModalOpen={setIsClearModalOpen}
        handleClearSchedule={handleClearSchedule}

        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        name={name}
        setName={setName}
        dayOfWeek={dayOfWeek}
        setDayOfWeek={setDayOfWeek}
        weekType={weekType}
        setWeekType={setWeekType}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        location={location}
        setLocation={setLocation}
        teacher={teacher}
        setTeacher={setTeacher}
        handleCreate={handleCreate}

        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        handleUpdate={handleUpdate}

        isImportModalOpen={isImportModalOpen}
        setIsImportModalOpen={setIsImportModalOpen}
        importUrl={importUrl}
        setImportUrl={setImportUrl}
        handleImport={handleImport}
        />


      <WeekSchedule
        activeDay={activeDay}
        setActiveDay={setActiveDay}
        filteredSubjects={filteredSubjects}
        loading={loading}
        openEditModal={openEditModal}
        handleDelete={handleDelete}
      />


    </Layout>
  );
}