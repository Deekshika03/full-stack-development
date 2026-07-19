import { useState, useEffect } from "react";
import PostComposer from "./PostComposer";
import "./App.css";

const PLATFORMS = {
  Twitter: 280,
  Instagram: 200,
  LinkedIn: 3000,
};
export default function App() {
  const [platform, setPlatform] = useState("Twitter");
  const [post, setPost] = useState("");
  const [charLimit, setCharLimit] = useState(PLATFORMS["Twitter"]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [savedPosts, setSavedPosts] = useState(() => JSON.parse(localStorage.getItem("savedPosts") || "[]"));
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  useEffect(() => {
    setCharLimit(PLATFORMS[platform]);
  }, [platform]);
  useEffect(() => {
    const limit = PLATFORMS[platform];
    if (post.length === 0) {
      setMessage("");
      setIsError(false);
    } else if (post.length > limit) {
      setMessage(`Character limit exceeded by ${post.length - limit}!`);
      setIsError(true);
    } else {
      setMessage("okay to post")
      setIsError(false);
    }
  }, [post, platform]);
  function handlePost() {
    const newPost = { platform, post, timestamp: new Date().toLocaleString() };
    const updated = [newPost, ...savedPosts];
    setSavedPosts(updated);
    localStorage.setItem("savedPosts", JSON.stringify(updated));
    handleClear();
  }

  function handleDelete(index) {
    const updated = savedPosts.filter((_, i) => i !== index);
    setSavedPosts(updated);
    localStorage.setItem("savedPosts", JSON.stringify(updated));
  }
  function handleEdit(index) {
    setEditingIndex(index);
    setEditText(savedPosts[index].post);
  }
  function handleUpdate(index) {
    const updated = savedPosts.map((p, i) =>
      i === index ? { ...p, post: editText, timestamp: new Date().toLocaleString() } : p
    );
    setSavedPosts(updated);
    localStorage.setItem("savedPosts", JSON.stringify(updated));
    setEditingIndex(null);
    setEditText("");
  }
  function handleClear() {
    setPost("");
    setMessage("");
    setIsError(false);
  }
  return (
    <div className="app">
      <h1>Multi-Platform Post Composer</h1>
      <PostComposer
        platform={platform}
        setPlatform={setPlatform}
        post={post}
        setPost={setPost}
        charLimit={charLimit}
        message={message}
        isError={isError}
        onClear={handleClear}
        onPost={handlePost}
        platforms={Object.keys(PLATFORMS)}
      />
      {savedPosts.length > 0 && (
        <div className="saved-posts">
          <h2>Saved Posts</h2>
          {savedPosts.map((p, i) => (
            <div key={i} className="saved-post">
              <small>{p.platform} — {p.timestamp}</small>
              {editingIndex === i ? (
                <>
                  <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
                  <button className="btn-edit" onClick={() => handleUpdate(i)}>Save</button>
                  <button className="btn-delete" onClick={() => setEditingIndex(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <p>{p.post}</p>
                  <button className="btn-edit" onClick={() => handleEdit(i)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(i)}>Delete</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
