import { Checkbox, Dialog, DialogBody, DialogFooter } from "@blueprintjs/core";
import { useState } from "react";
import { trpc } from "./utils/trpc";
import { log } from "console";

export default function RuleDialog(p: {
  isOpen: boolean;
  close: (val: boolean) => void;
}) {
  const utils = trpc.useContext();
  const addRule = trpc.addBellRule.useMutation();
  const [beginDate, setBeginDate] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const [ringNumber, setRingNumber] = useState("0");
  const [monday, enableMonday] = useState(false);
  const [tuesday, enableTuesday] = useState(false);
  const [wednsday, enableWednsday] = useState(false);
  const [thursday, enableThursday] = useState(false);
  const [friday, enableFriday] = useState(false);
  const [saturday, enableSaturday] = useState(false);
  const [sunday, enableSunday] = useState(false);

  function close() {
    setBeginDate("");
    setFinalDate("");
    setRingNumber("0");
    p.close(false);
  }

  function save() {
    const weekDays =
      (monday ? "lunedi," : "") +
      (tuesday ? "martedi," : "") +
      (wednsday ? "mercoledi," : "") +
      (thursday ? "giovedi," : "") +
      (friday ? "venerdi," : "") +
      (saturday ? "sabato," : "") +
      (sunday ? "domenica," : "");
    var totalRingTime = "";
    if (ringNumber != "0") {
      for (let index = 0; index < parseInt(ringNumber); index++) {
        totalRingTime += (
          document.getElementById(index.toString()) as HTMLInputElement
        )?.value;
        totalRingTime += ",";
      }
    }
    addRule.mutate(
      {
        fromDate: beginDate,
        toDate: finalDate,
        weekDay: weekDays,
        ringTime: totalRingTime,
      },
      {
        onSuccess() {
          utils.invalidate();
        },
      }
    );
    setBeginDate("");
    setFinalDate("");
    setRingNumber("0");
    enableMonday(false);
    enableTuesday(false);
    enableWednsday(false);
    enableThursday(false);
    enableFriday(false);
    enableSaturday(false);
    enableSunday(false);
    close();
  }
  function ringTimeInputs(n: number) {
    var element = [];
    for (let index = 0; index < n; index++) {
      element.push(
        <div className="flex flex-row space-x-2 items-center border-2 p-1">
          <div>Orario {index + 1}:</div>
          <input type="time" id={index.toString()}></input>
        </div>
      );
    }
    return element;
  }
  return (
    <div>
      <Dialog
        title="Aggiungi Regola"
        icon="add"
        isOpen={p.isOpen}
        onClose={close}
      >
        <DialogBody>
          <div className="flex flex-col space-y-2 items-center max-h-80">
            <div className="flex flex-row space-x-2 items-center border-2 p-1">
              <div>Inizio:</div>
              {/* DateInput2 blueprint??*/}
              <input
                className="bg-transparent focus:outline-none"
                type="Date"
                value={beginDate}
                onChange={(e) => {
                  setBeginDate(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-row space-x-2 items-center border-2 p-1">
              <div>Fine:</div>
              <input
                className="bg-transparent focus:outline-none pl-2"
                type="Date"
                value={finalDate}
                onChange={(e) => {
                  setFinalDate(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col space-x-2 items-center border-2 p-1">
              <div>Giorni della settimana:</div>
              <div className="mt-2">
                <Checkbox
                  checked={monday}
                  onChange={() => enableMonday(!monday)}
                >
                  Lunedì
                </Checkbox>
                <Checkbox
                  checked={tuesday}
                  onChange={() => enableTuesday(!tuesday)}
                >
                  Martedì
                </Checkbox>
                <Checkbox
                  checked={wednsday}
                  onChange={() => enableWednsday(!wednsday)}
                >
                  Mercoledì
                </Checkbox>
                <Checkbox
                  checked={thursday}
                  onChange={() => enableThursday(!thursday)}
                >
                  Giovedì
                </Checkbox>
                <Checkbox
                  checked={friday}
                  onChange={() => enableFriday(!friday)}
                >
                  Venerdì
                </Checkbox>
                <Checkbox
                  checked={saturday}
                  onChange={() => enableSaturday(!saturday)}
                >
                  Sabato
                </Checkbox>
                <Checkbox
                  checked={sunday}
                  onChange={() => enableSunday(!sunday)}
                >
                  Domenica
                </Checkbox>
              </div>
            </div>
            <div className="flex flex-row space-x-2 items-center border-2 p-1">
              <div className="">
                La campana suona
                <input
                  className="mr-2 ml-2 w-8"
                  type="number"
                  min={0}
                  max={99}
                  value={ringNumber}
                  onChange={(e) => {
                    setRingNumber(e.target.value);
                  }}
                />
                volte al giorno
              </div>
            </div>
            {ringTimeInputs(parseInt(ringNumber)).map((x) => {
              return x;
            })}
          </div>
        </DialogBody>
        <DialogFooter
          className="grid place-items-end"
          minimal={true}
          children={
            <button
              className="items-end border-2 p-1 border-black border-opacity-60 focus:outline-none"
              onClick={save}
            >
              Salva
            </button>
          }
        />
      </Dialog>
    </div>
  );
}
