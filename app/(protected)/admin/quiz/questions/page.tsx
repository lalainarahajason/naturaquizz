import { useState } from "react";
import { useForm, useFieldArray } from 'react-hook-form';


import { 
  Card,
  CardHeader,
  CardContent
} from "@/components/ui/card"

function AddQuestion() {
  return (
    <Card>
      <CardHeader className="uppercase text-center font-bold">
        <>Ajouter une question</>
      </CardHeader>
      <CardContent>content</CardContent>
    </Card>
  )
}

export default AddQuestion