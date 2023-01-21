import { NextResponse } from 'next/server';

export async function middleware(req) {
  // Récupère le chemin vers lequel on se dirige
  const whereIamGoing = req.nextUrl.clone().pathname;
  // Vérifie si le cookie token existe
  const isCookieExisted = req.cookies.has('token');

  if (isCookieExisted && whereIamGoing !== '/' && whereIamGoing !== '/signIn') {
    // Passe au middleware suivant
    return NextResponse.next();
  } else if (
    isCookieExisted &&
    (whereIamGoing === '/' || whereIamGoing === '/signIn')
  ) {
    const homeURL = new URL('/home', req.url);
    // Redirection vers la route privé home
    return NextResponse.redirect(homeURL);
  } else if (
    !isCookieExisted &&
    (whereIamGoing === '/' || whereIamGoing === '/signIn')
  ) {
    // Passe au middleware suivant
    return NextResponse.next();
  } else {
    const loginURL = new URL('/signIn', req.url);
    // Redirection vers la route public signIn
    return NextResponse.redirect(loginURL);
  }
}

// Permet de matcher toutes les routes pour lesquelles le middleware s'exécutera
export const config = {
  matcher: [
    '/signIn',
    '/',
    '/home',
    '/movies',
    '/tv',
    '/my-list',
    '/watch/:id*',
    '/watch',
    '/search',
  ],
};
