import { db } from '../../../firebase-config';
import { query, where, collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  try {
    let uid = req.headers.cookie;
    if (uid.includes('=')) {
      uid = uid.slice(uid.indexOf('=') + 1);
    }
    const myDataList = await getData(uid);

    res.status(200).json({ myDataList });
  } catch (error) {
    res.status(401).json(error);
  }
}

export async function getData(uid) {
  try {
    const q = query(collection(db, 'myList'), where('uid', '==', uid));
    const querySnapShot = await getDocs(q);
    let myDataList;
    querySnapShot.forEach((doc) => {
      myDataList = doc.data().list;
    });
    return myDataList;
  } catch (error) {
    return error;
  }
}
