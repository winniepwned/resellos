import { describe, it, expect, beforeEach } from "vitest";
import { useItemsStore } from "@/stores/items.store";

describe("items.store", () => {
  beforeEach(() => {
    useItemsStore.setState({
      viewMode: "table",
      statusFilter: null,
      brandFilter: null,
      searchQuery: "",
    });
  });

  it("defaults viewMode to 'table'", () => {
    expect(useItemsStore.getState().viewMode).toBe("table");
  });

  it("sets status filter", () => {
    useItemsStore.getState().setStatusFilter("listed");
    expect(useItemsStore.getState().statusFilter).toBe("listed");

    useItemsStore.getState().setStatusFilter(null);
    expect(useItemsStore.getState().statusFilter).toBeNull();
  });

  it("sets search query", () => {
    useItemsStore.getState().setSearchQuery("Nike Dunk");
    expect(useItemsStore.getState().searchQuery).toBe("Nike Dunk");
  });
});
