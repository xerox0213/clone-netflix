import { db } from '/firebase-config';
import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { noSSR } from 'next/dynamic';

export async function middleware(req, res) {
  const whereIamGoing = req.nextUrl.clone().pathname;
  const isCookieExisted = req.cookies.has('token');

  if (isCookieExisted && (whereIamGoing !== '/' && whereIamGoing !== '/signIn')) {
    return NextResponse.next();
  }else if(isCookieExisted && (whereIamGoing === '/' || whereIamGoing === "/signIn")){
    const homeURL = new URL('/home', req.url);
    return NextResponse.redirect(homeURL)
  }else if(!isCookieExisted && (whereIamGoing === "/" || whereIamGoing === "/signIn")){
    return NextResponse.next()
  }else{
    const loginURL = new URL('/signIn', req.url);
    return NextResponse.redirect(loginURL);
  }


  // if (
  //   (whereIamGoing === '/' || whereIamGoing === '/signIn') &&
  //   isCookieExisted
  // ) {
  //   const uid = req.cookies.get('token').value;
  //   const docRef = doc(db, 'users', uid);
  //   const docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) {
  //     return NextResponse.redirect(new URL('/home', req.url));
  //   }
  // } else if (
  //   (whereIamGoing === '/' || whereIamGoing === '/signIn') &&
  //   isCookieExisted
  // ) {
  //   return;
  // } else if (
  //   (whereIamGoing === '/home' ||
  //     whereIamGoing === '/tv' ||
  //     whereIamGoing === '/movies' ||
  //     whereIamGoing === '/my-list' ||
  //     whereIamGoing.includes('/search') ||
  //     whereIamGoing.includes('/watch')) &&
  //   !isCookieExisted
  // ) {
  //   return NextResponse.redirect(new URL('/signIn', req.url));
  // } else if (
  //   (whereIamGoing === '/home' ||
  //     whereIamGoing === '/tv' ||
  //     whereIamGoing === '/movies' ||
  //     whereIamGoing === '/my-list' ||
  //     whereIamGoing === '/search' ||
  //     whereIamGoing.includes('/watch')) &&
  //   isCookieExisted
  // ) {
  //   return;
  // }
}

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
