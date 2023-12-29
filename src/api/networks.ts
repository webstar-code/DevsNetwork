import { setDoc, doc, getDocs, collection, where, query, getDoc } from "firebase/firestore";
import { db, dbCollections } from "../firebase";
import { INetwork } from "../interfaces";
import { apiMiddleware } from "./middleware";
import { SUCCESS_RESPONSE, RESPONSE_STATUS, FAILURE_RESPONSE } from "./response";

const create = async (network: INetwork) => {
  return await setDoc(doc(db, dbCollections.networks, network.id), apiMiddleware.toJson(network))
    .then(async () => {
      await setDoc(doc(db, dbCollections.networks, network.id, "connections", network.createdBy), apiMiddleware.toJson({
        root: network.createdBy,
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
    const q = query(collection(db, dbCollections.networks, network.id, "connections"));
    const snapshot = await getDocs(q)
    const data = snapshot.docs.map((d) => d.data());
    return SUCCESS_RESPONSE({ status: RESPONSE_STATUS.success, data: data });
  } else {
    return FAILURE_RESPONSE({ status: RESPONSE_STATUS.failed, message: 'No Network Found.' });
  }
}

export const networksApi = {
  create,
  get,
  getById,
  getNetworkConnections
}