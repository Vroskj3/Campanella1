import React, { useState } from "react";
import { Icon } from "@blueprintjs/core";
import classNames from "classnames";
import { trpc } from "./utils/trpc";
import { date } from "zod";
import RuleDialog from "./ruleDialog";

export default function HomePage() {
  const [isBellRinging, setBellRinging] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const utils = trpc.useContext();
  const { isLoading, isError, data, error } = trpc.ringSchedule.useQuery();
  const ringSchedule = data;
  console.log(ringSchedule);
  const addRule = trpc.addBellRule.useMutation();
  const okk = trpc.emptyDatabase.useMutation();
  function ok() {
    console.log("OK");
    okk.mutate("ringSchedule", {
      onSuccess() {
        utils.invalidate();
      },
    });
  }
  return (
    <div className="flex p-6 h-full gap-4">
      <div className="flex flex-col">
        <button className="flex w-min">
          <Icon icon="menu" size={30} onClick={ok}></Icon>
        </button>
        <div className="flex flex-grow px-3 mb-3">
          <Icon
            icon="notifications"
            size={150}
            className={classNames(
              isBellRinging ? "animate-wave" : "animate-none",
              "fill-purple-800"
            )}
            onClick={() => setBellRinging((prev) => !prev)}
          />
        </div>
        <div className="mb-8">
          {isBellRinging
            ? "La campana sta suonando"
            : "La campana suona fra " +
              new Date().getHours().toString() +
              ":" +
              (new Date().getMinutes() + 5).toString()}
        </div>
        <div className="flex border-2 border-black p-2 items-center flex-col">
          <div className="mb-2 font-bold">Fai suonare la campanella</div>
          <div className="flex flex-row gap-4 text-white">
            <button className="bg-slate-600 border rounded-lg shadow-md border-black p-1 px-2 hover:bg-opacity-80 focus:outline-none">
              Cambio <br /> dell'ora
            </button>
            <button className="bg-slate-600 border rounded-lg shadow-md border-black p-1 px-2 hover:bg-opacity-80 focus:outline-none">
              Fine <br /> delle lezioni
            </button>
            <button className="bg-slate-600 border rounded-lg shadow-md border-black p-1 px-2 hover:bg-opacity-80 focus:outline-none">
              Suono <br /> d'emergenza
            </button>
          </div>
        </div>
      </div>
      <div className="border flex flex-col items-center">
        <div className="text-xl font-bold">Programmazione Campanella</div>
        <div>
          {isLoading
            ? ""
            : ringSchedule!.map((element) => {
                return (
                  <div className="flex flex-row border border-black divide-x divide-black">
                    <div className="px-2">{element.id.toString()}</div>
                    <div className="px-2">{element.fromDate}</div>
                    <div className="px-2">{element.toDate}</div>
                    <div className="px-2">{element.weekDay}</div>
                    <div className="px-2">{element.ringTime}</div>
                  </div>
                );
              })}
        </div>
        <button
          className="flex border-2 border-black h-6 items-center focus:outline-none"
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          Aggiungi Regola
        </button>
      </div>
      <RuleDialog isOpen={isDialogOpen} close={setDialogOpen} />
    </div>
  );
}
