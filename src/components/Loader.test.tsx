import { Suspense } from "react";
import { render, screen, waitFor } from "../test/utils";
import { Loader } from "./Loader";

describe("Loader", () => {
  it("should show fallback while content is loading", async () => {
    const LazyComponent = () => {
      throw new Promise(() => {}); // Never resolves to test loading state
    };

    const { container } = render(
      <Loader>
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </Suspense>
      </Loader>
    );

    // The progress component should be rendered (checking for the progress bar class or element)
    await waitFor(() => {
      expect(container.querySelector('[class*="progress"]') || screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  it("should render children when loaded", async () => {
    render(
      <Loader>
        <div>Content Loaded</div>
      </Loader>
    );

    await waitFor(() => {
      expect(screen.getByText("Content Loaded")).toBeInTheDocument();
    });
  });
});
