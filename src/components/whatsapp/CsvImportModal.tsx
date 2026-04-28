"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importContactsCsv } from "@/lib/api/whatsapp/contacts";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Upload } from "lucide-react";
import type { CsvImportResult } from "@/lib/type";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CsvImportModal({ open, onClose }: Props) {
  const qc = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [saveAsListEnabled, setSaveAsListEnabled] = useState(false);
  const [listName, setListName] = useState("");
  const [result, setResult] = useState<CsvImportResult | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Pick a CSV first");
      return importContactsCsv(file, {
        saveAsList: saveAsListEnabled ? listName : null,
      });
    },
    onSuccess: (r) => {
      setResult(r);
      setErr(null);
      qc.invalidateQueries({ queryKey: ["whatsapp-contacts"] });
      qc.invalidateQueries({ queryKey: ["whatsapp-lists"] });
      qc.invalidateQueries({ queryKey: ["whatsapp-tags"] });
    },
    onError: (e: Error) => setErr(e.message),
  });

  const reset = () => {
    setFile(null);
    setSaveAsListEnabled(false);
    setListName("");
    setResult(null);
    setErr(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            Import contacts from CSV
          </h2>
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!result ? (
            <>
              {!file ? (
                <label className="block border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-blue-400">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to choose a CSV file
                  </p>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) =>
                      setFile(e.target.files?.[0] ?? null)
                    }
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 border rounded-lg px-4 py-3">
                  <span className="text-sm truncate">{file.name}</span>
                  <button
                    onClick={() => setFile(null)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Remove file
                  </button>
                </div>
              )}

              <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
                <p className="font-medium text-gray-700 mb-1">
                  Your CSV must have these columns (header row required):
                </p>
                <ul className="space-y-0.5">
                  <li>
                    <code>phone</code> — required (e.g., 919876543210)
                  </li>
                  <li>
                    <code>name</code> — optional
                  </li>
                  <li>
                    <code>email</code> — optional
                  </li>
                  <li>
                    <code>tags</code> — optional, comma- or pipe-separated
                    inside the cell
                  </li>
                </ul>
              </div>

              <label className="flex items-start gap-2">
                <Checkbox
                  checked={saveAsListEnabled}
                  onCheckedChange={(v) => setSaveAsListEnabled(!!v)}
                  className="mt-0.5"
                />
                <span className="text-sm text-gray-700 flex-1">
                  Save these contacts as a list
                  {saveAsListEnabled && (
                    <Input
                      className="mt-2"
                      placeholder="List name"
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                    />
                  )}
                </span>
              </label>

              {err && (
                <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                  {err}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <h3 className="font-semibold text-green-700">
                ✅ Import complete
              </h3>
              <ul className="text-sm space-y-1">
                <li>
                  <strong>{result.added}</strong> new contacts added
                </li>
                <li>
                  <strong>{result.updated}</strong> existing contacts updated
                  (tags merged, blank fields filled)
                </li>
                <li>
                  <strong>{result.skipped}</strong> rows skipped (invalid or
                  missing phone)
                </li>
              </ul>
              {result.columnsIgnored.length > 0 && (
                <div className="text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded p-3">
                  Columns ignored: {result.columnsIgnored.join(", ")}. Your
                  CSV had headers we don&apos;t recognize.
                </div>
              )}
              {result.errors.length > 0 && (
                <details>
                  <summary className="cursor-pointer text-gray-700 text-sm">
                    Show {result.errors.length} error rows
                  </summary>
                  <div className="mt-2 max-h-40 overflow-auto bg-gray-50 rounded p-2 font-mono text-xs">
                    {result.errors.map((e, i) => (
                      <div key={i}>
                        Row {e.row}: {e.phone ?? "—"} — {e.reason}
                      </div>
                    ))}
                  </div>
                </details>
              )}
              {result.listId && (
                <p className="text-sm text-gray-700">
                  List created and populated.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-3">
          {!result ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  reset();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => mutation.mutate()}
                disabled={
                  !file ||
                  mutation.isPending ||
                  (saveAsListEnabled && !listName.trim())
                }
              >
                {mutation.isPending ? "Importing…" : "Import contacts"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
