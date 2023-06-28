import React, { useState } from "react";
import { Checkbox, Icon, Menu, MenuItem } from "@blueprintjs/core";
import classNames from "classnames";
import { trpc } from "./utils/trpc";
import RuleDialog from "./ruleDialog";
import MenageUsersDialog from "./menageUsersDialog";

export default function HomePage() {
  const [isBellRinging, setBellRinging] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [enableRemoveRule, setRemoveRule] = useState(true);
  const [isUsersDialogOpen, setUsersDialogOpen] = useState(false);
  const utils = trpc.useContext();
  const { isLoading, isError, data, error } = trpc.ringSchedule.useQuery();
  const ringSchedule = data;
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
    <div className="flex p-6 h-full gap-4">
      <div className="flex flex-col space-y-4">
        <Menu className="flex" large={false}>
          <MenuItem
            icon={<Icon icon="menu" size={30}></Icon>}
            intent="none"
            text="Impostazioni"
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
      <div className="border flex flex-col items-center p-3">
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
                  removeRule.mutate(index + ringSchedule![0].id, {
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
  );
}
