import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

export function firebaseUpload(file: File, userId: string) {
    const bucket = `${userId}/${file.name}`;
    const storageRef = ref(storage, bucket);
    const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type
    });
    return uploadTask;
}
