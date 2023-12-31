import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IcAddGroup, IcCheck, IcCopy, IcMail } from "../assets/icons";
import { db, dbCollections } from "../firebase";
import { useAppSelector } from "../hooks/useRedux";
import { unquieId } from "../utils/utils";
import Button from "./Button";
import { Dialog, DialogContent, DialogTrigger } from "./Dialog";

export function Invite() {
  const [refLink, setRefLink] = useState("");
  const [copied, setCopied] = useState(false);
  const { user } = useAppSelector(state => state.userSlice);
  const { network_id } = useParams();

  useEffect(() => {
    if (!refLink) {
      const refId = unquieId();
      const invitation = {
        id: refId,
        networkId: network_id,
        createdBy: user?.id,
        createdAt: new Date(),
      }
      setDoc(doc(db, dbCollections.invitations, refId), {
        ...invitation
      }).then(() => {
        setRefLink(`${window.location.href}?refId=${refId}`)
      })
    }
    return () => {
      setCopied(false);
    }
  }, []);

  return (
    <Dialog>
      <DialogTrigger>
        <div className="w-full">
          <Button variant="secondary" className="w-full">
            <div className='flex items-center gap-2'>
              <img src={IcAddGroup} className='w-5 h-5' />
              <p>Invite people</p>
            </div>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">Invite People to your network</h1>
          <div className="grid grid-cols-1 grid-rows-4 sm:grid-cols-3 sm:grid-rows-2 gap-y-4 sm:gap-y-6 sm:gap-x-4 my-10">
            <div className="col-span-2 mt-2 sm:mt-0 w-full h-11 py-2 px-4 border border-primary/75 rounded-md">
              <input value={refLink} placeholder="Enter Email address" className="w-full text-sm outline-none" />
            </div>
            <Button
              onClick={() => {
                setCopied(true)
                navigator.clipboard.writeText(refLink)
              }}
              size={"lg"} className="w-full shrink-0">
              {copied ?
                <div className='flex items-center gap-2'>
                  <img src={IcCheck} className='w-4 h-4' />
                  <p>Copied</p>
                </div>
                :
                <div className='flex items-center gap-2'>
                  <img src={IcCopy} className='w-3 h-3' />
                  <p>Copy Link</p>
                </div>
              }
            </Button>
            <div className="col-span-2 mt-2 sm:mt-0 w-full h-11 py-2 px-4 border border-primary/75 rounded-md">
              <input placeholder="Enter Email address" className="w-full text-sm outline-none" />
            </div>
            <Button size={"lg"} className="w-full shrink-0">
              <div className='flex items-center gap-2'>
                <img src={IcMail} className='w-3 h-3' />
                <p>Send Invite</p>
              </div>
            </Button>
          </div>
        </div>
        <></>
      </DialogContent>
    </Dialog>
  )
}