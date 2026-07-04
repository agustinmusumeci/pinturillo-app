import { useSocket } from "../../shared/hooks/useSocket";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  const { createPlayer } = useSocket();

  const onSumbit = (name: string) => {
    createPlayer(name);
  };

  return (
    <section className="w-full">
      <LoginForm onSubmit={onSumbit} />
    </section>
  );
}
