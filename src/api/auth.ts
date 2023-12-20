import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, dbCollections } from '../firebase';
import { FAILURE_RESPONSE, RESPONSE_STATUS, SUCCESS_RESPONSE } from './response';
import { IUser } from '../interfaces';
import { apiMiddleware } from './middleware';
import { signOut } from 'firebase/auth';


const createUser = async (newUser: IUser) => {
  return await setDoc(doc(db, dbCollections.users, newUser.id), apiMiddleware.toJson(newUser))
    .then(() => SUCCESS_RESPONSE({ status: RESPONSE_STATUS.success, data: newUser }))
    .catch((err) => FAILURE_RESPONSE({ status: RESPONSE_STATUS.failed, message: err }));
};

const getUserById = async (id: string) => {
  const ref = doc(db, dbCollections.users, id);
  const data = (await getDoc(ref)).data();
  if (data) {
    return SUCCESS_RESPONSE({ status: RESPONSE_STATUS.success, data: data });
  } else {
    return FAILURE_RESPONSE({ status: RESPONSE_STATUS.failed, message: 'No User Found.' });
  }
};

const logout = async () => {
  return await signOut(auth)
    .then(() => SUCCESS_RESPONSE({ status: RESPONSE_STATUS.success, data: null }))
    .catch((err) => FAILURE_RESPONSE({ status: RESPONSE_STATUS.failed, message: err }));
};

export const authApi = {
  createUser,
  getUserById,
  logout
}