import React, { Component } from "react";
import { Button } from "@mui/material";
import "../App.css";
import "../common/style/common.style.css";

const CLOUDNAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOADPRESET = import.meta.env.VITE_CLOUDINARY_PRESET;
const ACCENT = "#00BE83";
class CloudinaryUploadWidget extends Component {
  componentDidMount() {
    var myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDNAME,
        uploadPreset: UPLOADPRESET,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          document;
          // .getElementById("uploadedimage")
          // .setAttribute("src", result.info.secure_url);
          this.props.uploadImage(result.info.secure_url);
        }
      } //https://cloudinary.com/documentation/react_image_and_video_upload
    );
    document.getElementById("upload_widget").addEventListener(
      "click",
      function () {
        myWidget.open();
      },
      false
    );
  }

  render() {
    return (
      <Button
        id="upload_widget"
        size="sm"
        className="ml-2"
        sx={{ color: ACCENT }}
      >
        Upload Image +
      </Button>
    );
  }
}

export default CloudinaryUploadWidget;
