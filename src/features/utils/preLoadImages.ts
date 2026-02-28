import { Asset } from "expo-asset";

export async function preloadHeroImages(
  images: number[] | { source: number }[],
) {
  try {
    if (images.length === 0) {
      return;
    }

    const modules = images.map((img) =>
      typeof img === "number" ? img : img.source,
    );
    await Promise.all(
      modules.map((assetModule) =>
        Asset.fromModule(assetModule).downloadAsync(),
      ),
    );
  } catch (e) {
    console.warn("Hero image preload failed", e);
  }
}
