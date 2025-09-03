import { jwtDecode } from "jwt-decode";

export const isAdmin = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
        const decoded: any = jwtDecode(token);
        return decoded.is_admin;
    } catch (err) {
        console.error("Failed to decode JWT:", err);
        return false;
    }

}
