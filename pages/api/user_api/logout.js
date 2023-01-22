import cookie from 'cookie';
import { auth } from '/firebase-config';
import { signOut } from 'firebase/auth';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      // Déconnexion de l'utilisateur
      await signOut(auth);
      // Supression du cookie token en l'expirant
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 0,
          sameSite: 'strict',
          path: '/',
        })
      );
      res.status(200).json({ code: 200 });
    }
  } catch (error) {
    res.status(401).json(error);
  }
}
