/**
 * Alias de `/api/chat` para clientes que esperan `/api/messages`.
 * No registrar `fetch` en `public/sw.js`: las peticiones API no se interceptan.
 */
export { GET, POST } from "../chat/route";
