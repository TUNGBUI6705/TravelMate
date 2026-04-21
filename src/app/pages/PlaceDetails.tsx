import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { MapComponent } from '../components/maps/MapComponent';
import { placeService } from '../../data/services/placeService';
import { foursquareService } from '../../data/services/foursquareService';
import { openRouteService, type RouteResponse } from '../../data/services/openRouteService';
import { MapPin, Star, Navigation } from 'lucide-react';
import type { Place } from '../../domain/models/Place';

const cardBase = {
  background: '#ffffff',
  border: '1px solid #e8ecf3',
  borderRadius: '12px',
  padding: '16px',
};

export default function PlaceDetails() {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [tips, setTips] = useState<Array<{ id: string; text: string }>>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [routeProfile, setRouteProfile] = useState('driving-car');
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadPlaceData = async () => {
      if (!placeId) {
        if (isMounted) setError('Không tìm thấy địa điểm');
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        if (isMounted) setIsLoading(true);
        const firestorePlace = await placeService.getById(placeId);
        if (!firestorePlace) {
          if (isMounted) setError('Không thể tải thông tin địa điểm');
          if (isMounted) setIsLoading(false);
          return;
        }
        if (isMounted) setPlace(firestorePlace);

        // Load tips from Foursquare
        try {
          const tipsData = await foursquareService.getTips(placeId, 10);
          if (isMounted) setTips(tipsData);
        } catch {
          // Tips are optional
        }

        if (isMounted) setIsLoading(false);
      } catch (err) {
        if (isMounted) setError('Lỗi khi tải địa điểm');
        if (isMounted) setIsLoading(false);
      }
    };

    let watchId: number | null = null;

    const getLocation = () => {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.getCurrentPosition(
          (position) => {
            if (isMounted) {
              setUserLocation({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              });
            }
          },
          (error) => {
            console.warn('Geolocation error:', error);
          }
        ) as unknown as number;
      }
    };

    loadPlaceData();
    getLocation();

    return () => {
      isMounted = false;
    };
  }, [placeId]);

  const getDirections = async () => {
    if (!userLocation || !place) return;

    try {
      setIsLoadingRoute(true);
      setRouteError('');
      const routeData = await openRouteService.getDirections(
        userLocation.lat,
        userLocation.lon,
        place.location.lat,
        place.location.lng,
        routeProfile
      );
      if (routeData) {
        setRoute(routeData);
      }
    } catch (err) {
      setRouteError('Lỗi khi lấy hướng dẫn chỉ đường');
    } finally {
      setIsLoadingRoute(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#647087' }}>
        Đang tải...
      </div>
    );
  }

  if (!place) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#d32f2f' }}>
        {error || 'Không tìm thấy'}
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          color: '#1d4ed8',
          cursor: 'pointer',
          fontSize: '14px',
          marginBottom: '24px',
          fontWeight: '500',
        }}
      >
        ← Quay lại
      </button>

      <div style={{ display: 'grid', gap: '24px' }}>
        <div style={cardBase}>
          <h1 style={{ margin: 0, fontSize: '32px', color: '#1f2a3d', marginBottom: '12px' }}>
            {place.name}
          </h1>
          {place.address && (
            <div style={{ display: 'flex', gap: '8px', color: '#647087', fontSize: '14px', marginBottom: '12px' }}>
              <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{place.address}</span>
            </div>
          )}
          {place.googleRating && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <Star size={16} color="#f59e0b" fill="#f59e0b" />
              <span style={{ color: '#1f2a3d', fontWeight: '600' }}>{place.googleRating}</span>
            </div>
          )}
          {place.type && (
            <div style={{ fontSize: '12px', color: '#647087', marginTop: '8px' }}>
              📌 {place.type}
            </div>
          )}
        </div>

        <div style={cardBase}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1f2a3d' }}>
            🗺️ Vị trí
          </h2>

          {userLocation && (
            <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select
                value={routeProfile}
                onChange={(e) => setRouteProfile(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d9e0ea',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#1f2a3d',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                <option value="driving-car">🚗 Lái xe</option>
                <option value="cycling-regular">🚲 Đạp xe</option>
                <option value="foot-walking">🚶 Đi bộ</option>
              </select>
              <button
                onClick={getDirections}
                disabled={isLoadingRoute}
                style={{
                  padding: '8px 16px',
                  background: isLoadingRoute ? '#999' : '#0f766e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isLoadingRoute ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Navigation size={14} />
                {isLoadingRoute ? 'Đang tải...' : 'Lấy hướng dẫn'}
              </button>
            </div>
          )}

          <MapComponent
            lat={place.location.lat}
            lon={place.location.lng}
            zoom={16}
            markers={[
              {
                id: place.id,
                lat: place.location.lat,
                lon: place.location.lng,
                name: place.name,
                description: place.address,
              },
            ]}
            route={
              route
                ? {
                    startLat: userLocation!.lat,
                    startLon: userLocation!.lon,
                    endLat: place.location.lat,
                    endLon: place.location.lng,
                    coordinates: route.routes[0].geometry.coordinates,
                    distance: route.routes[0].summary.distance,
                    duration: route.routes[0].summary.duration,
                    color: '#0ea5e9',
                  }
                : undefined
            }
            showUserLocation={!!userLocation}
            userLocation={userLocation || undefined}
            style={{ height: '500px', borderRadius: '8px' }}
          />
        </div>

        {route && (
          <div style={cardBase}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Navigation size={24} color="#0ea5e9" />
              <h2 style={{ margin: 0, fontSize: '20px', color: '#1f2a3d' }}>
                Hướng dẫn chỉ đường
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
                marginBottom: '24px',
                paddingBottom: '24px',
                borderBottom: '2px solid #e5e7eb',
              }}
            >
              <div style={{ background: '#f0f9ff', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #0ea5e9' }}>
                <div style={{ fontSize: '11px', color: '#0369a1', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>
                  📏 Quãng đường
                </div>
                <div style={{ fontSize: '20px', color: '#0369a1', fontWeight: 'bold' }}>
                  {openRouteService.formatDistance(route.routes[0].summary.distance)}
                </div>
              </div>

              <div style={{ background: '#f5f3ff', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #a855f7' }}>
                <div style={{ fontSize: '11px', color: '#6d28d9', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>
                  ⏱️ Thời gian
                </div>
                <div style={{ fontSize: '20px', color: '#6d28d9', fontWeight: 'bold' }}>
                  {openRouteService.formatDuration(route.routes[0].summary.duration)}
                </div>
              </div>

              <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #eab308' }}>
                <div style={{ fontSize: '11px', color: '#854d0e', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>
                  🚗 Chế độ
                </div>
                <div style={{ fontSize: '14px', color: '#854d0e', fontWeight: 'bold' }}>
                  {routeProfile === 'driving-car' ? 'Lái' : routeProfile === 'cycling-regular' ? 'Đạp' : 'Bộ'}
                </div>
              </div>
            </div>

            {route.routes[0].segments && route.routes[0].segments.length > 0 && (
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2a3d', marginBottom: '16px' }}>
                  📍 Chi tiết các bước
                </div>
                {route.routes[0].segments.map((segment, segIdx) => (
                  <div
                    key={segIdx}
                    style={{
                      background: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      marginBottom: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        background: '#f0fdf4',
                        padding: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: '600',
                        color: '#166534',
                        fontSize: '14px',
                      }}
                    >
                      <span>Đoạn {segIdx + 1}</span>
                      <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#647087' }}>
                        {openRouteService.formatDistance(segment.distance)} • {openRouteService.formatDuration(segment.duration)}
                      </span>
                    </div>
                    <div style={{ padding: '12px' }}>
                      {segment.steps && segment.steps.length > 0 ? (
                        segment.steps.map((step, stepIdx) => (
                          <div
                            key={stepIdx}
                            style={{
                              display: 'flex',
                              gap: '8px',
                              marginBottom: stepIdx < segment.steps!.length - 1 ? '12px' : '0',
                              paddingBottom: stepIdx < segment.steps!.length - 1 ? '12px' : '0',
                              borderBottom:
                                stepIdx < segment.steps!.length - 1 ? '1px solid #e5e7eb' : 'none',
                            }}
                          >
                            <div style={{ fontSize: '18px', flexShrink: 0 }}>
                              {stepIdx === 0 ? '🔵' : stepIdx === segment.steps!.length - 1 ? '✅' : '➜'}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '13px', color: '#1f2a3d', fontWeight: '500', lineHeight: '1.5' }}>
                                {step.instruction}
                              </div>
                              <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                                {openRouteService.formatDistance(step.distance)} • {openRouteService.formatDuration(step.duration)}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ color: '#999', fontSize: '12px' }}>Không có chi tiết bước</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {place.description && (
          <div style={cardBase}>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#1f2a3d' }}>
              ℹ️ Thông tin
            </h2>
            <p style={{ margin: 0, color: '#647087', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {place.description}
            </p>
          </div>
        )}

        {tips.length > 0 && (
          <div style={cardBase}>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#1f2a3d' }}>
              💡 Gợi ý
            </h2>
            <div style={{ display: 'grid', gap: '8px' }}>
              {tips.map((tip, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    background: '#fffbeb',
                    borderRadius: '6px',
                    borderLeft: '3px solid #f59e0b',
                    fontSize: '13px',
                    color: '#92400e',
                    lineHeight: '1.5',
                  }}
                >
                  • {tip.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
