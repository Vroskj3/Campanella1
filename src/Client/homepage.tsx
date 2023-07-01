import React, { useState } from "react";
import { Checkbox, Icon, Menu, MenuItem } from "@blueprintjs/core";
import classNames from "classnames";
import { trpc } from "./utils/trpc";
import RuleDialog from "./ruleDialog";
import MenageUsersDialog from "./menageUsersDialog";
import { date } from "zod";
import { log } from "console";

export default function HomePage() {
  const [isBellRinging, setBellRinging] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [enableRemoveRule, setRemoveRule] = useState(true);
  const [isUsersDialogOpen, setUsersDialogOpen] = useState(false);
  const utils = trpc.useContext();
  const { isLoading, isError, data, error } = trpc.ringSchedule.useQuery();
  const ringNow = trpc.ringNow.useMutation();
  const ringSchedule = data;
  const [nextRing, setNextRing] = useState("");
  const weekDay = [
    "domenica",
    "lunedi",
    "martedi",
    "mercoledi",
    "giovedi",
    "venerdi",
    "sabato",
  ];
  if (!isLoading && ringSchedule?.length && nextRing == "") {
    ringSchedule.forEach((schedule) => {
      const fromDate1 = new Date(schedule.fromDate);
      fromDate1.setTime(0);
      const toDate1 = new Date(schedule.toDate);
      toDate1.setHours(23);
      toDate1.setMinutes(59);
      if (fromDate1 <= new Date() && toDate1 >= new Date()) {
        if (
          schedule.weekDay
            .split(",")
            .some((x) => x == weekDay[new Date().getDay()])
        ) {
          if (schedule.ringTime) {
            schedule.ringTime.split(",").forEach((v, index) => {
              if (v) {
                var d = v.split(":").map((f) => {
                  return parseInt(f);
                });
                if (
                  d[0] == new Date().getHours() &&
                  d[1] == new Date().getMinutes() &&
                  !isBellRinging
                ) {
                  setBellRinging(true);
                } else if (
                  d[0] > new Date().getHours() ||
                  (d[0] == new Date().getHours() &&
                    d[1] > new Date().getMinutes())
                ) {
                  if (d[0] - new Date().getHours() <= 1) {
                    if (d[1] - new Date().getMinutes() < 0) {
                      setNextRing(
                        (d[1] - new Date().getMinutes() + 60).toString() +
                          " Minuti"
                      );
                    } else {
                      setNextRing(
                        (d[1] - new Date().getMinutes()).toString() + " Minuti"
                      );
                    }
                  } else {
                    if (d[1] - new Date().getMinutes() < 0) {
                      setNextRing(
                        (d[0] - new Date().getHours()).toString() +
                          " Ore " +
                          (d[1] - new Date().getMinutes() + 60).toString() +
                          " Minuti"
                      );
                    } else {
                      setNextRing(
                        (d[0] - new Date().getHours()).toString() +
                          " Ore " +
                          (d[1] - new Date().getMinutes()).toString() +
                          " Minuti"
                      );
                    }
                  }
                }
              }
            });
          }
        }
      }
    });
  }
  const [ruleChecked, setRuleChecked] = useState([false]);
  if (!isLoading && ruleChecked.length != data?.length) {
    setRuleChecked(
      data?.map(() => {
        return false;
      }) ?? [false]
    );
  }
  const removeRule = trpc.removeBellRuleById.useMutation();
  const empty = trpc.emptyDatabase.useMutation();
  return (
    <div className="flex w-full h-screen justify-evenly items-center bg-sfondo-cortile bg-cover">
      <div className="flex space-x-4 bg-white items-center p-2 rounded-lg">
        <div className="flex flex-col space-y-4">
          <Menu className="flex bg-transparent" large={false}>
            <MenuItem
              icon={<Icon icon="menu" size={30}></Icon>}
              intent="none"
              text="Impostazioni"
              className="bg-transparent"
              children={
                <>
                  <MenuItem
                    icon="person"
                    text="Gestisci utenti"
                    onClick={() => {
                      setUsersDialogOpen(true);
                    }}
                  />
                  <MenuItem
                    icon="remove"
                    intent="danger"
                    text="Elimina tutte le regole"
                    onClick={() =>
                      empty.mutate("ringSchedule", {
                        onSuccess() {
                          utils.invalidate();
                        },
                      })
                    }
                  />
                </>
              }
            />
          </Menu>

          <div className="flex flex-grow px-3 mb-3">
            <Icon
              icon="notifications"
              size={150}
              className={isBellRinging ? "animate-wave" : "animate-none"}
              onClick={() => setBellRinging((prev) => !prev)}
            />
          </div>
          <div className="mb-8">
            {isBellRinging
              ? "La campana sta suonando"
              : "La campana suona fra " + nextRing}
          </div>
          <div className="flex border-2 border-gray-900 p-2 items-center flex-col rounded-lg">
            <div className="mb-2 font-bold">Fai suonare la campanella</div>
            <div className="flex flex-row gap-4 text-white">
              <button
                className="bg-slate-600 border rounded-lg shadow-md border-black p-1 px-2 hover:bg-opacity-80 focus:outline-none"
                onClick={() => {
                  ringNow.mutate(1, {
                    onSuccess() {
                      setBellRinging(true);
                    },
                  });
                }}
              >
                Cambio <br /> dell'ora
              </button>
              <button
                className="bg-slate-600 border rounded-lg shadow-md border-black p-1 px-2 hover:bg-opacity-80 focus:outline-none"
                onClick={() => {
                  ringNow.mutate(2, {
                    onSuccess() {
                      setBellRinging(true);
                    },
                  });
                }}
              >
                Fine <br /> delle lezioni
              </button>
              <button
                className="bg-slate-600 border rounded-lg shadow-md border-black p-1 px-2 hover:bg-opacity-80 focus:outline-none"
                onClick={() => {
                  ringNow.mutate(3, {
                    onSuccess() {
                      setBellRinging(true);
                    },
                  });
                }}
              >
                Suono <br /> d'emergenza
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center p-3 overflow-x-scroll">
          <div className="text-xl font-bold">Programmazione Campanella</div>
          <div>
            {isLoading
              ? ""
              : ringSchedule!.map((element, index) => {
                  return (
                    <Checkbox
                      className="flex items-center"
                      alignIndicator="right"
                      disabled={enableRemoveRule}
                      style={{ color: "black" }}
                      checked={ruleChecked![index]}
                      onChange={() => {
                        setRuleChecked(
                          ruleChecked?.map((x, index2) => {
                            if (index === index2) {
                              return !x;
                            } else return x;
                          })
                        );
                      }}
                    >
                      <div className="flex flex-row border border-black divide-x divide-black">
                        <div className="px-2">{element.id.toString()}</div>
                        <div className="px-2">{element.fromDate}</div>
                        <div className="px-2">{element.toDate}</div>
                        <div className="px-2">{element.weekDay}</div>
                        <div className="px-2">{element.ringTime}</div>
                      </div>
                    </Checkbox>
                  );
                })}
          </div>
          <div className="flex flex-row justify-evenly space-x-2">
            <button
              className="flex border-2 border-black h-6 items-center focus:outline-none px-1"
              hidden={!enableRemoveRule}
              onClick={() => {
                setDialogOpen(true);
              }}
            >
              Aggiungi Regola
            </button>
            <button
              className="flex border-2 border-black h-6 items-center focus:outline-none px-1"
              hidden={!enableRemoveRule}
              onClick={() => {
                setRemoveRule(false);
              }}
            >
              Rimuovi Regola
            </button>
            <button
              className="flex border-2 border-black h-6 items-center focus:outline-none px-1"
              hidden={enableRemoveRule}
              onClick={() => {
                ruleChecked.forEach((val, index) => {
                  if (val) {
                    removeRule.mutate(ringSchedule![index].id, {
                      onSuccess() {
                        utils.invalidate();
                      },
                    });
                  }
                });
                setRemoveRule(true);
              }}
            >
              Salva
            </button>
            <button
              className="flex border-2 border-black h-6 items-center focus:outline-none px-1"
              hidden={enableRemoveRule}
              onClick={() => {
                setRuleChecked(ruleChecked.map(() => false));
                setRemoveRule(true);
              }}
            >
              Annulla
            </button>
          </div>
        </div>
        <RuleDialog isOpen={isDialogOpen} close={setDialogOpen} />
        <MenageUsersDialog
          isOpen={isUsersDialogOpen}
          close={setUsersDialogOpen}
        />
      </div>
    </div>
  );
}
