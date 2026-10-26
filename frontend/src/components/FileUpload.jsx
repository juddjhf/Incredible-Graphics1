
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import uploadFile from "../services/uploadFile";

function FileUpload({
  accept = "image/*",
  label = "Select image",
  onUploaded,
  preview = "",
}) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(preview);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");

    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (uploading) return;

    if (!file) {
      setError("Pehle file select karo.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const result = await uploadFile(file);

      if (!result.success || !result.url) {
        throw new Error(result.message || "Upload failed.");
      }

      onUploaded({
        url: result.url,
        publicId: result.publicId || "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "File upload nahi hui."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-200">
        {label}
      </label>

      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="block w-full rounded-xl border border-white/10 bg-[#141419] p-3 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-[#750909] file:px-4 file:py-2 file:text-white"
      />

      {previewUrl && (
        accept.startsWith("video/") ? (
          <video
            src={previewUrl}
            controls
            className="max-h-64 w-full rounded-xl bg-black"
          />
        ) : (
          <img
            src={previewUrl}
            alt="Selected file preview"
            className="max-h-64 w-full rounded-xl object-contain"
          />
        )
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || uploading}
        className="rounded-xl bg-[#750909] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#580606] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? (
          <span className="inline-flex items-center gap-2">
            <LoaderCircle size={16} className="animate-spin" />
            Uploading...
          </span>
        ) : (
          "Upload File"
        )}
      </button>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default FileUpload;
