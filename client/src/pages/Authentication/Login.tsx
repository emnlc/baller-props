import { UserAuth } from "@/context/AuthContext";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Error signing in");
  const [loading, setLoading] = useState(false);

  const { session, userSignIn, userGoogleSignIn, userDiscordSignIn } =
    UserAuth();

  useEffect(() => {
    if (session) {
      navigate("/nba");
    }
  }, [session, navigate]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await userSignIn(email, password);

    if (result.success) {
      navigate(`/nba`);
    } else {
      setError(true);
      setErrorMsg(result.error || "An error occurred");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-6 md:gap-12 px-8 md:px-0 w-full max-w-sm"
      >
        <p className="text-xl font-medium">
          Log in to{" "}
          <Link
            to={"/"}
            className="font-semibold text-xl hover:text-accent-400 transition-all"
          >
            Baller Props
          </Link>
        </p>
        <div className="flex flex-col gap-2">
          <label className="font-medium" htmlFor="userEmail">
            Email
          </label>
          <div className="relative">
            <Input
              onChange={(e) => setEmail(e.target.value)}
              className="text-black bg-white text-sm pl-10 py-6 border-[1.75px] border-background-500 hover:border-accent-400 focus:border-accent-400 transition-all"
              placeholder="your@email.address"
              id="userEmail"
              type="email"
            />

            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium" htmlFor="userPassword">
            Password
          </label>
          <div className="relative">
            <Input
              onChange={(e) => setPassword(e.target.value)}
              className="text-black bg-white text-sm pl-10 py-6 border-[1.75px] border-background-500 hover:border-accent-400 focus:border-accent-400 transition-all"
              placeholder="Your secret password"
              id="userPassword"
              type="password"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <FontAwesomeIcon icon={faLock} className="text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <Button
            type="submit"
            disabled={loading}
            size={"default"}
            className="bg-accent-400 hover:bg-accent-500 text-sm py-6"
          >
            Log in
          </Button>
          {error && <p className="text-red-500 text-xs">{errorMsg}</p>}
        </div>

        <div className="flex items-center w-full">
          <hr className="flex-grow border-t border-gray-400" />
          <span className="px-2 text-sm text-gray-400 font-medium">OR</span>
          <hr className="flex-grow border-t border-gray-400" />
        </div>

        <div className="flex flex-row justify-center items-center gap-8">
          <Button
            onClick={userGoogleSignIn}
            className="py-8 rounded-full bg-background-900 hover:bg-background-800 transition-colors"
          >
            <img src="/providers/google.svg" className="w-8" />
          </Button>

          <Button
            onClick={userDiscordSignIn}
            className="py-8 rounded-full bg-background-900 hover:bg-background-800 transition-colors"
          >
            <img src="/providers/discord.svg" className="w-8" />
          </Button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-sm">
            Don't have an account yet?{" "}
            <Link
              className="text-accent-400 hover:text-accent-500 transition-all font-semibold"
              to={"/signup"}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
