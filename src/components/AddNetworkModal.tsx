import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { networksApi } from "../api/networks";
import { IcPlus } from "../assets/icons";
import Button from "../components/Button";
import { Dialog, DialogContent, DialogTrigger } from "../components/Dialog";
import { useAppSelector } from "../hooks/useRedux";
import { INetwork } from "../interfaces";
import { unquieId } from "../utils/utils";

export function AddNetworkModal() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.userSlice);
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);

  const onCreate = async () => {
    if (!user) return;
    setLoading(true);
    const newNetwork: INetwork = {
      id: unquieId(),
      name,
      createdBy: user?.id,
      createdAt: new Date().toDateString(),
      members: [user.id]
    }
    await networksApi.create(newNetwork)
    queryClient.invalidateQueries({ queryKey: ['networks'] })
    setLoading(false);
    setOpenModal(false);
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger>
        <div>
          <Button variant="secondary">
            <div className="flex items-center gap-1">
              <img src={IcPlus} className="w-4 h-4" />
              <p>Create New</p>
            </div>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="w-full min-h-[256px] flex flex-col items-center justify-center p-6 gap-6">
          <h1 className="text-2xl font-semibold">Create your new network</h1>
          <div className="w-full flex flex-col gap-1">
            <p className="text-xs text-primary/80 font-medium">Network name</p>
            <input
              placeholder="Enter your Network name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 p-4 border text-sm border-primary rounded-md"
            />
          </div>
          {loading ?
            <p>loading....</p>
            :
            <div className="w-full" onClick={() => onCreate()}>
              <Button className="w-full">
                Create New Network
              </Button>
            </div>
          }
        </div>
        <></>
      </DialogContent>
    </Dialog>
  )
}