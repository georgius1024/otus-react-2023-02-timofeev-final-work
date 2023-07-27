import { ref, uploadBytes } from "@/firebase";

export default async function uploadImage(file: File, name: string): Promise<void> {
  const fileRef = ref(name)
  await uploadBytes(fileRef, file)
}


