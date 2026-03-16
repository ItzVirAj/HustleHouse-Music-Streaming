import { useMemo, useState } from "react";
import { UserData } from "../context/User";
import { getUserAvatar } from "../utils/userAvatar";
import "./Profile.css";

const Profile = () => {
  const { user, btnLoading, updateProfile } = UserData();
  const [name, setName] = useState(user?.name || "");
  const [file, setFile] = useState(null);

  const previewAvatar = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }

    return user?.avatar?.url || getUserAvatar(name || user?.name || "User");
  }, [file, name, user?.avatar?.url, user?.name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({ name, file });
    setFile(null);
  };

  return (
    <div className="profile-page">
      <section className="profile-shell">
        <div className="profile-hero">
          <div className="profile-avatar-wrap">
            <img
              src={previewAvatar}
              alt={name || user?.name || "User"}
              className="profile-avatar"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getUserAvatar(name || user?.name || "User");
              }}
            />
          </div>

          <div className="profile-copy">
            <span className="profile-kicker">Profile</span>
            <h1>{user?.name || "Listener"}</h1>
            <p>Update the public profile other users see across the app.</p>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <label htmlFor="profile-name">Display name</label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your username"
            required
          />

          <label htmlFor="profile-avatar">Profile photo</label>
          <input
            id="profile-avatar"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <button type="submit" className="profile-save-btn" disabled={btnLoading}>
            {btnLoading ? "Saving..." : "Save profile"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Profile;
