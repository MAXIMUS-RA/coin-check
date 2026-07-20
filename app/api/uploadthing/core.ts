import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth"; 

const f = createUploadthing();

export const ourFileRouter = {
   categoryImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
      .middleware(async () => {
         const session = await auth();
         if (!session?.user) throw new Error("Unauthorized");
         return { userId: session.user.id };
      })
      .onUploadComplete(async ({ metadata, file }) => {
         return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
      }),
   profileImage: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
      .middleware(async () => {
         const session = await auth();
         if (!session?.user) throw new Error("Unauthorized");
         return { userId: session.user.id };
      })
      .onUploadComplete(async ({ metadata, file }) => {
         return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
      }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
