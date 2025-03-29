import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { Session } from "@supabase/supabase-js";
import { FormEvent, useState } from "react";

type Props = {
  session: Session | null;
  updateDisplayName: (displayName: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
};

const AccountDetails = (props: Props) => {
  const [displayNameChange, setDisplayNameChange] = useState(true);
  const displayName =
    props.session?.user.user_metadata?.full_name ||
    props.session?.user.user_metadata?.name;
  const [newDisplayName, setNewDisplayName] = useState(displayName);

  const handleUpdateDisplayName = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await props.updateDisplayName(newDisplayName);
      setDisplayNameChange(true);
    } catch (error) {
      console.error(error);
    }
  };

  const joinDate = props.session?.user.created_at
    ? new Date(props.session?.user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      <h1 className="text-sm md:text-lg font-medium text-white">Details</h1>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-xs md:text-sm" htmlFor="userEmail">
          Email
        </label>

        <div className="relative ">
          <Input
            id="userEmail"
            value={props.session?.user.email}
            className="text-black bg-white text-xs md:text-sm pl-6 md:pl-10 md:py-6 border-[1.75px] border-background-500 hover:border-accent-400 focus:border-accent-400 transition-all"
            disabled
          />
          <div className="absolute inset-y-0 left-0 pl-2 md:pl-3 flex items-center">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-black opacity-50 text-sm md:text-base"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="font-medium text-xs md:text-sm"
          htmlFor="userDisplayName"
        >
          Display Name
        </label>

        <div className="relative ">
          <Input
            id="userDisplayName"
            defaultValue={
              props.session?.user.user_metadata?.full_name ||
              props.session?.user.user_metadata?.name
            }
            onChange={(e) => {
              const newValue = e.target.value;
              setNewDisplayName(newValue);
              setDisplayNameChange(displayName === newValue);
            }}
            className="text-black bg-white text-xs md:text-sm pl-6 md:pl-10 md:py-6 border-[1.75px] border-background-500 hover:border-accent-400 focus:border-accent-400 transition-all"
          />
          <div className="absolute inset-y-0 left-0 pl-2 md:pl-3 flex items-center">
            <FontAwesomeIcon
              icon={faUser}
              className="text-black opacity-50 text-sm md:text-base"
            />
          </div>
        </div>
      </div>

      <Button
        className="self-end bg-accent-500 hover:bg-accent-600 font-medium transition-all"
        type="submit"
        size={"sm"}
        disabled={displayNameChange}
        onClick={handleUpdateDisplayName}
      >
        Update
      </Button>

      <span className="text-xs self-end text-background-300">
        Joined {joinDate}
      </span>
    </>
  );
};

export default AccountDetails;
