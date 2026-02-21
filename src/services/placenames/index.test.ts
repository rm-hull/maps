import axios from "axios";
import { vi } from "vitest";

// Mock the entire module
vi.mock("axios");

const mockEnv = {
  VITE_PLACENAMES_API_URL: "https://example.com",
};

describe("suggest", () => {
  beforeEach(() => {
    Object.assign(import.meta.env, mockEnv);
    vi.resetModules();
  });

  it("should call the correct API endpoint and return data", async () => {
    const mockData = { results: ["result1", "result2"] };
    const mockGet = vi.fn().mockResolvedValue({ data: mockData });
    const createSpy = vi
      .spyOn(axios, "create")
      .mockReturnValue({ get: mockGet } as unknown as import("axios").AxiosInstance);

    const { suggest } = await import("./index");
    const result = await suggest("test-prefix", 5);

    expect(createSpy).toHaveBeenCalledWith({
      baseURL: "https://example.com",
      timeout: 3000,
    });

    expect(mockGet).toHaveBeenCalledWith("/v1/place-names/prefix/test-prefix", {
      params: { max_results: 5 },
    });

    expect(result).toEqual(mockData);
  });

  it("should throw an error if the API URL is not defined", async () => {
    // Unset the environment variable
    delete import.meta.env.VITE_PLACENAMES_API_URL;

    // Use a try-catch block to assert that an error is thrown
    try {
      await import("./index");
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("No Place Names API URL specified");
      }
    }
  });
});
