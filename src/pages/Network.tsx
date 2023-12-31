import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Network as VisNetwork } from "vis-network";
import { networksApi } from "../api/networks";
import { IcLeft } from '../assets/icons';
import { Invite } from '../components/Invite';
import { db, dbCollections } from "../firebase";
import { useAppSelector } from '../hooks/useRedux';
import { INetwork, IUser } from "../interfaces";

// export function createRandomUser() {
//   return {
//     id: faker.string.uuid(), username: faker.internet.userName(), avatar: faker.image.avatar()
//   };
// }
// const MAX = 20;
// export const USERS = faker.helpers.multiple(createRandomUser, {
//   count: MAX,
// });

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const { user } = useAppSelector(state => state.userSlice);
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

  const { data: network } = useQuery({
    queryKey: ['network'],
    queryFn: () => getNetworkById(network_id!),
    enabled: !!network_id
  })

  const { data: memberIds } = useQuery({
    queryKey: ['members_ids'],
    queryFn: () => getNetworkById(network_id!),
    select: (n) => n.members.map((m) => m),
    enabled: !!network_id
  })

  const { data: profiles } = useQuery({
    queryKey: ['members_profiles'],
    queryFn: () => getMemberProfile(memberIds!),
    enabled: !!memberIds
  })

  const { data: connections } = useQuery({
    queryKey: ['members_connections'],
    queryFn: () => getNetworkConnections(network_id!),
    enabled: !!profiles
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
      <div className="absolute top-6 left-20 min-w-[180px] w-max z-50 flex flex-col gap-4">
        <div className='border border-secondary/50 rounded-md p-6 py-4 flex bg-primary '>
          <img src={IcLeft} className='w-6 h-6 mr-4 cursor-pointer' onClick={() => navigate(-1)} />
          <div className='flex flex-col gap-2'>
            <h1 className="text-base font-semibold text-secondary whitespace-nowrap">{network?.name}</h1>
            <p className="text-sm text-secondary">{network?.members.length} {network?.members.length === 1 ? "Member" : "Members"}</p>
          </div>
        </div>
        <Invite />
      </div>
      <div ref={containerRef} style={{ height: window.screen.availHeight - 100 }} className="w-full min-h-[600px] bg-primary"></div>
    </div>
  )
}