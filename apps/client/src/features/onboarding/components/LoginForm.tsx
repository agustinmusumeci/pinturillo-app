import { useState, type SubmitEventHandler } from "react";

export default function LoginForm({ onSubmit }: { onSubmit: (name: string) => Promise<boolean> }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.target);

    const name = formData.get("name")?.toString() ?? "";

    if (!name) return;

    onSubmit(name).then((res) => {
      if (!res) {
        setError(true);
      }

      setLoading(false);
    });
  };

  return (
    <section>
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label htmlFor="name">Name</label>
          <input
            required
            name="name"
            id="name"
            type="text"
            className="border border-gray-400 w-fit"
            maxLength={20}
            minLength={1}
          />
        </div>
        <button
          type="submit"
          disabled={loading ? true : false}
          className="w-fit bg-gray-200 px-10 py-1 rounded-md"
        >
          {loading ? "Joining..." : "Join"}
        </button>
        {error && <span className="text-red-500">An error just happened. Try again!</span>}
      </form>
    </section>
  );
}
