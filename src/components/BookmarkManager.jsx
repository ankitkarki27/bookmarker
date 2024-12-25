import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import feather from 'feather-icons'; // Import Feather Icons

function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('bookmarks')) || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', url: '' });
  const [editingBookmarkId, setEditingBookmarkId] = useState(null);
  
  // State for the alert message and type (success, error, etc.)
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success'); // 'success' or 'error'

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    feather.replace(); // Replace Feather icons after the bookmarks are updated
  }, [bookmarks]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { name, url } = formData;

    if (editingBookmarkId) {
      setBookmarks((prev) =>
        prev.map((bookmark) =>
          bookmark.id === editingBookmarkId
            ? { ...bookmark, name, url, date: new Date().toISOString() }
            : bookmark
        )
      );
      setEditingBookmarkId(null);
      showAlert('Bookmark updated successfully!', 'success');
    } else {
      setBookmarks((prev) => [
        ...prev,
        { id: Date.now(), name, url, date: new Date().toISOString() },
      ]);
      showAlert('Bookmark added successfully!', 'success');
    }

    setFormData({ name: '', url: '' });
    setModalOpen(false);
  };

  const handleDeleteBookmark = (id) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
    showAlert('Bookmark deleted successfully!', 'error');
  };

  const handleEditBookmark = (id) => {
    const bookmark = bookmarks.find((b) => b.id === id);
    if (bookmark) {
      setFormData({ name: bookmark.name, url: bookmark.url });
      setEditingBookmarkId(id);
      setModalOpen(true);
    }
  };

  const getFavicon = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}`;
    } catch {
      return 'https://www.google.com/s2/favicons?domain=default';
    }
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type); // 'success' or 'error'
    setAlertVisible(true);

    setTimeout(() => {
      setAlertVisible(false);  // Hide alert after 3 seconds
    }, 3000);
  };

  const todayCount = bookmarks.filter(
    (b) => new Date(b.date).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1">
        <header className="flex flex-wrap justify-between items-center mb-10">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">BookmarkIT</h1>
            <p className="text-gray-800 text-sm">Easily save and organize your favorite websites</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gray-800 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-md hover:bg-gray-900 transition flex items-center"
          >
            <i className="feather-icon mr-2">+</i>Add Bookmark
          </button>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border rounded-lg p-4 shadow-sm flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <i data-feather="bookmark" className="text-blue-500"></i>
            </div>

            <div>
              <p className="text-sm text-gray-600">Total Bookmarks</p>
              <p className="text-xl font-bold text-gray-800">{bookmarks.length}</p>
            </div>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-full">
              <i data-feather="plus" className="text-green-500"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Added Today</p>
              <p className="text-xl font-bold text-gray-800">{todayCount}</p>
            </div>
          </div>
        </section>

        {/* Alert Notification */}
        {alertVisible && (
          <div
            className={`fixed bottom-8 right-4 py-2 px-4 rounded-lg shadow-lg transition-transform transform ${alertVisible ? "translate-x-0" : "translate-x-full"} 
            ${alertType === "success" ? "bg-green-500" : "bg-red-500"} text-white`}
          >
            {alertMessage}
          </div>
        )}

        {/* Bookmarks Display Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Bookmarks</h2>
          {bookmarks.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              <p>No bookmarks yet. Add your first bookmark!</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Sorting bookmarks by date in descending order */}
              {bookmarks
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="bg-white rounded-lg p-4 shadow-md border flex items-start space-x-4"
                  >
                    <img
                      src={getFavicon(bookmark.url)}
                      alt="Favicon"
                      className="w-6 h-6"
                    />
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {bookmark.name}
                      </h3>
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm break-all"
                      >
                        {bookmark.url}
                      </a>
                      <p className="text-gray-500 text-xs mt-1">
                        Added on {new Date(bookmark.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-1 mt-4">
                      <button
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                        className="text-red-500 hover:text-red-700 mt-2"
                      >
                        <div className="p-2">
                          <i data-feather="trash-2" className="text-red-500 w-4 h-4"></i>
                        </div>
                      </button>
                      <button
                        onClick={() => handleEditBookmark(bookmark.id)}
                        className="text-green-500 hover:text-green-700 mt-2"
                      >
                        <div className="p-2">
                          <i data-feather="edit" className="text-green-500 w-4 h-4"></i>
                        </div>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Bookmark</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Website Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Google"
                />
              </div>
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                  Website URL
                </label>
                <input
                  type="url"
                  id="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.google.com"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-900"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-gray-800 text-center text-gray-400 py-4">
        &copy; 2024 Bookmark Manager. All rights reserved.
      </footer>
    </div>
  );
}

export default BookmarkManager;
