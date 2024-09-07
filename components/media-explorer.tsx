import React, { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { getCloudinaryMedia } from '@/actions/quiz-admin/getCloudinaryMedia';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CloudinarySearchResult, CloudinaryResource } from '@/schemas/cloudinary';

interface MediaExplorerProps {
  initialData: CloudinarySearchResult;
}

const MediaExplorer: React.FC<MediaExplorerProps> = ({ initialData }:{initialData:CloudinarySearchResult|undefined}) => {
  const [mediaData, setMediaData] = useState<CloudinarySearchResult|undefined>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const data = await getCloudinaryMedia({
      expression: searchTerm ? `resource_type:image AND ${searchTerm}` : 'resource_type:image',
    });
    setMediaData(data);
    setLoading(false);
  };

  const handleLoadMore = async () => {
    if (mediaData?.next_cursor) {
      setLoading(true);
      const newData = await getCloudinaryMedia({
        expression: searchTerm ? `resource_type:image AND ${searchTerm}` : 'resource_type:image',
        next_cursor: mediaData.next_cursor,
      });
      setMediaData(prevData => ({
        ...newData,
        resources: [...(prevData?.resources ?? []), ...newData.resources],
      }));
      setLoading(false);
    }
  };

  const handleMediaClick = (media:CloudinaryResource) => {
    console.log(media)
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search media..."
          className="flex-grow"
        />
        <Button onClick={handleSearch} disabled={loading}>Search</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaData?.resources.map((item: CloudinaryResource) => (
          <Card key={item.asset_id}>
            <CardContent className="p-2">
              <div className="aspect-w-16 aspect-h-9 relative">
                <CldImage
                  width="400"
                  height="300"
                  src={item.public_id}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  alt={item.public_id.split('/').pop() || ''}
                  className="object-cover rounded-t-lg"
                  onClick={() => handleMediaClick(item)}
                />
              </div>
              <p className="mt-2 text-sm font-semibold truncate">{item.public_id.split('/').pop()}</p>
              <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {mediaData?.next_cursor && (
        <div className="flex justify-center">
          <Button onClick={handleLoadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MediaExplorer;