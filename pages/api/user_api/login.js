import cookie from 'cookie';
import { auth } from '/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default async function handler(req, res) {
  const { email, password } = req.body;
  try {
    // Connexion d'un utilisateur + initialisation d'un cookie token qui stocke l'uid de l'utilisateur connecté.
    const currentUser = await signInWithEmailAndPassword(auth, email, password);
    const uid = currentUser.user.uid;
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', uid, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60,
        sameSite: 'strict',
        path: '/',
      })
    );
    res.status(200).json({ code: 200 });
  } catch (error) {
    res.status(401).json(error);
  }
}
