import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { Button } from "~/components/common/ui/Button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCreateHeritageMutation } from "~/store/apis/heritageApi";
import { Input } from "./Input";

const AdminHeritageCreate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [createHeritage, { isLoading }] = useCreateHeritageMutation();
  const [formData, setFormData] = useState({
    name: "",
    nameSlug: "",
    description: "",
    images: [],
    imagePreviews: [],
    location:
      "86 Đ. Lê Thánh Tôn, Bến Nghé, Quận 1, Hồ Chí Minh 700000, Việt Nam",
    locationSlug: "",
    locationNormalized: "",
    coordinates: { latitude: "10.7725484", longitude: "106.7018357" },
    stats: {
      averageRating: "0",
      totalReviews: "0",
      totalVisits: "0",
      totalFavorites: "0",
    },
    knowledgeTestId: null,
    leaderboardId: null,
    leaderboardSummary: {
      topScore: "0",
      topUser: { userId: null, userName: "" },
      totalParticipants: "0",
    },
    knowledgeTestSummary: {
      title: "",
      questionCount: "0",
      difficulty: "Medium",
    },
    rolePlayIds: [],
    additionalInfo: {
      architectural: null,
      culturalFestival: null,
      historicalEvents: [],
    },
    status: "ACTIVE",
    popularTags: [],
    tagsSlug: [],
  });
  const [errors, setErrors] = useState({});
  const [historicalEvent, setHistoricalEvent] = useState({
    title: "",
    description: "",
  });

  // Debug state changes for imagePreviews
  useEffect(() => {
    console.log("Current imagePreviews:", formData.imagePreviews);
  }, [formData.imagePreviews]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        return { ...prev, [parent]: { ...prev[parent], [child]: value } };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleArrayInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.split(",").map((item) => item.trim()),
    }));
  };

  const handleHistoricalEventChange = (e) => {
    const { name, value } = e.target;
    setHistoricalEvent((prev) => ({ ...prev, [name]: value }));
  };

  const addHistoricalEvent = () => {
    if (historicalEvent.title && historicalEvent.description) {
      setFormData((prev) => ({
        ...prev,
        additionalInfo: {
          ...prev.additionalInfo,
          historicalEvents: [
            ...prev.additionalInfo.historicalEvents,
            historicalEvent,
          ],
        },
      }));
      setHistoricalEvent({ title: "", description: "" });
    } else {
      console.error("Vui lòng điền đầy đủ thông tin sự kiện lịch sử.");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files && files.length > 0) {
      const newImages = [...formData.images, ...files];
      const newPreviews = [
        ...formData.imagePreviews,
        ...files.map((file) => URL.createObjectURL(file)),
      ];
      setFormData((prev) => ({
        ...prev,
        images: newImages,
        imagePreviews: newPreviews,
      }));
    }
  };

  const handleRemoveImage = (index) => {
    console.log("Removing image at index:", index);
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const logFormData = () => {
    const formDataToLog = {
      ...formData,
      images: formData.images.map((file) => file.name),
    };
    console.log("Dữ liệu form:", JSON.stringify(formDataToLog, null, 2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    logFormData();

    const formDataToSend = new FormData();
    formData.images.forEach((image) => formDataToSend.append("images", image));
    formDataToSend.append("name", formData.name);
    formDataToSend.append("nameSlug", formData.nameSlug);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("locationSlug", formData.locationSlug);
    formDataToSend.append("locationNormalized", formData.locationNormalized);
    formDataToSend.append(
      "coordinates.latitude",
      formData.coordinates.latitude
    );
    formDataToSend.append(
      "coordinates.longitude",
      formData.coordinates.longitude
    );
    formDataToSend.append("stats.averageRating", formData.stats.averageRating);
    formDataToSend.append("stats.totalReviews", formData.stats.totalReviews);
    formDataToSend.append("stats.totalVisits", formData.stats.totalVisits);
    formDataToSend.append(
      "stats.totalFavorites",
      formData.stats.totalFavorites
    );
    if (formData.knowledgeTestId)
      formDataToSend.append("knowledgeTestId", formData.knowledgeTestId);
    if (formData.leaderboardId)
      formDataToSend.append("leaderboardId", formData.leaderboardId);
    formDataToSend.append(
      "leaderboardSummary.topScore",
      formData.leaderboardSummary.topScore
    );
    formDataToSend.append(
      "leaderboardSummary.totalParticipants",
      formData.leaderboardSummary.totalParticipants
    );
    formDataToSend.append(
      "knowledgeTestSummary.title",
      formData.knowledgeTestSummary.title
    );
    formDataToSend.append(
      "knowledgeTestSummary.questionCount",
      formData.knowledgeTestSummary.questionCount
    );
    formDataToSend.append(
      "knowledgeTestSummary.difficulty",
      formData.knowledgeTestSummary.difficulty
    );
    formData.popularTags.forEach((tag) =>
      formDataToSend.append("popularTags", tag)
    );
    formData.tagsSlug.forEach((tag) => formDataToSend.append("tagsSlug", tag));
    formData.rolePlayIds.forEach((id) =>
      formDataToSend.append("rolePlayIds", id)
    );
    if (formData.additionalInfo.architectural)
      formDataToSend.append(
        "additionalInfo.architectural",
        formData.additionalInfo.architectural
      );
    if (formData.additionalInfo.culturalFestival)
      formDataToSend.append(
        "additionalInfo.culturalFestival",
        formData.additionalInfo.culturalFestival
      );
    formData.additionalInfo.historicalEvents.forEach((event, index) => {
      formDataToSend.append(
        `additionalInfo.historicalEvents[${index}].title`,
        event.title
      );
      formDataToSend.append(
        `additionalInfo.historicalEvents[${index}].description`,
        event.description
      );
    });
    formDataToSend.append("status", formData.status);

    try {
      await createHeritage(formDataToSend).unwrap();
      console.log("Tạo di tích thành công!");
      navigate("/admin/heritages");
    } catch (error) {
      setErrors(
        error.data?.errors || { message: "Có lỗi xảy ra khi tạo di tích." }
      );
      console.error("Tạo di tích thất bại:", error);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  return (
    <div className="min-h-screen bg-gray-100 mt-20 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-start mb-6 align-center">
          <ArrowLeft
            cursor={"pointer"}
            onClick={() => navigate("/admin/heritages")}
            size={20}
            className="mr-2"
          />
          <h1 className="text-2xl font-bold text-gray-800">Tạo Di tích Mới</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên di tích
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="Nhập tên di tích"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <ReactQuill
              style={{
                height: "200px",
                marginBottom: "50px",
              }}
              value={formData.description}
              onChange={handleDescriptionChange}
              modules={modules}
              formats={formats}
              className="mt-1 bg-white rounded-md shadow-sm"
              placeholder="Nhập mô tả di tích (hỗ trợ định dạng, hình ảnh, video...)"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Images */}
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hình ảnh
              </label>
              <div className="mt-1 flex items-center">
                <Button
                  type="button"
                  onClick={handleOpenFileDialog}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  <Upload size={20} className="mr-2" />
                  Tải lên hình ảnh
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>
              {formData.imagePreviews.length > 0 && (
                <div className="mt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {formData.imagePreviews.map((preview, index) => (
                      <div
                        key={`${preview}-${index}`} // Sử dụng key duy nhất hơn
                        className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 z-10"
                          aria-label={`Xóa hình ảnh ${index + 1}`}
                        >
                          <X size={14} />
                        </button>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Địa điểm
            </label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1"
              placeholder="Nhập địa điểm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bản đồ
            </label>
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.447!2d${formData.coordinates.longitude}!3d${formData.coordinates.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${formData.coordinates.latitude}%2C${formData.coordinates.longitude}!5e0!3m2!1sen!2s!4v1634567890123`}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-md shadow-sm mt-1"
            ></iframe>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tọa độ
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="coordinates.latitude"
                value={formData.coordinates.latitude}
                onChange={handleInputChange}
                placeholder="Vĩ độ"
                readOnly
              />
              <Input
                name="coordinates.longitude"
                value={formData.coordinates.longitude}
                onChange={handleInputChange}
                placeholder="Kinh độ"
                readOnly
              />
            </div>
            {errors.coordinates && (
              <p className="text-red-500 text-sm mt-1">{errors.coordinates}</p>
            )}
          </div>

          {/* Additional Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Thông tin kiến trúc
            </label>
            <Input
              name="additionalInfo.architectural"
              value={formData.additionalInfo.architectural || ""}
              onChange={handleInputChange}
              className="mt-1"
              placeholder="Nhập thông tin kiến trúc"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lễ hội văn hóa
            </label>
            <Input
              name="additionalInfo.culturalFestival"
              value={formData.additionalInfo.culturalFestival || ""}
              onChange={handleInputChange}
              className="mt-1"
              placeholder="Nhập thông tin lễ hội"
            />
          </div>

          {/* Historical Events */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sự kiện lịch sử
            </label>
            <div className="grid grid-cols-2 gap-4 mt-1">
              <Input
                name="title"
                value={historicalEvent.title}
                onChange={handleHistoricalEventChange}
                placeholder="Tiêu đề sự kiện"
              />
              <Input
                name="description"
                value={historicalEvent.description}
                onChange={handleHistoricalEventChange}
                placeholder="Mô tả sự kiện"
              />
            </div>
            <Button type="button" onClick={addHistoricalEvent} className="mt-2">
              Thêm sự kiện
            </Button>
            <ul className="mt-2 space-y-2">
              {formData.additionalInfo.historicalEvents.map((event, index) => (
                <li key={index} className="p-2 bg-gray-50 rounded-md">
                  <strong>{event.title}</strong>: {event.description}
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags (cách nhau bởi dấu phẩy)
            </label>
            <Input
              value={formData.popularTags.join(",")}
              onChange={(e) =>
                handleArrayInputChange("popularTags", e.target.value)
              }
              className="mt-1"
              placeholder="Nhập tags"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 w-full border rounded-md p-2"
            >
              <option value="ACTIVE">Kích hoạt</option>
              <option value="INACTIVE">Không kích hoạt</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              <Save size={20} className="mr-2" />
              {isLoading ? "Đang lưu..." : "Lưu di tích"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminHeritageCreate;
