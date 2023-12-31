import { doc, getDoc } from "firebase/firestore";
import { db, dbCollections } from "../firebase";
import { SUCCESS_RESPONSE, RESPONSE_STATUS, FAILURE_RESPONSE } from "./response";


const getById = async (id: string) => {
  const ref = doc(db, dbCollections.invitations, id);
  const data = (await getDoc(ref)).data();
  if (data) {
    return SUCCESS_RESPONSE({ status: RESPONSE_STATUS.success, data: data });
  } else {
    return FAILURE_RESPONSE({ status: RESPONSE_STATUS.failed, message: 'No Invitation Found.' });
  }
};


export const invitationApi = {
  getById
}