import { arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db, dbCollections } from "../firebase";
import { INetwork, IUser } from "../interfaces";
import { apiMiddleware } from "./middleware";
import { FAILURE_RESPONSE, RESPONSE_STATUS, SUCCESS_RESPONSE } from "./response";

const create = async (network: INetwork) => {
  return await setDoc(doc(db, dbCollections.networks, network.id), apiMiddleware.toJson(network))
    .then(async () => {
      await setDoc(doc(db, dbCollections.networks, network.id, dbCollections.connections, network.createdBy), apiMiddleware.toJson({
        node: network.createdBy,
        root: true,
        edges: []
      }))
      return SUCCESS_RESPONSE({ status: RESPONSE_STATUS.success, data: network })
    })
    .catch((err) => FAILURE_RESPONSE({ status: RESPONSE_STATUS.failed, message: err }));
}

const get = async (userId: string) => {
  try {
    const q = query(collection(db, dbCollections.networks), where("createdBy", "==", userId));
    const snapshot = await getDocs(q)
    const data = snapshot.docs.map((d) => d.data());
    return SUCCESS_RESPONSE({ status: RESPONSE_STATUS.success, data: data });
  } catch (err) {
    return FAILURE_RESPONSE({ status: RESPONSE_STATUS.failed, message: "Something went wrong" });
  }
}
const getById = async (id: string) => {
  const ref = doc(db, dbCollections.networks, id);
  const data = (await getDoc(ref)).data();
  if (data) {
    return SUCCESS_RESPONSE({ status: RESPONSE_STATUS.success, data: data });
  } else {
    return FAILURE_RESPONSE({ status: RESPONSE_STATUS.failed, message: 'No Network Found.' });
  }
};

const getNetworkConnections = async (id: string) => {
  const ref = doc(db, dbCollections.networks, id);
  const network = (await getDoc(ref)).data();
  if (network) {
    const q = query(collection(db, dbCollections.networks, network.id, dbCollections.connections));
    const snapshot = await getDocs(q)
    const data = snapshot.docs.map((d) => d.data());
    return SUCCESS_RESPONSE({ status: RESPONSE_STATUS.success, data: data });
  } else {
    return FAILURE_RESPONSE({ status: RESPONSE_STATUS.failed, message: 'No Network Found.' });
  }
}

const addMember = async (networkId: string, invitedById: string, member: IUser) => {
  return await updateDoc(doc(db, dbCollections.networks, networkId), {
    members: arrayUnion(member.id),
  }).then(async () => {
    const connectionExists = (await getDoc(doc(db, dbCollections.networks, networkId, dbCollections.connections, invitedById))).exists();
    if (connectionExists) {
      await updateDoc(doc(db, dbCollections.networks, networkId, dbCollections.connections, invitedById),
        {
          edges: arrayUnion(member.id),
          node: invitedById
        })
      return SUCCESS_RESPONSE({ status: RESPONSE_STATUS.success, data: "OK" })
    } else {
      await setDoc(doc(db, dbCollections.networks, networkId, dbCollections.connections, invitedById),
        {
          edges: arrayUnion(member.id),
          node: invitedById
        })
      return SUCCESS_RESPONSE({ status: RESPONSE_STATUS.success, data: "OK" })
    }
  }).catch((err) => FAILURE_RESPONSE({ status: RESPONSE_STATUS.failed, message: err }));
}

export const networksApi = {
  create,
  get,
  getById,
  getNetworkConnections,
  addMember
}