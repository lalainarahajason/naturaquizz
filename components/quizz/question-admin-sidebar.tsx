import { Button } from "@/components/ui/button";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Check, Trash2Icon, Loader2 } from "lucide-react";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { QuestionSidebarEditProps } from "@/type/quiz";

const QuestionSidebar = ({
  form,
  imageUrl,
  isPending,
  initialData,
  handleImageUpload,
  handleImageDelete,
  onSubmit,
  selectedQuiz,
}: QuestionSidebarEditProps) => {
  return (
    <Card className="w-full lg:w-[380px]">
      <CardHeader className="border-b">
        <div className="flex justify-between">
          Publier{" "}
          {selectedQuiz && (
            <span className="text-sm text-gray-400">{selectedQuiz}</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="grid gap-4 mt-4">
          {imageUrl && (
            <div className="flex flex-col gap-4">
              <div className="w-full h-[200px] grid relative">
                <Image
                  src={imageUrl}
                  fill={true}
                  style={{ objectFit: "cover" }}
                  className="mt-2 max-w-xs w-full"
                  alt=""
                  priority={false}
                />
              </div>
            </div>
          )}
          <FormMessage />
          <div className="flex justify-between items-center">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <CldUploadButton
                      className="bg-primary text-white rounded-md text-xs px-4 py-2 ml-4"
                      uploadPreset="aaospnok"
                      onSuccess={handleImageUpload}
                      options={{
                        tags: ['naturaquiz'], // Add tags here
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {imageUrl && (
              <Button
                onClick={handleImageDelete}
                className={
                  isPending ? "pointer-events-none opacity-50" : "mt-2"
                }
                variant="destructive"
                type="button"
                size="icon"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {!isPending && <Trash2Icon className="h-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <div className="grid grid-flow-col gap-4">
          <Button
            type="button"
            variant="outline"
            className={isPending ? "pointer-events-none opacity-50" : ""}
          >
            <Link href="/admin/quiz/liste">Toutes les questions</Link>
          </Button>

          <Button
            disabled={isPending}
            variant="success"
            onClick={form.handleSubmit(onSubmit)}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isPending && <Check className="mr-2 h-4 w-4" />}
            {!initialData ? "Enregistrer" : "Mettre à jour"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuestionSidebar;
