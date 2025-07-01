import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { MdCheck, MdClose, MdDone, MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, userData } from "../../userSlice";
import { updateUser } from "../../userApi";
import { Modal, Upload, Button, message } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import MyButton from "../MyButton";
import { UPLOAD_PRESET } from "../../../Keys";

const CLOUD_NAME = "dapki3g81";
const PRESET = UPLOAD_PRESET;

export default function Profile() {
  const dispatch = useDispatch();
  const currentUser = useSelector(userData);

  const [isNameEditing, setIsNameEditing] = useState(false);
  const [newName, setNewName] = useState(currentUser.name || "");

  const inputNameUseRef = useRef(null);

  useEffect(() => {
    if (isNameEditing && inputNameUseRef.current) {
      inputNameUseRef.current.focus();
    }
  });

  const [isAboutEditing, setIsAboutEditing] = useState(false);
  const [newAbout, setNewAbout] = useState(
    currentUser.about || "Hey there! I am using ChatrBox."
  );

  const inputAboutUseRef = useRef(null);

  useEffect(() => {
    if (isAboutEditing && inputAboutUseRef.current) {
      inputAboutUseRef.current.focus();
    }
  });

  const [isProfilePhotoEditing, setIsProfilePhotoEditing] = useState(false);
  const [newProfilePhoto, setNewProfilePhoto] = useState(
    currentUser.profileImageUrl ||
      "https://res.cloudinary.com/dapki3g81/image/upload/v1747918087/icon-5359553_1280_lml1l5.png"
  );

  const profilePhotoInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("cloud_name", CLOUD_NAME);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || "Cloudinary upload failed");
      }
      const data = await response.json();
      console.log("Cloudinary response:", data);
      return data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      throw err;
    }
  };

  const handleSaveProfile = async (fieldToUpdate, value) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      name: currentUser.name,
      about: currentUser.about,
      profileImageUrl: currentUser.profileImageUrl,
    };
    let imageUrl = value;

    try {
      if (fieldToUpdate === "name") {
        payload.name = value;
      } else if (fieldToUpdate === "about") {
        payload.about = value;
      } else if (fieldToUpdate === "proImg") {
        if (selectedFile) {
          imageUrl = await uploadImageToCloudinary(selectedFile);
        } else if (value === "CLEAR_PHOTO") {
          imageUrl = null;
        }
        payload.profileImageUrl = imageUrl;
      }

      const response = await updateUser(payload);
      console.log("Profile update successful:", response);

      dispatch(
        loginSuccess({
          isAuthenticated: currentUser.isAuthenticated,
          id: currentUser.id,
          name: response.name || currentUser.name,
          phoneNumber: response.phoneNumber || currentUser.phoneNumber,
          about: response.about || currentUser.about,
          profileImageUrl:
            response.profileImageUrl || currentUser.profileImageUrl,
          token: currentUser.token,
        })
      );

      setSuccess("Profile updated successfully!");
      message.success("Profile updated successfully!");

      setIsNameEditing(false);
      setIsAboutEditing(false);
      setIsProfilePhotoEditing(false);
      setSelectedFile(null);
      setShowPopup(false);
      setFileList([]);
      setPreviewUrl(null);

      if (fieldToUpdate === "proImg") {
        setNewProfilePhoto(
          imageUrl ||
            "https://res.cloudinary.com/dapki3g81/image/upload/v1747918087/icon-5359553_1280_lml1l5.png"
        );
      }

      if (fieldToUpdate === "profilePhoto" && value === "CLEAR_PHOTO") {
        setNewProfilePhoto(
          "https://res.cloudinary.com/dapki3g81/image/upload/v1747918087/icon-5359553_1280_lml1l5.png"
        );
      }
    } catch (err) {
      console.error("Profile update error:", err);
      const errorMessage =
        err.response?.data?.messages ||
        err.message ||
        "Failed to update profile. Please try again.";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setNewProfilePhoto(URL.createObjectURL(file));
      setIsProfilePhotoEditing(true);
    }
  };

  const handleClearPhoto = () => {
    handleSaveProfile("proImg", "CLEAR_PHOTO");
  };

  const handleCancelEdit = (field) => {
    setError(null);
    if (field === "name") {
      setNewName(currentUser.name || "");
      setIsNameEditing(false);
    } else if (field === "about") {
      setNewAbout(currentUser.about || "");
      setIsAboutEditing(false);
    } else if (field === "profilePhoto") {
      setNewProfilePhoto(
        currentUser.profileImageUrl ||
          "https://res.cloudinary.com/dapki3g81/image/upload/v1747918087/icon-5359553_1280_lml1l5.png"
      );
      setSelectedFile(null);
      setIsProfilePhotoEditing(false);
      setShowPopup(false);
      setFileList([]);
      setPreviewUrl(null);
    }
  };

  const uploadProps = {
    name: "file",
    fileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }

      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);

      setFileList([
        {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: previewUrl,
        },
      ]);

      return false;
    },
    onRemove: () => {
      setSelectedFile(null);
      setPreviewUrl(null);
      setFileList([]);
    },
    maxCount: 1,
  };

  const handleSaveProfileImage = () => {
    if (selectedFile) {
      handleSaveProfile("proImg", selectedFile);
    } else {
      message.warning("Please select an image first!");
    }
  };

  const closeModal = () => {
    setShowPopup(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileList([]);
    setError(null);
  };

  return (
    <>
      <div className="chat-list">
        <div className="chat-list-header">
          <div className="header-title">Profile</div>
        </div>
        <div className="profile-photo-img">
          <div className="profile-image-container">
            <img src={newProfilePhoto} alt="Profile" />
            <div className="profile-overlay" onClick={() => setShowPopup(true)}>
              <div className="edit-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-details-app">
          <div className="profile-details-label-data">
            <p className="profile-details-label">Your Name</p>
            <div className="profile-details-data-sec">
              {isNameEditing ? (
                <input
                  className="profile-details-data-input"
                  value={newName}
                  ref={inputNameUseRef}
                  onChange={(e) => setNewName(e.target.value)}
                  disabled={loading}
                  onBlur={
                    !loading
                      ? () => handleSaveProfile("name", newName)
                      : undefined
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !loading) {
                      e.preventDefault();
                      handleSaveProfile("name", newName);
                    }
                  }}
                />
              ) : (
                <p className="profile-details-data">{newName}</p>
              )}

              <p className="profile-details-edit-icon">
                {isNameEditing ? (
                  <>
                    <div
                      className="buttona-profile-edit"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginLeft: "15px",
                      }}
                    >
                      <button
                        onClick={() => handleSaveProfile("name", newName)}
                        disabled={loading}
                      >
                        <MdCheck />
                      </button>
                      <button
                        onClick={() => handleCancelEdit("name")}
                        disabled={loading}
                      >
                        <MdClose />
                      </button>
                    </div>
                  </>
                ) : (
                  <MdEdit onClick={() => setIsNameEditing(true)} />
                )}
              </p>
            </div>
          </div>
          <p
            style={{
              padding: "0 30px",
              fontSize: "15px",
              fontStyle: "italic",
              color: "rgba(255, 251, 252, 0.5)",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            This is not your username or PIN. This name will be visible to your
            ChatrBox contacts.
          </p>

          <div className="profile-details-label-data">
            <p className="profile-details-label">About</p>
            <div className="profile-details-data-sec">
              {isAboutEditing ? (
                <input
                  className="profile-details-data-input"
                  value={newAbout}
                  ref={inputAboutUseRef}
                  onChange={(e) => setNewAbout(e.target.value)}
                  disabled={loading}
                  onBlur={
                    !loading
                      ? () => handleSaveProfile("about", newAbout)
                      : undefined
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !loading) {
                      e.preventDefault();
                      handleSaveProfile("about", newAbout);
                    }
                  }}
                />
              ) : (
                <p className="profile-details-data">
                  {currentUser.about || "Hey there! I am using Chatrbox."}
                </p>
              )}
              <p className="profile-details-edit-icon">
                {isAboutEditing ? (
                  <>
                    <div
                      className="buttona-profile-edit"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginLeft: "15px",
                      }}
                    >
                      <button
                        onClick={() => handleSaveProfile("about", newAbout)}
                        disabled={loading}
                      >
                        <MdCheck />
                      </button>
                      <button
                        onClick={() => handleCancelEdit("about")}
                        disabled={loading}
                      >
                        <MdClose />
                      </button>
                    </div>
                  </>
                ) : (
                  <MdEdit onClick={() => setIsAboutEditing(true)} />
                )}
              </p>
            </div>
          </div>
        </div>

        <Modal
          style={{}}
          title={
            <span
              style={{ color: "#fffbfc", fontSize: "18px", fontWeight: "500" }}
            >
              Update Profile Photo
            </span>
          }
          open={showPopup}
          onCancel={closeModal}
          footer={[
            <Button
              key="cancel"
              onClick={closeModal}
              disabled={loading}
              style={{
                backgroundColor: "#2a3342",
                borderColor: "#4a78a6",
                color: "#fffbfc",
                borderRadius: "6px",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#2f3848";
                e.target.style.borderColor = "#4a78a6";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#2a3342";
                e.target.style.borderColor = "#4a78a6";
              }}
            >
              Cancel
            </Button>,
            <Button
              key="clear"
              type="default"
              icon={<DeleteOutlined style={{ color: "#ff6b6b" }} />}
              onClick={handleClearPhoto}
              disabled={loading}
              style={{
                marginLeft: 8,
                backgroundColor: "#2a3342",
                borderColor: "#ff6b6b",
                color: "#ff6b6b",
                borderRadius: "6px",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#ff6b6b";
                e.target.style.color = "#fffbfc";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#2a3342";
                e.target.style.color = "#ff6b6b";
              }}
            >
              Remove Photo
            </Button>,
            <Button
              key="save"
              type="primary"
              onClick={handleSaveProfileImage}
              loading={loading}
              disabled={!selectedFile}
              style={{
                marginLeft: 8,
                backgroundColor: "#4a78a6",
                borderColor: "#4a78a6",
                color: "#fffbfc",
                borderRadius: "6px",
              }}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = "rgba(74, 120, 166, 0.8)";
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = "#4a78a6";
                }
              }}
            >
              Save Photo
            </Button>,
          ]}
          width={500}
          modalRender={(modal) => (
            <div
              style={{
                backgroundColor: "#1b2232",
                borderRadius: "12px",
                border: "1px solid #2a3342",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              }}
            >
              {modal}
            </div>
          )}
          styles={{
            header: {
              backgroundColor: "#1b2232",
              borderBottom: "1px solid #2a3342",
              padding: "16px 24px",
              margin: 0,
            },
            body: {
              backgroundColor: "#1b2232",
              padding: "0",
              margin: 0,
            },
            footer: {
              backgroundColor: "#1b2232",
              borderTop: "1px solid #2a3342",
              padding: "16px 24px",
              margin: 0,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            },
            content: {
              backgroundColor: "#1b2232",
              padding: 0,
              margin: 0,
            },
            mask: {
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            },
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "24px",
              backgroundColor: "#1b2232",
              color: "#fffbfc",
            }}
          >
            <div style={{ marginBottom: 24 }}>
              <h4
                style={{
                  color: "#fffbfc",
                  marginBottom: "12px",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                Current Photo:
              </h4>
              <div
                className="currentImgSec"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={newProfilePhoto}
                  alt="Current Profile"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #2a3342",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h4
                style={{
                  color: "#fffbfc",
                  marginBottom: "12px",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                Upload New Photo:
              </h4>
              <Upload
                {...uploadProps}
                style={{
                  ".ant-upload-btn": {
                    backgroundColor: "#2f3848 !important",
                    borderColor: "#4a78a6 !important",
                    color: "#fffbfc !important",
                  },
                }}
              >
                <Button
                  icon={<UploadOutlined style={{ color: "#4a78a6" }} />}
                  style={{
                    backgroundColor: "#2f3848",
                    borderColor: "#4a78a6",
                    color: "#fffbfc",
                    borderRadius: "6px",
                    height: "40px",
                    padding: "0 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#4a78a6";
                    e.target.style.borderColor = "#4a78a6";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#2f3848";
                    e.target.style.borderColor = "#4a78a6";
                  }}
                >
                  Select Image
                </Button>
              </Upload>
            </div>

            {previewUrl && (
              <div style={{ marginTop: 24 }}>
                <h4
                  style={{
                    color: "#fffbfc",
                    marginBottom: "12px",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  Preview:
                </h4>
                <div
                  className="currentImgSec"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #4a78a6",
                      boxShadow: "0 4px 12px rgba(74, 120, 166, 0.3)",
                    }}
                  />
                </div>
              </div>
            )}

            <div
              style={{
                marginTop: 24,
                fontSize: "12px",
                color: "rgba(255, 251, 252, 0.7)",
                backgroundColor: "#2a3342",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #2f3848",
              }}
            >
              <p style={{ margin: "4px 0", color: "rgba(255, 251, 252, 0.8)" }}>
                • Supported formats: JPG, PNG, GIF
              </p>
              <p style={{ margin: "4px 0", color: "rgba(255, 251, 252, 0.8)" }}>
                • Maximum file size: 5MB
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
