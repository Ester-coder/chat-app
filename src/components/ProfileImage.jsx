import React from "react";

const ProfileImage = ({ username }) => {
  const firstLetter = username.charAt(0).toUpperCase(); // Mengambil huruf pertama dan mengubahnya menjadi huruf kapital

  return (
    <div className="user-profile-image">
      {firstLetter} {/* Menampilkan huruf pertama sebagai avatar */}
    </div>
  );
};

export default ProfileImage;