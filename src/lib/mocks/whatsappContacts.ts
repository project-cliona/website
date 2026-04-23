import type { WhatsappContact, WhatsappContactTag, CsvImportResult } from "@/lib/type";

let idSeq = 1000;
const nextId = () => ++idSeq;
const nowIso = () => new Date().toISOString();

const seed: WhatsappContact[] = (() => {
  const tagsPool = [
    ["vip"],
    ["vip", "nov-2026"],
    ["nov-2026"],
    ["event-mumbai"],
    ["paid-customer"],
    [],
  ];
  const names = [
    "Aarav Mehta",
    "Diya Sharma",
    "Kabir Rao",
    "Ishaan Kapoor",
    "Ananya Iyer",
    null,
  ];
  const out: WhatsappContact[] = [];
  for (let i = 0; i < 40; i++) {
    out.push({
      id: nextId(),
      userId: 1,
      phone: `9198${String(10_000_000 + i).padStart(8, "0")}`,
      name: names[i % names.length],
      email: i % 3 === 0 ? null : `user${i}@example.com`,
      tags: tagsPool[i % tagsPool.length],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
  }
  return out;
})();

export const mockContactsStore = {
  all: () => seed.slice(),
  findById: (id: number) => seed.find((c) => c.id === id) ?? null,
  findByPhone: (phone: string) => seed.find((c) => c.phone === phone) ?? null,

  create: (
    input: Omit<WhatsappContact, "id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    if (seed.some((c) => c.phone === input.phone)) {
      throw new Error("Phone already exists");
    }
    const c: WhatsappContact = {
      ...input,
      id: nextId(),
      userId: 1,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    seed.unshift(c);
    return c;
  },

  update: (id: number, patch: Partial<WhatsappContact>) => {
    const idx = seed.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Not found");
    seed[idx] = { ...seed[idx], ...patch, updatedAt: nowIso() };
    return seed[idx];
  },

  delete: (id: number) => {
    const idx = seed.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    seed.splice(idx, 1);
    return true;
  },

  bulkDelete: (ids: number[]) => {
    let deleted = 0;
    for (const id of ids) if (mockContactsStore.delete(id)) deleted++;
    return deleted;
  },

  tags: (): WhatsappContactTag[] => {
    const counts = new Map<string, number>();
    for (const c of seed) {
      for (const t of c.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([tag, contactCount]) => ({ tag, contactCount }))
      .sort((a, b) => b.contactCount - a.contactCount);
  },

  importCsv: (csvText: string): CsvImportResult => {
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length === 0) {
      return {
        added: 0,
        updated: 0,
        skipped: 0,
        columnsIgnored: [],
        errors: [],
        listId: null,
      };
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const known = new Set(["phone", "name", "email", "tags"]);
    const columnsIgnored = headers.filter((h) => !known.has(h));
    const col = (h: string) => headers.indexOf(h);

    let added = 0;
    let updated = 0;
    let skipped = 0;
    const errors: CsvImportResult["errors"] = [];
    const seenInFile = new Map<string, number>();

    for (let i = 1; i < lines.length; i++) {
      const rowNum = i + 1;
      const cells = lines[i].split(",").map((c) => c.trim());
      const rawPhone = cells[col("phone")] ?? "";
      const phone = rawPhone.replace(/\D/g, "");

      if (!phone) {
        errors.push({
          row: rowNum,
          phone: rawPhone || null,
          reason: "Missing phone",
        });
        skipped++;
        continue;
      }
      if (phone.length < 10 || phone.length > 15) {
        errors.push({ row: rowNum, phone: rawPhone, reason: "Invalid phone" });
        skipped++;
        continue;
      }
      if (seenInFile.has(phone)) {
        errors.push({
          row: rowNum,
          phone,
          reason: `Duplicate in file (first at row ${seenInFile.get(phone)})`,
        });
        skipped++;
        continue;
      }
      seenInFile.set(phone, rowNum);

      const name = col("name") >= 0 ? cells[col("name")] || null : null;
      const email = col("email") >= 0 ? cells[col("email")] || null : null;
      const tags =
        col("tags") >= 0
          ? (cells[col("tags")] || "")
              .split(/[,;|]/)
              .map((t) => t.trim().toLowerCase())
              .filter(Boolean)
          : [];

      const existing = seed.find((c) => c.phone === phone);
      if (existing) {
        const mergedTags = Array.from(new Set([...existing.tags, ...tags]));
        mockContactsStore.update(existing.id, {
          name: existing.name || name,
          email: existing.email || email,
          tags: mergedTags,
        });
        updated++;
      } else {
        mockContactsStore.create({ phone, name, email, tags });
        added++;
      }
    }

    return {
      added,
      updated,
      skipped,
      columnsIgnored,
      errors,
      listId: null,
    };
  },
};
