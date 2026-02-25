import { Asset } from "expo-asset";

export async function preloadHeroImages(images: number[]) {
  try {
    if (images.length === 0) {
      return;
    }

    await Promise.all(
      images.map((assetModule) => Asset.fromModule(assetModule).downloadAsync()),
    );
  } catch (e) {
    console.warn("Hero image preload failed", e);
  }
}
