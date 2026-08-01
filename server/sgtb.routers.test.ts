import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

/**
 * The db module is mocked so these specs verify router behaviour and access
 * control without touching a live database.
 */
const dbMocks = vi.hoisted(() => ({
  listTracks: vi.fn(),
  createTrack: vi.fn(),
  updateTrack: vi.fn(),
  deleteTrack: vi.fn(),
  getMaxTrackSortOrder: vi.fn(),
  listCreators: vi.fn(),
  createCreator: vi.fn(),
  updateCreator: vi.fn(),
  deleteCreator: vi.fn(),
  getMaxCreatorSortOrder: vi.fn(),
  createContactMessage: vi.fn(),
  listContactMessages: vi.fn(),
}));

const storageMocks = vi.hoisted(() => ({
  storagePut: vi.fn(),
}));

vi.mock("./db", () => dbMocks);
vi.mock("./storage", () => storageMocks);

const { appRouter } = await import("./routers");

/** The template's admin middleware rejects with this message. */
const FORBIDDEN = /required permission/i;

type Role = "admin" | "user";

function makeContext(role?: Role): TrpcContext {
  const user =
    role === undefined
      ? null
      : {
          id: role === "admin" ? 1 : 2,
          openId: role === "admin" ? "owner-open-id" : "visitor-open-id",
          email: "person@example.com",
          name: role === "admin" ? "Owner" : "Visitor",
          loginMethod: "manus",
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  } as TrpcContext;
}

const ownerCaller = () => appRouter.createCaller(makeContext("admin"));
const visitorCaller = () => appRouter.createCaller(makeContext("user"));
const anonCaller = () => appRouter.createCaller(makeContext());

const AUDIO_INPUT = {
  fileName: "midnight-run.wav",
  contentType: "audio/wav",
  dataBase64: Buffer.from("fake-audio-bytes").toString("base64"),
};

beforeEach(() => {
  vi.clearAllMocks();
  dbMocks.getMaxTrackSortOrder.mockResolvedValue(3);
  dbMocks.getMaxCreatorSortOrder.mockResolvedValue(5);
  dbMocks.createTrack.mockResolvedValue(11);
  dbMocks.createCreator.mockResolvedValue(21);
  dbMocks.createContactMessage.mockResolvedValue(31);
  dbMocks.listTracks.mockResolvedValue([]);
  dbMocks.listCreators.mockResolvedValue([]);
  dbMocks.listContactMessages.mockResolvedValue([]);
  dbMocks.updateTrack.mockResolvedValue(undefined);
  dbMocks.updateCreator.mockResolvedValue(undefined);
  dbMocks.deleteTrack.mockResolvedValue(undefined);
  dbMocks.deleteCreator.mockResolvedValue(undefined);
  storageMocks.storagePut.mockResolvedValue({
    key: "sgtb/audio/midnight-run_abcd1234.wav",
    url: "/manus-storage/sgtb/audio/midnight-run_abcd1234.wav",
  });
});

describe("tracks router", () => {
  it("exposes the playlist publicly", async () => {
    dbMocks.listTracks.mockResolvedValue([{ id: 1, title: "Bridge The Gap" }]);

    const result = await anonCaller().tracks.list();

    expect(result).toEqual([{ id: 1, title: "Bridge The Gap" }]);
    expect(dbMocks.listTracks).toHaveBeenCalledTimes(1);
  });

  it("appends new tracks to the end of the playlist for the owner", async () => {
    const result = await ownerCaller().tracks.create({
      title: "Midnight Run",
      artist: "SGTB Music",
      audioUrl: "/manus-storage/audio.wav",
      audioKey: "sgtb/audio/audio.wav",
      coverVariant: 2,
    });

    expect(result).toEqual({ id: 11 });
    expect(dbMocks.createTrack).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Midnight Run", sortOrder: 4 }),
    );
  });

  it("rejects track uploads from non-owners", async () => {
    await expect(
      visitorCaller().tracks.create({
        title: "Not Allowed",
        artist: "SGTB Music",
        audioUrl: "/manus-storage/audio.wav",
        audioKey: "sgtb/audio/audio.wav",
        coverVariant: 0,
      }),
    ).rejects.toThrow(FORBIDDEN);
    expect(dbMocks.createTrack).not.toHaveBeenCalled();
  });

  it("rejects track deletion for anonymous visitors", async () => {
    await expect(anonCaller().tracks.remove({ id: 1 })).rejects.toThrow();
    expect(dbMocks.deleteTrack).not.toHaveBeenCalled();
  });

  it("rewrites sort order sequentially when reordering", async () => {
    await ownerCaller().tracks.reorder({ orderedIds: [7, 4, 9] });

    expect(dbMocks.updateTrack).toHaveBeenNthCalledWith(1, 7, { sortOrder: 1 });
    expect(dbMocks.updateTrack).toHaveBeenNthCalledWith(2, 4, { sortOrder: 2 });
    expect(dbMocks.updateTrack).toHaveBeenNthCalledWith(3, 9, { sortOrder: 3 });
  });
});

