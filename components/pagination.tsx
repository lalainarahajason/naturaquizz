import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {

  const RenderPaginationButtons = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }
    return <div className="flex space-x-2">{pageNumbers}</div>;
  };

  return (
    <div className="flex justify-center my-4">
      <RenderPaginationButtons />
    </div>
  );
};

export default Pagination;
