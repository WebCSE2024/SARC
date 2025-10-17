import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sarcAPI } from "../../../../../shared/axios/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";
import PublicationTable from "./components/PublicationTable";
import { getSocket, closeSocket } from "../../utils/socketClient";
import "./PostPublication.scss";
import { UserType } from "../../../../../shared/types/user.type";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

const createEmptyEntry = () => ({
  id: crypto.randomUUID(),
  mongoId: undefined,
  title: "",
  authors: "",
  publicationType: "",
  publisherName: "",
  year: "",
  volume: "",
  issue: "",
  pages: "",
  issn: "",
  isbn: "",
  description: "",
});

const joinList = (value) => {
  if (!value) return "";
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return String(value);
};

const toEditableEntry = (entry) => ({
  id: crypto.randomUUID(),
  mongoId: entry._id,
  title: entry.title ?? "",
  authors: joinList(entry.authors),
  publicationType: entry.publicationType ?? "",
  publisherName: entry.publisherName ?? "",
  year: entry.year ? String(entry.year) : "",
  volume: entry.volume ?? "",
  issue: entry.issue ?? "",
  pages: entry.pages ?? "",
  issn: entry.issn ?? "",
  isbn: entry.isbn ?? "",
  description: entry.description ?? "",
});

const toEntryUpdate = (entry) => {
  if (!entry.mongoId) {
    return null;
  }

  // Normalize authors: convert comma-separated string to array
  const authorsArray =
    typeof entry.authors === "string"
      ? entry.authors
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean)
      : Array.isArray(entry.authors)
      ? entry.authors
      : [];

  // Normalize year: convert to number
  const yearValue = entry.year ? Number(entry.year) : undefined;

  return {
    entryId: entry.mongoId,
    title: entry.title?.trim() || undefined,
    authors: authorsArray,
    publicationType: entry.publicationType?.trim() || undefined,
    publisherName: entry.publisherName?.trim() || undefined,
    year: yearValue && !isNaN(yearValue) ? yearValue : undefined,
    volume: entry.volume?.trim() || undefined,
    issue: entry.issue?.trim() || undefined,
    pages: entry.pages?.trim() || undefined,
    issn: entry.issn?.trim() || undefined,
    isbn: entry.isbn?.trim() || undefined,
    description: entry.description?.trim() || undefined,
  };
};

