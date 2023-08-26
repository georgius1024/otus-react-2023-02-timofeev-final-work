import { storageRef, uploadBytes, getDownloadURL } from "@/firebase";

export default async function uploadImage(file: File, name: string): Promise<string> {
  const fileRef = storageRef(name)
  const snapshot = await uploadBytes(fileRef, file)
  return await getDownloadURL(snapshot.ref)
}


