import { useNavigate } from "react-router";
import { useSocket } from "../../shared/hooks/useSocket";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  const { createPlayer } = useSocket();
  const navigate = useNavigate();

  const onSumbit = async (name: string) => {
    const res = await createPlayer(name);

    if (res) {
      navigate("/rooms");
    }

    return res;
  };

  return (
    <section className="w-full">
      <LoginForm onSubmit={onSumbit} />
    </section>
  );
}
