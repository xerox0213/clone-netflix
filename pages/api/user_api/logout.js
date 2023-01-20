import cookie from 'cookie';
import { auth } from '/firebase-config';
import { signOut } from 'firebase/auth';

export default async function handler(req, res) {
  try {
    await signOut(auth);
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        expires: new Date(0),
        sameSite: 'strict',
        path: '/',
      })
    );
    res.status(200).json({ code: 200 });
  } catch (error) {
    res.status(401).json({ code: 401 });
  }
}
