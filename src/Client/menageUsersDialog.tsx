import {
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  Divider,
} from "@blueprintjs/core";
import { trpc } from "./utils/trpc";
import { useState } from "react";

export default function MenageUsersDialog(p: {
  isOpen: boolean;
  close: (val: boolean) => void;
}) {
  const { isLoading, isError, data, error } = trpc.users.useQuery();
  const [enableDelete, setDelete] = useState(true);
  const [userChecked, setUserChecked] = useState([false]);
  const utils = trpc.useContext();
  const removeUser = trpc.removeUser.useMutation();
  if (!isLoading && userChecked.length != data?.length) {
    setUserChecked(
      data?.map(() => {
        return false;
      }) ?? [false]
    );
  }
  return (
    <div>
      <Dialog
        isOpen={p.isOpen}
        onClose={() => {
          p.close(false);
          setDelete(true);
          setUserChecked([false]);
        }}
        title={"Gestisci gli Utenti"}
        icon={"person"}
      >
        <DialogBody>
          {isLoading
            ? ""
            : data!.map((element, index) => {
                return (
                  <Checkbox
                    className="flex items-center"
                    alignIndicator="right"
                    disabled={enableDelete}
                    style={{ color: "black" }}
                    checked={userChecked![index]}
                    onChange={() => {
                      setUserChecked(
                        userChecked?.map((x, index2) => {
                          if (index === index2) {
                            return !x;
                          } else return x;
                        })
                      );
                    }}
                  >
                    <div className="flex flex-row border border-black divide-x divide-black">
                      <div className="px-2">{element.id.toString()}</div>
                      <div className="px-2">{element.username}</div>
                      <div className="px-2">{element.lastLogin}</div>
                    </div>
                  </Checkbox>
                );
              })}
          <DialogFooter
            className="grid place-items-end"
            minimal={true}
            children={
              <div>
                <button
                  className="items-end border-2 p-1 border-black border-opacity-60 focus:outline-none"
                  onClick={() => setDelete(false)}
                  hidden={!enableDelete}
                >
                  Modifica
                </button>
                <div className="flex space-x-2">
                  <button
                    className="items-end border-2 p-1 border-black border-opacity-60 focus:outline-none"
                    onClick={() => {
                      userChecked.forEach((val, index) => {
                        if (val) {
                          removeUser.mutate(data![index].id, {
                            onSuccess() {
                              utils.invalidate();
                              location.reload();
                            },
                          });
                        }
                      });
                      setDelete(true);
                    }}
                    hidden={enableDelete}
                  >
                    Elimina
                  </button>
                  <button
                    className="items-end border-2 p-1 border-black border-opacity-60 focus:outline-none"
                    onClick={() => {
                      setDelete(true);
                    }}
                    hidden={enableDelete}
                  >
                    Annulla
                  </button>
                </div>
              </div>
            }
          />
        </DialogBody>
      </Dialog>
    </div>
  );
}
