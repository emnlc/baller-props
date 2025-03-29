import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

const ConfirmEmail = () => {
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/nba");
      }
    };

    checkUserSession();
  }, [navigate]);

  const resendEmail = async () => {
    if (!email) {
      setMessage("Email not found. Please sign up again.");
      return;
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    if (error) {
      setMessage("Failed to resend confirmation email. Try again later.");
    } else {
      setMessage(`A new confirmation email has been sent to ${email}`);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold">Confirm Your Email</h2>
        <p>
          Please check your email{email ? ` (${email})` : ""} to verify your
          account.
        </p>
        <button
          onClick={resendEmail}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Resend Confirmation Email
        </button>
        {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
        <Link to="/login" className="mt-4 text-blue-500">
          Go to Login
        </Link>
      </div>
    </>
  );
};

export default ConfirmEmail;
