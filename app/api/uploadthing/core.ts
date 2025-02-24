import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique route key
  blogImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // Return metadata to be stored with the file
      return { timestamp: new Date().toISOString() }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for timestamp:", metadata.timestamp)
      console.log("File URL:", file.url)

      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter 