/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function HeritageMapView({ center, markers: initialMarkers = [], onMarkerClick, onSelectCoordinates }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markersRef = useRef([]);
    const [currentMarker, setCurrentMarker] = useState(null);
    const [currentCoordinates, setCurrentCoordinates] = useState(null);
    const [currentAddress, setCurrentAddress] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchError, setSearchError] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    // Fetch address from coordinates
    const fetchAddress = useCallback(async (lng, lat) => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}&country=vn`
            );
            const data = await response.json();
            setCurrentAddress(data.features?.[0]?.place_name || 'Không tìm thấy địa chỉ');
        } catch (error) {
            setCurrentAddress('Lỗi khi lấy địa chỉ');
            console.error('Error fetching address:', error);
        }
    }, []);

    // Fetch suggestions from Mapbox Geocoding API (Vietnam only)
    const fetchSuggestions = useCallback(async (query) => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    query
                )}.json?access_token=${mapboxgl.accessToken}&country=vn&bbox=102.144,8.182,109.469,23.393&limit=5`
            );
            const data = await response.json();
            setSuggestions(
                data.features?.map((feature) => ({
                    place_name: feature.place_name,
                    coordinates: feature.center, // [lng, lat]
                    context: feature.context || [],
                    place_type: feature.place_type?.[0] || 'unknown',
                })) || []
            );
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        }
    }, []);

    // Handle select button click
    const handleSelectCoordinates = useCallback(() => {
        if (currentCoordinates && typeof currentCoordinates.lat === 'number' && typeof currentCoordinates.lng === 'number') {
            console.log('Gửi tọa độ từ "Chọn" button:', currentCoordinates);
            onSelectCoordinates(currentCoordinates);
        } else {
            console.log('Tọa độ không hợp lệ hoặc chưa chọn:', currentCoordinates);
            onSelectCoordinates(null);
        }
    }, [currentCoordinates, onSelectCoordinates]);

    // Initialize map
    const initializeMap = useCallback(() => {
        if (!mapContainer.current) return;

        mapboxgl.accessToken = 'pk.eyJ1IjoibmFtbGUwMjIwMDQiLCJhIjoiY205ejlmYm94MHI1djJqb2w5czloNDdrbyJ9.-P_PHQN7L283Z_qIGfgsOg';

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [center.lng, center.lat],
            zoom: 7,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
        map.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: { enableHighAccuracy: true },
                trackUserLocation: false,
                showUserHeading: true,
            }),
            'top-right'
        );

        // Add map click handler
        map.current.on('click', (e) => {
            const { lng, lat } = e.lngLat;
            if (typeof lat !== 'number' || typeof lng !== 'number') {
                console.log('Tọa độ click không hợp lệ:', { lat, lng });
                return;
            }

            if (currentMarker) {
                currentMarker.remove();
            }

            const newMarker = new mapboxgl.Marker({ color: 'blue', draggable: true })
                .setLngLat([lng, lat])
                .addTo(map.current);

            setCurrentMarker(newMarker);
            setCurrentCoordinates({ lat, lng });
            setSuggestions([]); // Clear suggestions on map click
            fetchAddress(lng, lat);

            newMarker.on('dragend', () => {
                const newLngLat = newMarker.getLngLat();
                if (typeof newLngLat.lat !== 'number' || typeof newLngLat.lng !== 'number') {
                    console.log('Tọa độ drag không hợp lệ:', newLngLat);
                    return;
                }
                setCurrentCoordinates({ lat: newLngLat.lat, lng: newLngLat.lng });
                fetchAddress(newLngLat.lng, newLngLat.lat);
            });
        });
    }, [center, fetchAddress]);

    // Update initial markers
    const updateInitialMarkers = useCallback(() => {
        if (!map.current) return;

        // Remove existing markers (except currentMarker)
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        // Add initial markers
        initialMarkers.forEach(({ lat, lng, title }) => {
            if (typeof lat !== 'number' || typeof lng !== 'number') {
                console.log('Tọa độ marker không hợp lệ:', { lat, lng, title });
                return;
            }

            const marker = new mapboxgl.Marker({ color: 'hsl(var(--heritage-primary))' })
                .setLngLat([lng, lat])
                .setPopup(new mapboxgl.Popup().setHTML(`<h3 class="font-medium">${title}</h3>`))
                .addTo(map.current);

            marker.getElement().addEventListener('click', () => {
                if (onMarkerClick) {
                    onMarkerClick({ lat, lng, title });
                }
                setCurrentCoordinates({ lat, lng });
                setSuggestions([]); // Clear suggestions on marker click
                fetchAddress(lng, lat);
            });

            markersRef.current.push(marker);
        });
    }, [initialMarkers, onMarkerClick, fetchAddress]);

    // Update map center
    const updateCenter = useCallback(() => {
        if (map.current) {
            const currentCenter = map.current.getCenter();
            if (
                Math.abs(center.lat - currentCenter.lat) > 0.0001 ||
                Math.abs(center.lng - currentCenter.lng) > 0.0001
            ) {
                map.current.setCenter([center.lng, center.lat]);
            }
        }
    }, [center]);

    // Handle search submission
    const handleSearch = useCallback(
        async (e, selectedPlace = null) => {
            e.preventDefault();
            let lng, lat, placeName, placeType, context;

            if (selectedPlace) {
                [lng, lat] = selectedPlace.coordinates;
                placeName = selectedPlace.place_name;
                placeType = selectedPlace.place_type;
                context = selectedPlace.context;
                setSearchQuery(placeName);
            } else if (!searchQuery.trim()) {
                return;
            } else {
                try {
                    const response = await fetch(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                            searchQuery
                        )}.json?access_token=${mapboxgl.accessToken}&country=vn&bbox=102.144,8.182,109.469,23.393`
                    );
                    const data = await response.json();
                    if (data.features && data.features.length > 0) {
                        [lng, lat] = data.features[0].center;
                        placeName = data.features[0].place_name;
                        placeType = data.features[0].place_type?.[0] || 'unknown';
                        context = data.features[0].context || [];
                    } else {
                        setSearchError('Không tìm thấy địa điểm.');
                        return;
                    }
                } catch (error) {
                    setSearchError('Lỗi khi tìm kiếm địa điểm.');
                    console.error('Search error:', error);
                    return;
                }
            }

            if (typeof lat !== 'number' || typeof lng !== 'number') {
                console.log('Tọa độ tìm kiếm không hợp lệ:', { lat, lng });
                setSearchError('Tọa độ không hợp lệ.');
                return;
            }

            map.current.setCenter([lng, lat]);
            map.current.setZoom(10);

            if (currentMarker) {
                currentMarker.remove();
            }

            // Create detailed popup
            const popupContent = `
                <div class="p-2">
                    <h3 class="font-medium">${placeName}</h3>
                    <p class="text-sm">Loại: ${placeType}</p>
                    <p class="text-sm">Khu vực: ${context.find((c) => c.id.includes('region'))?.text || 'Không xác định'
                }</p>
                </div>
            `;

            const newMarker = new mapboxgl.Marker({ color: 'red', draggable: true })
                .setLngLat([lng, lat])
                .setPopup(new mapboxgl.Popup().setHTML(popupContent))
                .addTo(map.current);

            setCurrentMarker(newMarker);
            setCurrentCoordinates({ lat, lng });
            setCurrentAddress(placeName);
            setSuggestions([]); // Clear suggestions after search
            setSearchError(null);

            newMarker.on('dragend', () => {
                const newLngLat = newMarker.getLngLat();
                if (typeof newLngLat.lat !== 'number' || typeof newLngLat.lng !== 'number') {
                    console.log('Tọa độ drag không hợp lệ:', newLngLat);
                    return;
                }
                setCurrentCoordinates({ lat: newLngLat.lat, lng: newLngLat.lng });
                fetchAddress(newLngLat.lng, newLngLat.lat);
            });
        },
        [searchQuery, fetchAddress]
    );

    // Handle input change to fetch suggestions
    const handleInputChange = useCallback(
        (e) => {
            const query = e.target.value;
            setSearchQuery(query);
            fetchSuggestions(query);
        },
        [fetchSuggestions]
    );

    // Handle suggestion selection
    const handleSuggestionSelect = useCallback(
        (e) => {
            const selectedPlace = suggestions.find((s) => s.place_name === e.target.value);
            if (selectedPlace) {
                handleSearch({ preventDefault: () => { } }, selectedPlace);
            }
        },
        [suggestions, handleSearch]
    );

    // Initialize map
    useEffect(() => {
        if (!map.current) {
            initializeMap();
        }
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [initializeMap]);

    // Update center and markers
    useEffect(() => {
        if (map.current) {
            updateCenter();
            updateInitialMarkers();
        }
    }, [updateCenter, updateInitialMarkers]);

    return (
        <div className="w-full h-full relative" role="region" aria-label="Bản đồ di sản">
            <div className="absolute top-4 left-4 z-10 w-80">
                <form onSubmit={handleSearch} className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleInputChange}
                            placeholder="Tìm kiếm địa điểm ở Việt Nam..."
                            className="flex-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Tìm kiếm địa điểm"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            aria-label="Tìm kiếm"
                        >
                            Tìm
                        </button>
                    </div>
                    {suggestions.length > 0 && (
                        <select
                            size={Math.min(suggestions.length, 5)}
                            onChange={handleSuggestionSelect}
                            className="w-full p-2 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Gợi ý địa điểm"
                        >
                            {suggestions.map((suggestion, index) => (
                                <option key={index} value={suggestion.place_name}>
                                    {suggestion.place_name}
                                </option>
                            ))}
                        </select>
                    )}
                </form>
                {searchError && <div className="mt-2 text-red-500 text-sm">{searchError}</div>}
            </div>
            <div ref={mapContainer} className="w-full h-full" />
            <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow-md text-sm flex flex-col gap-2 w-[600px]">
                {currentCoordinates && (
                    <div>
                        Tọa độ điểm đã chọn:
                        <br />
                        Lat: {currentCoordinates.lat.toFixed(6)}, Lng: {currentCoordinates.lng.toFixed(6)}
                    </div>
                )}
                <div className="flex gap-2 items-center">
                    <div className="flex-1">
                        <label className="block font-medium">Địa chỉ:</label>
                        <input
                            type="text"
                            value={currentAddress}
                            readOnly
                            placeholder="Chưa chọn địa điểm"
                            className="w-full p-2 rounded border border-gray-300 bg-gray-100"
                            aria-label="Địa chỉ hiện tại"
                        />
                    </div>
                    <button
                        onClick={handleSelectCoordinates}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-5"
                        aria-label="Chọn tọa độ"
                    >
                        Chọn
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HeritageMapView;