import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Polygon, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Trash2, RotateCcw, Shield } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PROTECTION_LEVELS } from '../../utils/constants';

// Fix for default marker icons in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const DrawingEvents = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick([e.latlng.lng, e.latlng.lat]);
        },
    });
    return null;
};

const FitBounds = ({ points }) => {
    const map = useMap();
    useEffect(() => {
        if (points && points.length > 0) {
            const bounds = L.latLngBounds(points.map(p => [p[1], p[0]]));
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        }
    }, [map, points]);
    return null;
};

// Custom Shield Icon for Markers
const createShieldIcon = (color) => {
    const iconMarkup = renderToStaticMarkup(
        <div className={`p-0.5 rounded-full border bg-white shadow-sm`} style={{ borderColor: color, color: color }}>
            <Shield size={12} fill={color} fillOpacity={0.2} />
        </div>
    );

    return L.divIcon({
        html: iconMarkup,
        className: 'custom-shield-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });
};

const ZoneDrawer = ({ coordinates, onChange, zones = [] }) => {
    const [points, setPoints] = useState(coordinates || []);

    useEffect(() => {
        setPoints(coordinates || []);
    }, [coordinates]);

    const handleMapClick = (newCoord) => {
        const updatedPoints = [...points, newCoord];
        setPoints(updatedPoints);
        onChange(updatedPoints);
    };

    const getZoneStyle = (level) => {
        const config = PROTECTION_LEVELS.find(p => p.value === level);
        switch (config?.color) {
            case 'red':
                return { fillColor: '#ef4444', color: '#b91c1c' };
            case 'orange':
                return { fillColor: '#f97316', color: '#c2410c' };
            case 'yellow':
                return { fillColor: '#eab308', color: '#a16207' };
            default:
                return { fillColor: '#3b82f6', color: '#1d4ed8' };
        }
    };

    const clearPoints = () => {
        setPoints([]);
        onChange([]);
    };

    const undoLastPoint = () => {
        const updatedPoints = points.slice(0, -1);
        setPoints(updatedPoints);
        onChange(updatedPoints);
    };

    // Convert points [lng, lat] to Leaflet [lat, lng]
    const leafletPoints = points.map(p => [p[1], p[0]]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                    {points.length === 0
                        ? 'Click on the map to start drawing your zone'
                        : `${points.length} points placed. Add at least 3 points for a valid zone.`}
                </span>
                <div className="flex space-x-2">
                    {points.length > 0 && (
                        <>
                            <button
                                type="button"
                                onClick={undoLastPoint}
                                className="p-1 px-2 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center"
                            >
                                <RotateCcw size={14} className="mr-1" />
                                Undo
                            </button>
                            <button
                                type="button"
                                onClick={clearPoints}
                                className="p-1 px-2 text-xs bg-white border border-red-200 text-red-600 rounded hover:bg-red-50 flex items-center"
                            >
                                <Trash2 size={14} className="mr-1" />
                                Clear All
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300 shadow-inner relative">
                <MapContainer
                    center={[0, 0]}
                    zoom={2}
                    className="h-full w-full cursor-crosshair"
                >
                    {/* Esri World Ocean Base Layer (Bathymetry/Depths) */}
                    <TileLayer
                        url="https://services.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
                        attribution='Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
                    />

                    {/* OpenSeaMap Overlay (Nautical markers, buoys, beacons) */}
                    <TileLayer
                        url="https://tile.openseamap.org/seamap/{z}/{x}/{y}.png"
                        attribution='Map data &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
                    />

                    <DrawingEvents onMapClick={handleMapClick} />

                    {/* Existing Zones for Context */}
                    {zones.map((zone) => {
                        if (!zone.geometry?.coordinates?.[0]) return null;
                        if (zone._id === 'preview') return null; // Don't show the one we are currently editing if passed

                        const positions = zone.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
                        const style = getZoneStyle(zone.protectionLevel);

                        // Centroid for marker
                        const latSum = positions.reduce((sum, p) => sum + p[0], 0);
                        const lngSum = positions.reduce((sum, p) => sum + p[1], 0);
                        const centroid = [latSum / positions.length, lngSum / positions.length];

                        return (
                            <React.Fragment key={zone._id}>
                                <Polygon
                                    positions={positions}
                                    pathOptions={{
                                        fillColor: style.fillColor,
                                        fillOpacity: 0.1,
                                        color: style.color,
                                        weight: 1,
                                        dashArray: '5, 5',
                                    }}
                                />
                                <Marker
                                    position={centroid}
                                    icon={createShieldIcon(style.color)}
                                    interactive={false}
                                />
                            </React.Fragment>
                        );
                    })}

                    {leafletPoints.length > 0 && (
                        <>
                            {leafletPoints.map((pos, idx) => (
                                <Marker
                                    key={idx}
                                    position={pos}
                                    draggable={true}
                                    eventHandlers={{
                                        dragend: (e) => {
                                            const latlng = e.target.getLatLng();
                                            const updatedPoints = [...points];
                                            updatedPoints[idx] = [latlng.lng, latlng.lat];
                                            setPoints(updatedPoints);
                                            onChange(updatedPoints);
                                        },
                                        click: (e) => {
                                            // Prevent map click when clicking marker
                                            L.DomEvent.stopPropagation(e);
                                        }
                                    }}
                                />
                            ))}

                            {leafletPoints.length >= 3 ? (
                                <Polygon
                                    positions={leafletPoints}
                                    pathOptions={{ color: '#0097a7', fillColor: '#0097a7', fillOpacity: 0.3 }}
                                />
                            ) : (
                                <Polyline
                                    positions={leafletPoints}
                                    pathOptions={{ color: '#0097a7', dashArray: '5, 5' }}
                                />
                            )}

                            {points.length > 0 && points.length < 2 && <FitBounds points={points} />}
                        </>
                    )}
                </MapContainer>

                <div className="absolute bottom-4 left-4 z-[1000] bg-white p-2 rounded shadow-md text-[10px] text-gray-500 max-w-[200px]">
                    Click to add points. Drag markers to adjust.
                </div>
            </div>
        </div>
    );
};

export default ZoneDrawer;
