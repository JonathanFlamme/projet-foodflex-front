const API_BASE_URL = 'https://foodflex-oclock-46f540112ea5.herokuapp.com';

// Fonction utilitaire pour ajouter le token d'authentification aux headers
const createHeadersWithAuthorization = () => {
  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  // headers.append('Access-Control-Allow-Origin', '*');
  // headers.append('Access-Control-Allow-Methods', 'POST,PATCH,OPTIONS');
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  return headers;
};

// Fonction utilitaire pour effectuer les requêtes fetch avec les headers mis à jour
const fetchWithHeaders = (url: RequestInfo | URL, options = {}) => {
  const headers = createHeadersWithAuthorization();
  return fetch(`${API_BASE_URL}/${url}`, { ...options, headers });
};

// Fonction utilitaire pour effectuer les requêtes GET avec les headers mis à jour
const fetchGet = (url: string) => fetchWithHeaders(url);

// Function utilitaire pour effectuer les requêtes POST avec les headers mis à jour
const fetchPost = (url: string, data: string | object | number) => {
  return fetchWithHeaders(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

const fetchDelete = (url: string) => {
  return fetchWithHeaders(url, {
    method: 'DELETE',
  });
};

// Exporter les fonctions utilitaires
export { fetchGet, fetchPost, fetchDelete };
