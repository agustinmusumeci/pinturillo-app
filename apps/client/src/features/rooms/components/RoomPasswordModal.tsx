import type { SubmitEventHandler } from "react";
import type { HandleJoinWithPasswordFn } from "../RoomsPage";

export default function RoomPasswordModal({
  active = false,
  handlePasswordSubmit = () => {},
  handleCancelPassword = () => {},
}: {
  active: boolean;
  handlePasswordSubmit: HandleJoinWithPasswordFn;
  handleCancelPassword: () => void;
}) {
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const password = formData.get("password");

    if (typeof password !== "string") return;

    handlePasswordSubmit(password);
  };

  if (active)
    return (
      <div className="absolute top-0 left-0 w-full h-full pointer-events-auto bg-black/80">
        <div className="absolute w-fit h-fit top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 flex flex-col gap-8 bg-white">
          <p className="font-semibold text-xl">Password is required</p>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col">
              <label htmlFor="">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="border"
                required
              />
            </div>
            <div className="flex flex-row justify-between gap-2">
              <button
                type="submit"
                className="border px-5 grow"
              >
                Join
              </button>
              <button
                type="button"
                className="border px-5"
                onClick={handleCancelPassword}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}
