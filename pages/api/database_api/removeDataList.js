import { db } from '../../../firebase-config';
import {
  doc,
  updateDoc,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

export default async function handler(req, res) {
  try {
    const uid = req.cookies.token;
    const obj = req.body.obj;
    const response = await removeContentOfMyList(uid, obj);
    res.status(200).json(response);
  } catch (error) {
    res.status(401).json(error);
  }
}

export async function removeContentOfMyList(uid, obj) {
  try {
    const q = query(collection(db, 'myList'), where('uid', '==', uid));
    const querySnapShot = await getDocs(q);
    let idDoc;
    querySnapShot.forEach((doc) => {
      idDoc = doc.id;
    });
    const ref = doc(db, 'myList', idDoc);
    await updateDoc(ref, {
      list: arrayRemove(obj),
    });
    return { code: 200 };
  } catch (error) {
    return error;
  }
}
