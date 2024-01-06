import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Network as VisNetwork } from "vis-network";
import { authApi } from "../api/auth";
import { invitationApi } from "../api/invitation";
import { networksApi } from "../api/networks";
import { IcLOADING } from "../assets/animated";
import { IcLeft } from '../assets/icons';
import Button from "../components/Button";
import { Invite } from '../components/Invite';
import { PageBlocker } from "../components/PageBlocker";
import { db, dbCollections } from "../firebase";
import { useAppSelector } from '../hooks/useRedux';
import { INetwork, IUser } from "../interfaces";
import { DotBackground } from "../components/DotBackground";

export interface IConnectionUser {
  id: string,
  username: string,
  avatar: string
}

export interface IIConnectionsItem {
  node: string,
  edges: string[],
  root?: boolean
}

export function Network() {
  const { network_id } = useParams();
  const [searchParams] = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const { user } = useAppSelector(state => state.userSlice);
  const [invitedBy, setInvitedBy] = useState<IUser | null>(null);
  const queryClient = useQueryClient()

  const navigate = useNavigate();

  const getNetworkById = async (id: string) => {
    return await networksApi.getById(id).then((res) => {
      if (res.status === "success") {
        return res.data as INetwork
      } else {
        throw new Error("")
      }
    });
  }

  const getMemberProfile = async (ids: string[]) => {
    const q = query(collection(db, dbCollections.users), where("id", "in", ids));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      return doc.data()
    }) as IUser[];
  };

  const getNetworkConnections = async (id: string) => {
    return await networksApi.getNetworkConnections(id).then(async (res) => {
      if (res.status === "success") {
        return res.data as IIConnectionsItem[]
      }
    })
  }

  const onJoinNetwork = async () => {
    if (!network?.id) return;
    if (!invitedBy) return;
    if (!user) return;
    return await networksApi.addMember(network?.id, invitedBy.id, user)
      .catch(err => console.error(err));
  }

  const { data: network } = useQuery({
    queryKey: ['network', network_id],
    queryFn: () => getNetworkById(network_id!),
  })

  const { data: memberIds } = useQuery({
    queryKey: ['members_ids', network_id],
    queryFn: () => getNetworkById(network_id!),
    select: (n) => n.members.map((m) => m),
  })

  const { data: profiles } = useQuery({
    queryKey: ['members_profiles', memberIds],
    queryFn: () => getMemberProfile(memberIds!),
  })
  const { data: connections } = useQuery({
    queryKey: ['members_connections', network_id],
    queryFn: () => getNetworkConnections(network_id!),
  })

  useEffect(() => {
    if (profiles && profiles.length > 0) {
      let n = [];
      for (const p of profiles) {
        if (!p) continue;
        n.push({
          id: p?.id,
          shape: "circularImage",
          image: p?.photoUrl,
          label: p?.name,
          color: {
            background: "cyan",
            border: "#EEF0EF",
            highlight: { background: "#EEF0EF", border: "#10FF87" },
            hover: { background: "#EEF0EF", border: "#97FFCB" },
          },
          choosen: user?.id === p.id ? true : false,
          size: user?.id === p.id ? 28 : 20,
        })
      }
      setNodes(n as any);
    }
  }, [profiles]);

  useEffect(() => {
    if (connections) {
      let e = [];
      for (const c of connections) {
        if (c.edges.length > 0) {
          e.push(...c.edges.map(e => ({
            from: c.node,
            to: e,
            arrows: { to: { enabled: true, type: "triangle" } },
            color: {
              color: "#7D7D7D", highlight: "#10FF87",
            }
          })))
        }
      }
      setEdges(e as any);
    }
  }, [connections]);

  useEffect(() => {
    const refId = searchParams.get("refId")
    if (refId) {
      invitationApi.getById(refId).then(async (res) => {
        if (res.status === "success") {
          const invitation = res.data;
          if (invitation.networkId === network_id) {
            const inviter = await authApi.getUserById(invitation.createdBy).then(res => res.status === "success" ? res.data : null)
            if (inviter) {
              setInvitedBy(inviter as IUser);
            }
          } else {
            return;
          }

        }
      })
    }
  }, [searchParams]);

  const membersUpdate = useMutation({
    mutationFn: onJoinNetwork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members_ids'] })
      queryClient.invalidateQueries({ queryKey: ['members_profiles'] })
      queryClient.invalidateQueries({ queryKey: ['members_connections'] })
    },
  })

  // var nodes = USERS.map((u) => ({
  //   id: u.id,
  //   shape: "circularImage",
  //   image: u.avatar, label: u.username,
  //   color: {
  //     background: "cyan",
  //     border: "#EEF0EF",
  //     highlight: { background: "#EEF0EF", border: "#10FF87" },
  //     hover: { background: "#EEF0EF", border: "#97FFCB" },
  //   },
  //   choosen: root?.id === u.id ? true : false,
  //   size: root?.id === u.id ? 32 : 20,
  // }))
  // var edges = USERS.map(() => ({
  //   from: nodes[ran(MAX - 1)].id,
  //   to: nodes[ran(MAX - 1)].id,
  //   arrows: { to: { enabled: true, type: "triangle" } },
  //   color: {
  //     color: "#7D7D7D", highlight: "#10FF87",

  //   }
  // }
  // ))


  var options = {
    nodes: {
      shape: "dot",
      size: 24,
      font: {
        size: 14,
        color: "white"
      },
      borderWidth: 2,
      shadow: true,
    },
    edges: {
      smooth: true,
    },
    interaction: { hover: true },
  };

  function changeCursor(newCursorStyle: string) {
    if (containerRef.current)
      containerRef.current.getElementsByTagName("canvas")[0].style.cursor = newCursorStyle;
  }

  useEffect(() => {
    if (containerRef.current && nodes && nodes !== undefined && edges) {
      // @ts-ignore
      var network = new VisNetwork(containerRef.current, { nodes, edges }, options);
      network.on("hoverNode", function () {
        changeCursor("grab");
      });
    }
  }, [nodes, edges, containerRef.current]);

  return (
    <div className="w-full min-h-screen relative bg-primary">
      <DotBackground>
        <div className="absolute top-6 left-6 md:left-20 min-w-[180px] w-max z-50 flex flex-col gap-2">
          <div className='border border-secondary/50 rounded-md p-6 py-4 flex bg-primary '>
            <img src={IcLeft} className='w-6 h-6 mr-4 cursor-pointer' onClick={() => navigate("/networks")} />
            <div className='flex flex-col gap-2'>
              <h1 className="text-base font-semibold text-secondary whitespace-nowrap">{network?.name}</h1>
              <p className="text-sm text-secondary">{network?.members.length} {network?.members.length === 1 ? "Member" : "Members"}</p>
            </div>
          </div>
          {user && network?.members.includes(user?.id) &&
            <Invite />
          }
        </div>

        {user && invitedBy && !network?.members.includes(user?.id) &&
          <div className="absolute bottom-6 md:top-6 right-6 md:right-20 min-w-[180px] z-50 flex flex-col gap-4">
            <div className='max-w-[380px] border border-secondary/50 rounded-md p-6 py-4 flex flex-col gap-6 bg-primary '>
              <div className="flex items-start">
                <img src={invitedBy.photoUrl} className='w-8 h-8 mr-4 cursor-pointer rounded-full object-cover border border-secondary' onClick={() => navigate(-1)} />
                <div className='flex flex-col gap-2'>
                  <p className="text-sm text-secondary">{invitedBy.name} has invited you to this network</p>
                </div>
              </div>
              <div className="w-full flex gap-4">
                <Button variant={"outline"} onClick={() => setInvitedBy(null)} className="w-full text-secondary">Reject</Button>
                <Button variant="secondary" onClick={() => membersUpdate.mutate()} className="w-full">Join</Button>
              </div>
            </div>
          </div>
        }
        <div ref={containerRef} style={{ height: window.screen.availHeight - 100 }} className="w-full min-h-[600px]"></div>
        {membersUpdate.isPending && <PageBlocker open={membersUpdate.isPending}>
          <div className="flex flex-col gap-6 items-center justify-center">
            <p>Please wait...</p>
            <img src={IcLOADING} className="w-10 h-10" />
          </div></PageBlocker>}
      </DotBackground>
    </div>
  )
}