const PostPublication = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user, token } = useAuth();

  const [initializing, setInitializing] = useState(true);
  const [entries, setEntries] = useState([]);
  const [publication, setPublication] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [finalizing, setFinalizing] = useState(false);

  const userRole = user?.userType?.toUpperCase();

  useEffect(() => {
    if (!user) {
      return;
    }
    if (userRole !== UserType.PROFESSOR && userRole !== UserType.ADMIN) {
      toast.error("Only professors and admins can manage publications");
      navigate("/profile");
    }
  }, [user, userRole, navigate]);

  const fetchState = useCallback(async () => {
    try {
      setInitializing(true);
      const response = await sarcAPI.get("sarc/v0/publication/me");
      const pub = response.data?.data;

      setPublication(pub);

      if (pub?.entries?.length) {
        setEntries(pub.entries.map(toEditableEntry));
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error("Failed to load publication state", error);
      toast.error(
        error.response?.data?.message || "Failed to load publications"
      );
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const socket = getSocket(token);
      if (socket) {
        socket.on("publication:extraction-complete", () => {
          toast.success("Publication extraction finished");
          setUploading(false);
          fetchState();
        });

        socket.on("publication:extraction-failed", (payload) => {
          toast.error(payload?.error || "Publication extraction failed");
          setUploading(false);
        });

        socket.on("publication:finalized", (payload) => {
          toast.success("Publication list finalized");
          setPublication((prev) => ({
            ...(prev ?? {}),
            status: "FINALIZED",
            finalizedAt: payload?.finalizedAt || new Date().toISOString(),
          }));
        });

        return () => {
          socket.off("publication:extraction-complete");
          socket.off("publication:extraction-failed");
          socket.off("publication:finalized");
        };
      }
    }
    return () => closeSocket();
  }, [token, fetchState]);

  useEffect(() => {
    if (userRole === UserType.PROFESSOR || userRole === UserType.ADMIN) {
      fetchState();
    }
  }, [fetchState, userRole]);

  const handleFieldChange = (entryId, field, value) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleRemoveRow = (entryId) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  };

  const handleAddRow = () => {
    setEntries((prev) => [...prev, createEmptyEntry()]);
  };

  const handleFinalize = async () => {
    try {
      setFinalizing(true);

      // Separate new entries (no mongoId) from existing entries (has mongoId)
      const newEntries = entries
        .filter((entry) => !entry.mongoId)
        .map((entry) => ({
          title: entry.title?.trim() || undefined,
          authors: entry.authors
            ? entry.authors
                .split(",")
                .map((a) => a.trim())
                .filter((a) => a.length > 0)
            : [],
          publicationType: entry.publicationType?.trim() || undefined,
          publisherName: entry.publisherName?.trim() || undefined,
          year: entry.year || undefined,
          volume: entry.volume?.trim() || undefined,
          issue: entry.issue?.trim() || undefined,
          pages: entry.pages?.trim() || undefined,
          issn: entry.issn?.trim() || undefined,
          isbn: entry.isbn?.trim() || undefined,
          description: entry.description?.trim() || undefined,
        }));

      const entryUpdates = entries
        .filter((entry) => entry.mongoId)
        .map(toEntryUpdate)
        .filter(Boolean);

      if (newEntries.length === 0 && entryUpdates.length === 0) {
        toast.error("No entries to finalize");
        return;
      }

      const response = await sarcAPI.post("sarc/v0/publication/finalize", {
        newEntries,
        entryUpdates,
      });
      const pub = response.data?.data;
      setPublication(pub);
      if (pub?.entries) {
        setEntries(pub.entries.map(toEditableEntry));
      }
      toast.success("Publication list finalized");
    } catch (error) {
      console.error("Failed to finalize publication", error);
      toast.error(error.response?.data?.message || "Failed to finalize");
    } finally {
      setFinalizing(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("PDF must be smaller than 25MB");
      return;
    }

    const formData = new FormData();
    formData.append("publication_pdf", file);

    try {
      setUploading(true);
      const response = await sarcAPI.post(
        "sarc/v0/publication/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.info("PDF received. Extraction started.");
      setEntries([]);
    } catch (error) {
      console.error("Upload failed", error);
      toast.error(error.response?.data?.error || "Failed to upload PDF");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const currentStatus = useMemo(() => {
    if (uploading) return "UPLOADING";
    if (publication?.status === "FINALIZED") return "FINALIZED";
    if (entries.length > 0) return "PENDING_REVIEW";
    return "IDLE";
  }, [uploading, publication, entries.length]);

  if (
    !user ||
    (userRole !== UserType.PROFESSOR && userRole !== UserType.ADMIN)
  ) {
    return null;
  }

  return (
    <div className="post-publication-page">
      <header className="page-header">
        <div>
          <h1>Manage Publications</h1>
          <p>
            Upload a publication list PDF or edit the extracted records below.
          </p>
        </div>
        <div className={`status-chip status-${currentStatus.toLowerCase()}`}>
          {currentStatus.replace("_", " ")}
        </div>
      </header>

      {/* <section className="upload-panel">
        <div className="upload-actions">
          <button
            type="button"
            className="primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "Upload publication PDF"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            hidden
          />
          <span className="hint">Accepted format: PDF, up to 25MB.</span>
        </div>
        {uploading && (
          <div className="processing-banner">
            Processing PDF. You can continue editing while we extract
            publications.
          </div>
        )}
      </section> */}

      <section className="table-panel">
        <div className="panel-header">
          <h2>Publication entries</h2>
          <div className="meta">
            {publication?.status === "FINALIZED" &&
              publication?.finalizedAt && (
                <span>
                  Finalized on{" "}
                  {new Date(publication.finalizedAt).toLocaleString()}
                </span>
              )}
          </div>
        </div>

        {initializing ? (
          <div className="loading-state">Loading publications…</div>
        ) : (
          <PublicationTable
            entries={entries}
            onFieldChange={handleFieldChange}
            onRemoveRow={handleRemoveRow}
            onAddRow={handleAddRow}
            disabled={uploading}
          />
        )}
      </section>

      <section className="actions-panel">
        <div className="left-actions">
          <button
            type="button"
            className="secondary"
            onClick={handleAddRow}
            disabled={uploading}
          >
            Add publication
          </button>
        </div>
        <div className="right-actions">
          <button
            type="button"
            className="primary"
            onClick={handleFinalize}
            disabled={finalizing || uploading || entries.length === 0}
          >
            {finalizing ? "Finalizing…" : "Finalize & Save"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default PostPublication;
