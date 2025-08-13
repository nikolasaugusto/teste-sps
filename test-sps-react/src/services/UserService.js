import axios from "axios";

class UserService {
  constructor(getToken) {
    this.getToken = getToken;
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000",
    });
  }

  authHeader() {
    const token = this.getToken ? this.getToken() : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async list() {
    const res = await this.client.get("/users", { headers: this.authHeader() });
    return res.data;
  }

  async get(id) {
    const res = await this.client.get(`/users/${id}`, { headers: this.authHeader() });
    return res.data;
  }

  async create(data) {
    const res = await this.client.post("/users", data, { headers: this.authHeader() });
    return res.data;
  }

  async update(id, data) {
    const res = await this.client.put(`/users/${id}`, data, { headers: this.authHeader() });
    return res.data;
  }

  async delete(id) {
    await this.client.delete(`/users/${id}`, { headers: this.authHeader() });
    return true;
  }
}

export default UserService;
