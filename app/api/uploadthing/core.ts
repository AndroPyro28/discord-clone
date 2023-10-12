import getCurrentUser, {TGetCurrentUser} from "@/actions/getCurrentUser";
import getSession from "@/actions/getSession";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { utapi } from "uploadthing/server";
 
const f = createUploadthing();
 
const auth = async (req: Request) => { 
    const currentUser = await getCurrentUser() as TGetCurrentUser

    if (!currentUser) throw new Error("Unauthorized");
    
    return {
        id: currentUser?.id
    }

}; // Fake auth function
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => await auth(req))
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.id);
      console.log("file url", file.url);
    }),
    messageFile: f({ image: { maxFileSize: "128MB", maxFileCount: 1 }, video: { maxFileSize: "128MB", maxFileCount: 1 }, pdf: { maxFileSize: "128MB", maxFileCount: 1 }})
    .middleware( async ({req}) => await auth(req))
    .onUploadComplete(async ({ metadata, file }) => {
        console.log("Upload complete for userId:", metadata.id);
        console.log("file url", file.url);
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;