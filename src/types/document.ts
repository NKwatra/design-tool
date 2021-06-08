export interface UserDocument {
  title: string;
  url: string;
  lastAccessedAt: string;
  id: string;
}

export interface Version {
  image: string;
  updatedAt: string;
  label?: string;
}
