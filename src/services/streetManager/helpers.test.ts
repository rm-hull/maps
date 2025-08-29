import { describe, it, expect } from "vitest";
import { groupEventsByObjectRef } from "./helpers";
import { Event } from "./types";

describe("groupEventsByObjectRef", () => {
  it("should group events by object ref", () => {
    const events: Event[] = [
      { event_type: "type1", permit_reference_number: "ref1" },
      { event_type: "type2", work_reference_number: "ref2" },
      { event_type: "type3", permit_reference_number: "ref1" },
    ];

    const grouped = groupEventsByObjectRef(events);

    expect(grouped).toEqual({
      ref1: [
        { event_type: "type1", permit_reference_number: "ref1" },
        { event_type: "type3", permit_reference_number: "ref1" },
      ],
      ref2: [{ event_type: "type2", work_reference_number: "ref2" }],
    });
  });

  it("should handle events with no ref", () => {
    const events: Event[] = [{ event_type: "type1", permit_reference_number: "ref1" }, { event_type: "type2" }];

    const grouped = groupEventsByObjectRef(events);

    expect(grouped).toEqual({
      ref1: [{ event_type: "type1", permit_reference_number: "ref1" }],
    });
  });

  it("should handle empty array", () => {
    const events: Event[] = [];

    const grouped = groupEventsByObjectRef(events);

    expect(grouped).toEqual({});
  });
});
