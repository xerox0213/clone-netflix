import { db } from '../../../firebase-config';
import { query, where, collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  try {
    let uid = req.headers.cookie;
    if (uid.includes('=')) {
      uid = uid.slice(uid.indexOf('=') + 1);
    }
    const q = query(collection(db, 'myList'), where('uid', '==', uid));
    const querySnapShot = await getDocs(q);
    let myListData;
    querySnapShot.forEach((doc) => {
      myListData = doc.data().list;
    });
    res.status(200).json({ myListData: myListData });
  } catch (error) {
    res.status(404).json({ message: 'error' });
  }
}
