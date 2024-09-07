// types/cloudinary.ts

export interface CloudinaryResource {
    asset_id: string;
    public_id: string;
    format: string;
    version: number;
    resource_type: string;
    type: string;
    created_at: string;
    bytes: number;
    width: number;
    height: number;
    url: string;
    secure_url: string;
  }
  
  export interface CloudinarySearchResult {
    resources: CloudinaryResource[];
    next_cursor: string | null;
    total_count: number;
  }