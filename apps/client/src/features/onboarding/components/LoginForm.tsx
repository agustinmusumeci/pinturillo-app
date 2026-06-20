import type { SubmitEventHandler } from "react";
import { useSocket } from "../../../shared/hooks/useSocket";

export default function LoginForm() {
  const { createPlayer } = useSocket();

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const name = formData.get("name")?.toString() ?? "";

    if (!name) return;

    createPlayer(name);
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
          className="w-fit bg-gray-200 px-10 py-1 rounded-md"
        >
          Join
        </button>
      </form>
    </section>
  );
}
