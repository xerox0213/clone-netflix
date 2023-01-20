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
    res.status(200).json({ message: 'success' });
  } catch (error) {
    res.status(200).json(error);
  }
}
