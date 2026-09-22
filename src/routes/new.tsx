import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { EntryForm } from "@/components/entry-form";
import { createEntryFn } from "@/lib/lab.functions";

export const Route = createFileRoute("/new")({
  component: NewEntry,
});

function NewEntry() {
  const navigate = useNavigate();
  return (
    <main className="mx-auto w-full max-w-2xl">
      <EntryForm
        submitLabel="PUT"
        onSubmit={async (data) => {
          const created = await createEntryFn({ data });
          await navigate({ to: "/entries/$slug", params: { slug: created.slug } });
        }}
      />
    </main>
  );
}
