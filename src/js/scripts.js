import {
  getCookie
} from './cookie.js';

if (getCookie('root-cookie-law-analytics') === 'accepted') {
  function gtag() { // eslint-disable-line
    window.dataLayer.push(arguments); // eslint-disable-line
  }

  const rootGtagId = 'xxxxxxxxxxx';
  const rootGtagScript = document.createElement('script');

  rootGtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${rootGtagId}`;
  rootGtagScript.async = true;
  document.head.append(rootGtagScript);

  window.dataLayer = window.dataLayer || [];

  gtag('js', new Date());
  gtag('config', rootGtagId, {
    cookie_domain: window.location.hostname,
    cookie_flags: 'SameSite=None;Secure'
  });
}
