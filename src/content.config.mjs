import { defineCollection, z } from "astro:content";
import qs from "qs";
import { getStrapiURL } from "./lib/utils";

const BASE_URL = getStrapiURL();

const strapiPostsLoader = defineCollection({
  loader: async () => {
    const path = `/api/post-groups/`;
    const url = new URL(path, BASE_URL);

    url.search = qs.stringify({
      sort: ["title:asc"],
      filters: {
        tag: {
          $eq: "paul-learns",
        },
      },
      populate: {
        posts: {
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
          },
        },
      },

      publicationState: "live",
      locale: ["en"],
    });

    const response = await fetch(url.href);
    const data = await response.json();
    const posts = data.data[0].posts;

    return posts.map((post) => {
      return {
        ...post,
        id: post.id.toString(),
      };
    });
  },

  schema: z.object({
    id: z.string(),
    documentId: z.string(),
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    content: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string(),
    image: z.object({
      id: z.number(),
      documentId: z.string(),
      url: z.string(),
      alternativeText: z.string().nullable(),
    }),
  }),
});

export const collections = {
  strapiPostsLoader,
};
