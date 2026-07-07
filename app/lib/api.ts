import axios from "axios";

export const API_URL = "https://personal-blog-project-kxgf.onrender.com";

export type User = {
  _id: string;
  fullName?: string;
  email: string;
  age?: number;
  birthDate?: string;
  profileAvatar?: string;
  avatar?: string;
  role?: string;
};

export type Blog = {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  content: string;
  author?: string | User;
  createdAt?: string;
  updatedAt?: string;
};

export type BlogsResponse = Blog[] | { data?: Blog[]; blogs?: Blog[] };

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export function authHeaders(token: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getBlogId(blog: Blog) {
  return blog._id ?? blog.id ?? "";
}

export function getAuthorId(author: Blog["author"]) {
  if (!author) return "";
  return typeof author === "string" ? author : author._id;
}

export function getMediaUrl(path?: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_URL}/${path.replace(/^\/+/, "")}`;
}