describe("creators router", () => {
  it("lists creator profiles publicly", async () => {
    dbMocks.listCreators.mockResolvedValue([{ id: 1, name: "Rosie Nguyen" }]);

    const result = await anonCaller().creators.list();

    expect(result).toEqual([{ id: 1, name: "Rosie Nguyen" }]);
  });

  it("serializes credentials as JSON when the owner creates a profile", async () => {
    await ownerCaller().creators.create({
      name: "New Creator",
      credentials: ["Head of Creators at Suno", "Forbes 30 Under 30"],
      isPlaceholder: false,
    });

    expect(dbMocks.createCreator).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "New Creator",
        credentials: '["Head of Creators at Suno","Forbes 30 Under 30"]',
        sortOrder: 6,
      }),
    );
  });

  it("leaves credentials untouched when the owner omits them on update", async () => {
    await ownerCaller().creators.update({ id: 4, role: "Creator Partnerships" });

    expect(dbMocks.updateCreator).toHaveBeenCalledWith(
      4,
      expect.not.objectContaining({ credentials: expect.anything() }),
    );
  });

  it("blocks non-owners from editing profiles", async () => {
    await expect(
      visitorCaller().creators.update({ id: 1, name: "Hijacked" }),
    ).rejects.toThrow(FORBIDDEN);
    expect(dbMocks.updateCreator).not.toHaveBeenCalled();
  });

  it("blocks non-owners from deleting profiles", async () => {
    await expect(visitorCaller().creators.remove({ id: 1 })).rejects.toThrow(FORBIDDEN);
    expect(dbMocks.deleteCreator).not.toHaveBeenCalled();
  });
});

describe("uploads router", () => {
  it("stores WAV masters under the audio prefix for the owner", async () => {
    const result = await ownerCaller().uploads.audio(AUDIO_INPUT);

    expect(storageMocks.storagePut).toHaveBeenCalledWith(
      "sgtb/audio/midnight-run.wav",
      expect.any(Buffer),
      "audio/wav",
    );
    expect(result.url).toContain("/manus-storage/");
  });

  it("refuses unsupported audio formats", async () => {
    await expect(
      ownerCaller().uploads.audio({ ...AUDIO_INPUT, contentType: "audio/flac" }),
    ).rejects.toThrow(/MP3 and WAV/i);
    expect(storageMocks.storagePut).not.toHaveBeenCalled();
  });

  it("refuses unsupported image formats", async () => {
    await expect(
      ownerCaller().uploads.image({
        fileName: "cover.gif",
        contentType: "image/gif",
        dataBase64: Buffer.from("img").toString("base64"),
        folder: "covers",
      }),
    ).rejects.toThrow(/PNG, JPEG/i);
  });

  it("blocks non-owners from uploading audio", async () => {
    await expect(visitorCaller().uploads.audio(AUDIO_INPUT)).rejects.toThrow(FORBIDDEN);
    expect(storageMocks.storagePut).not.toHaveBeenCalled();
  });
});

describe("contact router", () => {
  it("accepts inquiries from anonymous visitors", async () => {
    const result = await anonCaller().contact.submit({
      name: "Producer",
      email: "producer@example.com",
      projectType: "Full pipeline, start to finish",
      message: "I have a Suno session that needs finishing.",
    });

    expect(result).toEqual({ id: 31, success: true });
    expect(dbMocks.createContactMessage).toHaveBeenCalledTimes(1);
  });

  it("rejects malformed email addresses", async () => {
    await expect(
      anonCaller().contact.submit({
        name: "Producer",
        email: "not-an-email",
        message: "This should not pass validation.",
      }),
    ).rejects.toThrow();
    expect(dbMocks.createContactMessage).not.toHaveBeenCalled();
  });

  it("keeps the inbox owner-only", async () => {
    await expect(visitorCaller().contact.list()).rejects.toThrow(FORBIDDEN);
    expect(dbMocks.listContactMessages).not.toHaveBeenCalled();
  });
});
