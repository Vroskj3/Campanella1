import { Dialog, DialogBody, DialogFooter } from "@blueprintjs/core";
import React from "react";
import { boolean } from "zod";
import { trpc } from "./utils/trpc";

export default function RuleDialog(p: {
  isOpen: boolean;
  close: (val: boolean) => void;
}) {
  const utils = trpc.useContext();
  function close() {
    p.close(false);
  }
  function save() {
    // addRule.mutate({ fromDate: new Date().toISOString(), toDate: new Date().toISOString(), weekDay: "Giovedì", ringTime: "9:00, 10:00, 11:00" }, { onSuccess() { utils.invalidate() } })
    close();
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
          <div className="flex flex-col space-y-2 items-center">
            <div className="flex flex-row space-x-2 items-center border-2 p-1">
              <div>Inizio:</div>
              {/* DateInput2 blueprint??*/}
              <input
                className="bg-transparent focus:outline-none"
                type="Date"
              />
            </div>
            <div className="flex flex-row space-x-2 items-center border-2 p-1">
              <div>Fine:</div>
              <input
                className="bg-transparent focus:outline-none pl-2"
                type="Date"
              />
            </div>
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
