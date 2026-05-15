import { Section, Container, Heading } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';

interface TravelTipsProps {
  bestTime: string;
  coordinates: { lat: number; lng: number };
}

function getSeasonalMood(bestTime: string): { mood: string; tip: string } {
  const lower = bestTime.toLowerCase();
  if (lower.includes('monsoon') || lower.includes('jul') || lower.includes('aug'))
    return { mood: '🌧️ Monsoon Magic', tip: 'Lush green landscapes, waterfalls at full flow. Carry rain gear and waterproof bags for cameras.' };
  if (lower.includes('oct') || lower.includes('nov') || lower.includes('dec'))
    return { mood: '🌅 Golden Season', tip: 'Clear skies, golden light. Perfect for photography during sunrise and sunset hours.' };
  if (lower.includes('jan') || lower.includes('feb') || lower.includes('mar'))
    return { mood: '❄️ Cool & Crisp', tip: 'Pleasant temperatures, migratory birds. Early mornings can be chilly — layer up.' };
  return { mood: '☀️ Warm & Bright', tip: 'Carry sun protection and stay hydrated. Best explored during early morning or late afternoon.' };
}

export function TravelTips({ bestTime, coordinates }: TravelTipsProps) {
  const seasonal = getSeasonalMood(bestTime);

  return (
    <Section spacing="lg">
      <Container className="max-w-4xl">
        <FadeIn>
          <p className="text-sm uppercase tracking-[0.2em] text-terracotta font-medium mb-4">
            Plan Your Visit
          </p>
          <Heading as="h2">Travel Essentials</Heading>
        </FadeIn>

        <StaggerContainer className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <StaggerItem>
            <div className="p-6 rounded-2xl bg-surface-alt">
              <p className="text-sm font-medium uppercase tracking-wider text-text-muted mb-2">Best Season</p>
              <p className="text-lg font-medium text-text-primary">{bestTime || 'Year-round'}</p>
              <p className="mt-2 text-sm text-text-secondary">{seasonal.mood}</p>
              <p className="mt-1 text-sm text-text-muted">{seasonal.tip}</p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="p-6 rounded-2xl bg-surface-alt">
              <p className="text-sm font-medium uppercase tracking-wider text-text-muted mb-2">Photography</p>
              <p className="text-lg font-medium text-text-primary">Golden Hour Recommended</p>
              <p className="mt-2 text-sm text-text-secondary">
                Sunrise 6:00–7:00 AM · Sunset 5:30–6:30 PM
              </p>
              <p className="mt-1 text-sm text-text-muted">
                Wide-angle for landscapes, telephoto for wildlife and architectural details.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="p-6 rounded-2xl bg-surface-alt">
              <p className="text-sm font-medium uppercase tracking-wider text-text-muted mb-2">Getting There</p>
              <p className="text-lg font-medium text-text-primary">Road from Udaipur</p>
              <p className="mt-2 text-sm text-text-secondary">
                Nearest airport: Udaipur (Maharana Pratap Airport, ~150 km).
              </p>
              <p className="mt-1 text-sm text-text-muted">
                Well-connected by road from Udaipur, Ahmedabad, and Indore. Local transport available.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="p-6 rounded-2xl bg-surface-alt">
              <p className="text-sm font-medium uppercase tracking-wider text-text-muted mb-2">Coordinates</p>
              <p className="text-lg font-medium text-text-primary">
                {coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Save for offline navigation. Mobile coverage may be limited in remote areas.
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </Container>
    </Section>
  );
}
