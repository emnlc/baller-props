import { UserAuth } from "@/context/AuthContext";
import { FormEvent, useState } from "react";

import AccountDetails from "./AccountDetails";

import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

const Account = () => {
  const { session, updateDisplayName, userSignOut } = UserAuth();
  const navigate = useNavigate();

  const [section, setSection] = useState<"Details" | "Security">("Details");

  const handleSignOut = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await userSignOut();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="max-w-2xl flex flex-col min-h-[90svh] justify-center mx-2 md:mx-auto">
        <div className="rounded-lg min-h-96 max-h-96 w-full flex flex-row">
          {/* Options sidebar */}
          <div className="account-options bg-background-800 min-w-fit p-4 py-8 md:p-8 rounded-tl-xl rounded-bl-xl">
            <div className="flex flex-col justify-between h-full items-start gap-4 text-xs md:text-sm text-background-300">
              <div className="flex flex-col items-start gap-4">
                <h1 className="text-sm md:text-lg font-medium text-white">
                  Account Settings
                </h1>
                <button
                  className={`hover:text-white transition-colors ${
                    section === "Details" ? "text-white font-medium" : ""
                  }`}
                  onClick={() => setSection("Details")}
                >
                  Details
                </button>
                {/* TODO: password / security sections & components */}
                {/* <button
                  className={`hover:text-white transition-colors ${
                    section === "Security" ? "text-white font-medium" : ""
                  }`}
                  onClick={() => setSection("Security")}
                >
                  Security
                </button> */}
              </div>

              <Button
                className="bg-background-500 hover:bg-background-600 transition-colors w-full"
                size={"sm"}
                onClick={handleSignOut}
              >
                Sign out
              </Button>
            </div>
          </div>

          {/* buttons / inputs */}
          <form className="flex flex-col gap-4 justify-between w-full py-8 px-3 md:p-8 bg-background-900/50 rounded-tr-xl rounded-br-xl">
            {section === "Details" ? (
              <AccountDetails
                session={session}
                updateDisplayName={updateDisplayName}
              />
            ) : (
              ""
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Account;
