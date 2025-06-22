import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUpload } from "@/hooks/use-upload";

export default function ImageUploadPage() {
    const [number, setNumber] = useState(0);

    const subirTodasLasImagenes = async (index) => {
        await useUpload(index);
        setNumber(index + 2);
        console.log(index);
        await subirTodasLasImagenes(index + 2);
    }

  return (
    <div>
      <h1>Image Upload Page</h1>
      <Button onClick={() => {subirTodasLasImagenes(number)}}>Upload Image</Button>
      <input type="number" value={number} onChange={(e) => setNumber(Number(e.target.value))} />
    </div>
  );
}

