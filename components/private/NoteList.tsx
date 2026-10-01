import { useState, type FormEvent } from "react";
import { privateCopy as copy } from "@/data/private";
import type { Note } from "./api";
import { buttonClass, formatDate, inputClass, panelClass } from "./styles";

type Props = {
  notes: Note[];
  busy: boolean;
  onAdd: (title: string, body: string) => Promise<boolean>;
};

export default function NoteList({ notes, busy, onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await onAdd(title, body)) {
      setTitle("");
      setBody("");
    }
  }

  return (
    <section className={panelClass} aria-labelledby="notes-heading">
      <h2 id="notes-heading" className="text-lg font-bold">{copy.notes}</h2>
      <p className="mt-2 text-sm leading-6 break-keep text-body">{copy.notesHelp}</p>
      {notes.length === 0 ? <p className="mt-6 text-sm text-muted">{copy.emptyNotes}</p> : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {notes.map((note) => (
            <li key={note.id} className="rounded-lg border border-line bg-panel-deep p-5">
              <p className="font-mono text-xs text-muted">{formatDate(note.created_at)}</p>
              <h3 className="mt-2 text-base font-bold break-keep">{note.title}</h3>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 break-keep text-body">{note.body}</p>
            </li>
          ))}
        </ul>
      )}
      <form className="mt-8 space-y-4 border-t border-line pt-6" onSubmit={(event) => void submit(event)}>
        <label className="block text-sm text-body">{copy.noteTitle}
          <input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required />
        </label>
        <label className="block text-sm text-body">{copy.noteBody}
          <textarea className={`${inputClass} min-h-32 py-3`} value={body}
            onChange={(event) => setBody(event.target.value)} maxLength={5000} required />
        </label>
        <button className={buttonClass} disabled={busy} type="submit">{copy.addNote}</button>
      </form>
    </section>
  );
}
