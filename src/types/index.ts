export type ApplicationStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "needs_info";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export type ApiResponse<T = unknown> = {
  ok: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  coverImage: string;
  readingMinutes: number;
};
