import { db } from '../../../firebase-config';
import { addDoc, collection } from 'firebase/firestore';

export default async function handler(req, res) {
  try {
    const uid = req.body.uid;
    await addDoc(collection(db, 'myList'), {
      uid: uid,
      list: [],
    });
    res.status(200).json({ message: 'success' });
  } catch (error) {
    res.status(400).json(error);
  }
}
