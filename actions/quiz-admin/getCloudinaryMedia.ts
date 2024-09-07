// app/actions/getCloudinaryMedia.ts
'use server'

import cloudinary from "@/lib/cloudinary";
import { CloudinarySearchResult } from "@/schemas/cloudinary";

interface GetCloudinaryMediaOptions {
  expression?: string;
  max_results?: number;
  next_cursor?: string;
  with_field?: string;
  sort_by?: { [key: string]: 'desc' | 'asc' }[];
}

export async function getCloudinaryMedia(options: GetCloudinaryMediaOptions = {}): Promise<CloudinarySearchResult> {
  const {
    expression = '',
    max_results = 20,
    next_cursor = '',
    with_field = 'tags',
    sort_by = [{ created_at: 'desc' }],
  } = options;

  try {
    const results = await cloudinary.search
      .expression(expression || 'resource_type:image')
      .max_results(max_results)
      .next_cursor(next_cursor)
      .with_field(with_field)
      .execute();

    return {
      resources: results.resources,
      next_cursor: results.next_cursor,
      total_count: results.total_count,
    };
  } catch (error) {
    console.error('Error fetching Cloudinary media:', error);
    return { resources: [], next_cursor: null, total_count: 0 };
  }
}