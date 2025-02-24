import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  blogImageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      // Add any validation here
      return { }
    })
    .onUploadComplete(async ({ file }) => {
      // Handle successful upload
      return { url: file.url }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter 