// Store both JWT and role together in localStorage under the key 'token'
export function storeToken(token, role) {
    localStorage.setItem("token", JSON.stringify({ token, role }));
}

// Get both JWT and role from localStorage
export function getToken() {
    const data = localStorage.getItem("token");
    const parsed = data ? JSON.parse(data) : null;
    // Attach alumniId if present in localStorage
    if (parsed && !parsed.alumniId) {
        const alumniId = localStorage.getItem('alumniId');
        if (alumniId) parsed.alumniId = parseInt(alumniId);
    }
    // Attach userId if present in localStorage
    if (parsed && !parsed.userId) {
        const userId = localStorage.getItem('userId');
        if (userId) parsed.userId = parseInt(userId);
    }
    return parsed;
}

// Export getJwt for consistent JWT retrieval
export function getJwt() {
    const auth = getToken();
    return auth && auth.token ? auth.token : '';
}

// Remove both JWT and role from localStorage
export function removeToken() {
    localStorage.removeItem("token");
}
