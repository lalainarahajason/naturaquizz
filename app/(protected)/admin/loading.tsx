import { Card, CardContent } from "@/components/ui/card";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
  return (
    <Card className="w-[600px]">
      <CardContent>
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
          <Skeleton />
          <Skeleton count={5} />
        </SkeletonTheme>
      </CardContent>
    </Card>
  );
}
