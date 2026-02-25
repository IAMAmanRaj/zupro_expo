import { Image } from "expo-image";

export async function preloadHeroImages(images: Array<number | string>) {
  try {
    const remoteImageUrls = images.filter(
      (image): image is string => typeof image === "string",
    );

    if (remoteImageUrls.length === 0) {
      return;
    }

    await Image.prefetch(remoteImageUrls);
  } catch (e) {
    console.warn("Hero image preload failed", e);
  }
}
