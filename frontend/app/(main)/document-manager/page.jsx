"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { FaFileAlt, FaUpload, FaTrash, FaDownload, FaFolder } from "react-icons/fa";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = [
  { id: 'resume', name: 'Resumes', icon: '📄' },
  { id: 'certificate', name: 'Certificates', icon: '🎓' },
  { id: 'academic', name: 'Academic', icon: '📚' },
  { id: 'other', name: 'Other', icon: '📁' }
];

export default function DocumentManagerPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/documents?clerkId=${user?.id}`);
      if (!res.ok) throw new Error('Failed to fetch documents');
      const data = await res.json();
      setDocuments(data);
      setError(null); // Clear any existing errors
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
      toast.error('Failed to load documents');
    }
  };

  // Build a safe downloadable URL for a stored document
  const getFileUrl = (filePath, fileName) => {
    if (!filePath && !fileName) return '#';

    try {
      // Prefer to derive a path under the "uploads" folder (server serves /uploads)
      if (typeof filePath === 'string') {
        const idx = filePath.indexOf('uploads');
        if (idx !== -1) {
          // take from 'uploads' onward and normalize separators
          const rel = filePath.slice(idx).replace(/\\/g, '/');
          return `${API_URL}/${rel}`;
        }
      }

      // Fallback: construct using known uploads/documents and stored fileName
      if (fileName) {
        return `${API_URL}/uploads/documents/${encodeURIComponent(fileName)}`;
      }

      return '#';
    } catch (e) {
      console.error('Error building file URL', e);
      return '#';
    }
  };

  // Separate effect for auth state
  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id) {
      fetchDocuments();
    }
  }, [isLoaded, isSignedIn, user?.id]);

  // Reset documents when user signs out
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setDocuments([]);
      setError(null);
    }
  }, [isLoaded, isSignedIn]);

  const handleUpload = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!title.trim()) {
      setError("Please provide a title");
      toast.error("Please provide a title");
      return;
    }
    if (!file) {
      setError("Please select a file");
      toast.error("Please select a file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File size exceeds 10MB limit");
      toast.error("File size exceeds 10MB limit");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', selectedCategory);
      formData.append('clerkId', user.id);

      const res = await fetch(`${API_URL}/api/documents`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it automatically with boundary
      });

      if (!res.ok) {
        let errorMessage;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || 'Upload failed';
        } catch (e) {
          errorMessage = await res.text() || 'Upload failed';
        }
        throw new Error(errorMessage);
      }

      const newDoc = await res.json();
      setDocuments(prev => [newDoc, ...prev]);
      setTitle("");
      setDescription("");
      setFile(null);
      setSelectedCategory('all');
      toast.success('Document uploaded successfully');
    } catch (err) {
      console.error('Error uploading document:', err);
      setError(err.message || 'Failed to upload document');
      toast.error(err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clerkId: user.id }),
      });

      if (!res.ok) throw new Error('Failed to delete document');

      setDocuments(prev => prev.filter(doc => doc._id !== documentId));
      toast.success('Document deleted successfully');
    } catch (err) {
      console.error('Error deleting document:', err);
      toast.error('Failed to delete document');
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Please sign in to access your documents</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            📁 Document Manager
          </h1>
          <div className="flex items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-lg px-4 py-2 bg-blue-400"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="md:col-span-1">
            <div className="bg-blue-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaUpload className="text-blue-600" /> Upload Document
              </h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 ">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    placeholder="Enter document title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    placeholder="Add a description"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">File</label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    required
                  />
                  <p className="text-xs text-black mt-1 ">
                    Accepted formats: PDF, DOC, DOCX, JPG, PNG (max 10MB)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className={`w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition-colors
                    ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </button>
              </form>
            </div>
          </div>

          {/* Documents List */}
          <div className="md:col-span-2">
            <div className="bg-blue-400 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaFileAlt className="text-blue-600" /> Your Documents
              </h2>

              {documents.length === 0 ? (
                <div className="text-center py-8 text-black">
                  No documents uploaded yet
                </div>
              ) : (
                <div className="space-y-4">
                  {documents
                    .filter(doc => selectedCategory === 'all' || doc.category === selectedCategory)
                    .map((doc) => (
                      <div
                        key={doc._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{doc.title}</h3>
                          {doc.description && (
                            <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>{categories.find(c => c.id === doc.category)?.icon || '📄'}</span>
                            <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                            <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <a
                            href={getFileUrl(doc.filePath, doc.fileName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Download"
                          >
                            <FaDownload />
                          </a>
                          <button
                            onClick={() => handleDelete(doc._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
