// import { useState } from "react";
// import {
//   GoogleMap,
//   useJsApiLoader,
//   Autocomplete,
// } from "@react-google-maps/api";

// const libraries = ["places"];

// const LocationInput = ({ setLocation }) => {
//   const { isLoaded, loadError } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao", // Thay thế bằng API key của bạn
//     libraries,
//   });
//   const [address, setAddress] = useState("");

//   const handlePlaceChanged = () => {
//     const place = autocomplete.getPlace();
//     setAddress(place.formatted_address);
//     setLocation({
//       latitude: place.geometry.location.lat(),
//       longitude: place.geometry.location.lng(),
//     });
//   };

//   return (
//     <div>
//       <Autocomplete
//         onLoad={(autocomplete) => {
//           autocomplete = autocomplete;
//         }}
//         onPlaceChanged={handlePlaceChanged}
//       >
//         <input
//           type="text"
//           placeholder="Nhập địa điểm"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//         />
//       </Autocomplete>
//     </div>
//   );
// };

// export default LocationInput;
