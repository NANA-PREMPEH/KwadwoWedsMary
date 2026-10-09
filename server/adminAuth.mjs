import crypto from 'node:crypto';

const SESSION_COOKIE = 'kwadwo_weds_mary_admin';
const MAX_AGE_SECONDS = 60 * 60 * 8;

const config = () => ({
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  secret: process.env.ADMIN_SESSION_SECRET,
});

const encode = (value) => Buffer.from(value).toString('base64url');
const decode = (value) => Buffer.from(value, 'base64url').toString('utf8');

const sign = (value, secret) => crypto.createHmac('sha256', secret).update(value).digest('base64url');

const equal = (first, second) => {
  const firstBuffer = Buffer.from(first || '');
  const secondBuffer = Buffer.from(second || '');
  return firstBuffer.length === secondBuffer.length && crypto.timingSafeEqual(firstBuffer, secondBuffer);
};

const parseCookies = (header = '') => Object.fromEntries(
  header.split(';').filter(Boolean).map((item) => {
    const [key, ...value] = item.trim().split('=');
    return [key, decodeURIComponent(value.join('='))];
  })
);

export const isAdminConfigured = () => {
  const { email, password, secret } = config();
  return Boolean(email && password && secret);
};

export const createAdminSession = (email) => {
  const { secret } = config();
  const payload = encode(JSON.stringify({ email, expiresAt: Date.now() + MAX_AGE_SECONDS * 1000 }));
  return `${payload}.${sign(payload, secret)}`;
};

export const verifyAdminSession = (request) => {
  const { secret } = config();
  if (!secret) return false;
  const token = parseCookies(request.headers.cookie)[SESSION_COOKIE];
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !equal(signature, sign(payload, secret))) return false;
  try {
    const { expiresAt } = JSON.parse(decode(payload));
    return Number(expiresAt) > Date.now();
  } catch {
    return false;
  }
};

export const setAdminCookie = (response, session) => {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  response.setHeader('Set-Cookie', `${SESSION_COOKIE}=${session}; Max-Age=${MAX_AGE_SECONDS}; Path=/; HttpOnly; SameSite=Strict${secure}`);
};

export const clearAdminCookie = (response) => {
  response.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`);
};

export const credentialsMatch = (email, password) => {
  const configured = config();
  return isAdminConfigured() && equal(email.trim().toLowerCase(), configured.email.toLowerCase()) && equal(password, configured.password);
};
