import { it, describe, expect } from "vitest";
import viteVueFastifyDX from "../plugin.cjs";

describe("viteVueFastifyDX", () => {
  it("returns the plugin object", () => {
    const plugin = viteVueFastifyDX();
    expect(plugin).toStrictEqual({
      config: expect.any(Function),
      configResolved: expect.any(Function),
      load: expect.any(Function),
      name: "vite-plugin-vue-fastify-dx",
      resolveId: expect.any(Function),
    });
  });
});
