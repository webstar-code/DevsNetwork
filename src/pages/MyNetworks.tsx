import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { networksApi } from "../api/networks";
import { AddNetworkModal } from "../components/AddNetworkModal";
import { useAppSelector } from "../hooks/useRedux";
import { INetwork } from "../interfaces";
import { cn, getRandomSaturatedColor } from "../utils/utils";

export function MyNetworks() {
  const { user } = useAppSelector(state => state.userSlice);

  const getNetworksByUser = async (id: string) => {
    return await networksApi.get(id).then((res) => {
      if (res.status === "success") {
        return res.data as INetwork[]
      }
    })
  }

  const { data: networks, status } = useQuery({
    queryKey: ['networks', user],
    queryFn: () => getNetworksByUser(user?.id!),
  })

  return (
    <div className="w-full min-h-screen bg-primary">
      <div className="container h-full flex flex-col gap-10 my-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-medium text-secondary">My Networks</h1>
          <AddNetworkModal />
        </div>

        {status === "pending" ?
          <div></div>
          : status === "success" ?
            <div className="grid grid-cols-6 gap-6">
              {networks && networks.map((n) =>
                <Link to={`/network/${n.id}`}>
                  <div className={cn("w-full p-6 flex flex-col gap-4 border rounded-2xl border-l-4 border-b-4")}>
                    <h3 className="text-2xl font-semibold text-secondary">{n.name}</h3>
                    <p className="text-sm text-secondary">{n.members.length} {n.members.length === 1 ? "Member": "Members"}</p>
                  </div>
                </Link>
              )}
            </div>
            :
            <></>
        }
      </div>
    </div>
  )
}