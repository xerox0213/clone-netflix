import { auth } from '/firebase-config';
import { db } from '../../../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, addDoc, collection } from 'firebase/firestore';

export default async function handler(req, res) {
  const { email, password } = req.body;
  try {
    // Inscription d'un utilisateur
    const currentUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Token unique de l'utilisateur créé
    const uid = currentUser.user.uid;

    // Création de l'utilisateur en database
    await createUser(uid);

    // Création de son espace myList en database
    await createMyListSpace(uid);

    res.status(200).json({ code: 200 });
  } catch (error) {
    res.status(401).json(error);
  }
}

function createUser(uid) {
  // Renvoie une promesse à l'état pending
  return setDoc(doc(db, 'users', uid), {
    country: 'RANDOM',
  });
}

function createMyListSpace(uid) {
  // Renvoie une promesse à l'état pending
  return addDoc(collection(db, 'myList'), {
    uid: uid,
    list: [],
  });
}
